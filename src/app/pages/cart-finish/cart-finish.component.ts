// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Módulos
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SelectModule } from 'primeng/select';

// Serviços
import { LoadingService } from '../../service/loading.service';
import { OrderService } from '../../service/order.service';


// Modelos
import {
  CalculateOrder,
  ListOrderItensRequest,
  OrderFront,
  ReservationRequest,
  ResultOrder,
} from '../../models/order.model';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    PaginatorModule,
    CommonModule,
    ProgressSpinnerModule,
    DatePickerModule,
    ConfirmPopupModule,
    Toast,
    SelectModule
  ],
  exportAs: 'app-cart-finish',
  templateUrl: './cart-finish.component.html',
  styleUrls: ['./cart-finish.component.scss']
})
export class CartFinishComponent implements OnInit {

  // Froms
  CustomerForm: FormGroup;

  loading: boolean = false;
  submitted: boolean = false;
  enableMessage: boolean = false;
  openMap: boolean = true;
  securityCode: string = '';
  resultOrder: ResultOrder[] = []
  ListOrderItensGrouped!: Record<string, ListOrderItensRequest[]>;
  // Controle de interface
  showDialog: boolean = false;
  showDialogConfirm: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  viewSteps:number = 0;
  

  // Carrinho e pedidos
  hasCart: boolean = false;
  order: OrderFront[] | null = [];
  totalTemporario: number = 0;
  quantity: number = 0;
  colorMessage: string | undefined = undefined;


  // Produtos e filtros
  selectedProductId: number = 0;

  productfilter: any[] = [];
  searchTerm: string = '';

  // Mensagens e erros
  errorMessage: boolean = false;

  // Paginação
  first: number = 0;
  rows: number = 10;


  pickupDate: Date | undefined;
  pickupDeadline: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  disableDays: number[] = [0, 1, 2, 3, 4, 5, 6];

  selectedPickupLocation:any;

  message: string = "A reserva será mantida por um dia. Após esse período, a reserva será cancelada e os produtos poderão ser reservados por outras pessoas.";

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.checkCardEmpty();
    this.CustomerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });
  }


  ngOnInit(): void {

    this.dataPickerConfig();

    this.checkCustomer();

    const listProducts: ListOrderItensRequest[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (listProducts.length == 0) {
      this.loadingService.hide();
      this.hasCart = false;
      return;
    }
    this.hasCart = true;

    this.ListOrderItensGrouped = this.orderService.groupSeller(listProducts);

    this.calculateOrder(this.ListOrderItensGrouped);

  }

  checkCustomer() {
    const customer = JSON.parse(localStorage.getItem('customerData') || '{}');
    if(customer.length == 0){
      return;
    }

    this.CustomerForm.patchValue({
      name: customer ? customer[0]?.name : '',
      email: customer ? customer[0]?.email : '',
      phone: customer ? customer[0]?.phone : '',
    });
  }

  checkEnableDays(order:OrderFront){
    order.pickupDate = undefined;
    order.pickupDeadline = undefined;
    order.disableDays = [0, 1, 2, 3, 4, 5, 6];

    order.selectedPickupLocation?.pickupDays.forEach((element:number) => {
      order.disableDays = order.disableDays.filter((day) => day !== element);
    });
  }

  checkCardEmpty() {
    const listProducts: ListOrderItensRequest[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (listProducts.length == 0) {
      this.navigateToHome();
    }
  }

  copyToClipboard(code:string) {
    navigator.clipboard.writeText(code);
  }



  showMessage() {
    this.enableMessage = !this.enableMessage;
    if (this.enableMessage == true) {
      setTimeout(() => {
        this.enableMessage = false
      }, 9000);
    }
  }

  dataPickerConfig() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.minDate = today;

    const max = new Date(today);
    max.setMonth(max.getMonth() + 1);

    this.minDate = today;
    this.maxDate = max;
  }

  UpdatePickupDeadline(order: OrderFront) {
    this.enableMessage = false
    if (order.pickupDate) {
      order.pickupDeadline = new Date(order.pickupDate);
      order.pickupDeadline.setDate(order.pickupDeadline.getDate() + 1);
    }
  }

  closeConfirmDialog(): void {
    this.showDialog = false;
  }

  finishOrder() {
    this.showDialog = false;
    this.loadingService.show();
    this.orderService.createOrder(this.createOrder()).subscribe({
      next: (result) => {
        this.showConfirm('Reserva realizada com sucesso!', "#93c732");
        this.resultOrder = result
        this.loadingService.hide();
        this.SaveCustomerDates();
        this.viewSteps += 1;
      },
      error: (error) => {
        this.showConfirm("Erro ao finalizar a reserva. Tente novamente mais tarde.", "#d32f2f");
        this.loadingService.hide();
      }
    });

  }

  calculateOrder(ListOrderItensGrouped:Record<string, ListOrderItensRequest[]>): void {
    this.loadingService.show();

    const payload = this.orderService.createCalculateOrderPayload(ListOrderItensGrouped);

    const requests = payload.map((e: CalculateOrder)=> this.orderService.calculateOrder(e));
    forkJoin(requests).subscribe({
      next: (result) => {
        this.order = result.map(o => ({ ...o,
          selectedPickupLocation: null,
          pickupDate: this.pickupDate,
          pickupDeadline: this.pickupDeadline,
          disableDays: this.disableDays}));
        const totalFee = result.reduce((acc, curr) => acc + curr.fee, 0);
        const totalProducts = result.reduce((acc, curr) => acc + curr.total, 0);

        console.log(this.order)

        this.totalTemporario = totalFee + totalProducts;
        this.loadingService.hide();
      },
      error: (error) => {
        console.log(error)
        this.loadingService.hide();
      },
    })
  }

  validateReservation(): void {

    this.order?.every(element => element.pickupDate != null);

    this.CustomerForm.markAllAsTouched();
    this.CustomerForm.updateValueAndValidity();

    if (this.CustomerForm.get('name')?.getRawValue() !== '' &&
        this.CustomerForm.get('email')?.getRawValue() &&
        this.CustomerForm.get('phone')?.getRawValue() && this.order?.every(element => element.pickupDate != null)
      ) {

      this.errorMessage = false;
      this.viewSteps += 1;
      return;
    }

    this.errorMessage = true;
  }

  getFieldError(fieldName: string): string {
    const field = this.CustomerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  verifyLabel():string{
    switch (this.viewSteps) {
      case 0:
        return 'Realizar Reserva';

      case 1:
        return 'Confirmar Retirada';

      case 2:
        return 'Verificar Meus Dados';

      default:
        return 'Realizar Reserva'
    }
  }

  verifySecondButon():void{
    switch (this.viewSteps) {
      case 0:
        this.navigate(`carrinho`);
          break
      case 1:
        this.viewSteps -= 1;
          break
      case 2:
        this.navigate(`home`);
          break 
      default:
        this.navigate(`carrinho`)
          break
    }
  }

  verifyButon():void{
    switch (this.viewSteps) {
      case 0:
        this.validateReservation();
          break
      case 1:
        this.finishOrder();
          break
      case 2:
        this.navigateToUser();
          break 
      default:
        this.validateReservation();
          break
    }
  }

private SaveCustomerDates() {
  if (!this.order) return;

  const newCustomerDate = this.order.map(orderGroup => ({

    name: this.CustomerForm.value.name,
    email: this.CustomerForm.value.email,
    phone: this.CustomerForm.value.phone,

    sellerId: orderGroup.seller.id,
    pickupDate: orderGroup.pickupDate, 
    pickupDeadline: orderGroup.pickupDeadline,
    pickupLocation: orderGroup.selectedPickupLocation,
    securityCode: this.resultOrder.filter(e => e.sellerName == orderGroup.seller.name),

    listOrderItens: orderGroup.listOrderItens.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      sellerId: item.sellerId,
    }))
  }));


  const storedData = localStorage.getItem('customerData');
  let currentData: any[] = [];

  if (storedData) {
    try {
      currentData = JSON.parse(storedData);
      
      if (!Array.isArray(currentData)) {
        currentData = [];
      }
    } catch (e) {
      console.error("Erro ao ler dados do localStorage", e);
      currentData = [];
    }
  }

  const updatedData = [...currentData, ...newCustomerDate];

  localStorage.setItem('customerData', JSON.stringify(updatedData));

}

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      name: 'Nome',
      phone: 'Telefone'
    };
    return labels[fieldName] || fieldName;
  }

  private createOrder(): ReservationRequest {

    let order: any =[];

    this.order?.forEach(element => {
      order.push(
        {
          pickupDate: element.pickupDate,
          pickupDeadline: element.pickupDeadline,
          pickupLocation: element.selectedPickupLocation,
          listOrderItens: element.listOrderItens,
          sellerid: element.seller.id,
        }
      )
    });    

    return {
      OrderDetails: order,
      userId: null,
      email: this.CustomerForm.value.email,
      phoneNumber: this.CustomerForm.value.phone,
      fullName: this.CustomerForm.value.name,
    };
  }


  showConfirm(message: string, severity?: string): void {

    this.colorMessage = severity ?? undefined;

    this.messageService.add({
      key: 'confirm',
      severity: 'custom',
      summary: message,
      styleClass: 'bg-white rounded-2xl',
      life: 2000
    });
    this.cdr.detectChanges();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onClick(): void {
    this.extendBar = !this.extendBar;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  navigateToDetail(id: number): void {
    this.router.navigate([`detalhe-compra/${id}`]);
  }

  navigateToHome(): void {
    localStorage.removeItem('cart');
    localStorage.removeItem('expireDate');

    this.router.navigate([`home`]);
  }

  navigateToUser(){
    localStorage.removeItem('cart');
    localStorage.removeItem('expireDate');

    this.router.navigate([`user`]);
  }

}
