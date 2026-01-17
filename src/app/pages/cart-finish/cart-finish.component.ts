// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

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
import { Dialog } from 'primeng/dialog';

// Serviços
import { LoadingService } from '../../service/loading.service';
import { OrderService } from '../../service/order.service';


// Modelos
import {
  CalculateOrder,
  ListOrderItensRequest,
  OrderCalculated,
  ReservationRequest,
} from '../../models/order.model';
import { Seller } from '../../models/seller.model';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ChangeDetectorRef } from '@angular/core';



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
    Dialog,
    Toast
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

  // Controle de interface
  showDialog: boolean = false;
  showDialogConfirm: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Carrinho e pedidos
  hasCart: boolean = false;
  order!: OrderCalculated | null;
  totalTemporario: number = 0;
  quantity: number = 1;
  colorMessage: string | undefined = undefined;


  // Produtos e filtros
  selectedProductId: number = 0;
  productfilter: any[] = [];
  searchTerm: string = '';
  sellerList: Seller[] = [];

  // Mensagens e erros
  errorMessage: boolean = false;

  // Paginação
  first: number = 0;
  rows: number = 10;


  pickupDate: Date | undefined;
  pickupDeadline: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;

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
    const listSeller = this.filterSeller(listProducts);
    this.getListSellerAddres(listSeller);
    this.hasCart = true;

    const payload = this.createCalculateOrderFromItems(listProducts);
    this.calculateOrder(payload)

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

  checkCardEmpty() {
    const listProducts: ListOrderItensRequest[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (listProducts.length == 0) {
      this.navigateToHome();
    }
  }

  copyToClipboard() {
    const codigo = this.securityCode;
    navigator.clipboard.writeText(codigo);
  }


  filterSeller(listProducts: ListOrderItensRequest[]): string[] {
    return [... new Set(listProducts.map(p => p.sellerId).filter(id => !!id))]
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

  UpdatePickupDeadline() {
    this.enableMessage = false
    if (this.pickupDate) {
      this.pickupDeadline = new Date(this.pickupDate);
      this.pickupDeadline.setDate(this.pickupDeadline.getDate() + 1);
    }
  }

  getListSellerAddres(listSeller: string[]) {
    this.loadingService.show();
    const requests = listSeller.map(id => this.orderService.getSellerAddress(id))

    forkJoin(requests).subscribe({
      next: (results) => {
        this.sellerList = results;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Erro em uma das requisições', error);
        this.loadingService.hide();
      }
    });
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
        this.loadingService.hide();
        this.showDialogConfirm = true;
        this.SaveCustomerDates();
      },
      error: (error) => {
        this.showConfirm("Erro ao finalizar a reserva. Tente novamente mais tarde.", "#d32f2f");
        this.loadingService.hide();
      }
    });

  }

  calculateOrder(payload: CalculateOrder): void {
    this.loadingService.show();
    this.orderService.calculateOrder(payload).subscribe({
      next: (result) => {
        this.order = result;
        this.totalTemporario = this.order.fee + this.order.total;
        this.loadingService.hide();
      },
      error: (error) => {
        console.log(error)
        this.loadingService.hide();
      },
    })
  }

  validateReservation(): void {

    this.CustomerForm.markAllAsTouched();
    this.CustomerForm.updateValueAndValidity();

    if (this.CustomerForm.get('name')?.getRawValue() !== '' &&
        this.CustomerForm.get('email')?.getRawValue() &&
        this.CustomerForm.get('phone')?.getRawValue() && this.pickupDate
      ) {

      this.errorMessage = false;
      this.verifySecurityCode();
      this.showDialog = true;
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

  private SaveCustomerDates() {

    const customerDate = this.getCustomer();

    const newCustomerDate = [
      {
      pickupDate: this.pickupDate,
      pickupDeadline: this.pickupDeadline,
      securityCode: customerDate[0]?.securityCode ? customerDate[0]?.securityCode : this.securityCode,
      name: this.CustomerForm.value.name,
      email: this.CustomerForm.value.email,
      phone: this.CustomerForm.value.phone,
      listOrderItens: JSON.parse(localStorage.getItem('cart') || '[]')
    }]

    if (customerDate.length > 0) {
      localStorage.setItem('customerData', JSON.stringify([...customerDate, ...newCustomerDate]));
      return;
    }

    localStorage.setItem('customerData', JSON.stringify(newCustomerDate));


  }

  private getCustomer() {
    const customerData = JSON.parse(localStorage.getItem('customerData') || '[]');
    return customerData;
  }


  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      name: 'Nome',
      phone: 'Telefone'
    };
    return labels[fieldName] || fieldName;
  }

  private generateSecurityCode(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const all = letters + numbers;

    let result = '';

    result += letters.charAt(Math.floor(Math.random() * letters.length));

    result += numbers.charAt(Math.floor(Math.random() * numbers.length));

    for (let i = 0; i < 2; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length));
    }

    return result.split('').sort(() => Math.random() - 0.5).join('').toUpperCase();
  }

  private createOrder(): ReservationRequest {
    
    return {
      securityCode: { value: this.securityCode },
      userId: null,
      email: this.CustomerForm.value.email,
      phoneNumber: this.CustomerForm.value.phone,
      fullName: this.CustomerForm.value.name,
      reservationDate: new Date(),
      pickupDate: this.pickupDate!,
      pickupDeadline: this.pickupDeadline!,
      pickupLocation: this.sellerList[0]!.pickupLocation[0],
      orderStatus: 0,
      listOrderItens: JSON.parse(localStorage.getItem('cart') || '[]')
    };
  }

  private verifySecurityCode():void{
     const customerDate = this.getCustomer();

    if(customerDate[0]?.securityCode){
      this.securityCode = customerDate[0]?.securityCode;
      return;
    }

    this.securityCode = this.generateSecurityCode();
  }

  private createCalculateOrderFromItems(items: ListOrderItensRequest[]): CalculateOrder {
    return { listOrderItens: items };
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

  navigate() {
    this.router.navigate(["login"]);
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

  navigateToProducts(): void {
    this.router.navigate([`carrinho`]);
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
