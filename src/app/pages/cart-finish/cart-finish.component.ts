// Angular Core
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

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

// Serviços
import { LoadingService } from '../../service/loading.service';
import { OrderService } from '../../service/order.service';


// Modelos
import {
  CalculateOrder,
  ListOrderItensRequest,
  OrderCalculated,
} from '../../models/order.model';
import { forkJoin } from 'rxjs';
import { Seller } from '../../models/seller.model';


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
],
  exportAs: 'app-cart-finish',
  templateUrl: './cart-finish.component.html',
  styleUrls: ['./cart-finish.component.scss']
})
export class CartFinishComponent implements OnInit{

  loading: boolean = false;
  submitted: boolean = false;
  enableMessage: boolean = false;
  openMap: boolean = false;

// Controle de interface
  showDialog: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

// Carrinho e pedidos
  hasCart: boolean = false;
  order!: OrderCalculated | null;
  totalTemporario: number = 0;
  quantity: number = 1;

// Produtos e filtros
  selectedProductId: number = 0;
  productfilter: any[] = [];
  searchTerm: string = '';
  sellerList: Seller[] = [];

// Mensagens e erros
  errorMessage: string = '';

// Paginação
  first: number = 0;
  rows: number = 10;


  pickupDate: Date | undefined;
  pickupDeadline: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;

  message:string = "A reserva será mantida por um dia. Após esse período, a reserva será cancelada e os produtos poderão ser reservados por outras pessoas.";
  
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private orderService: OrderService,
  ) {
  
  }


  ngOnInit(): void {
      
    this.dataPickerConfig();

    const listProducts:ListOrderItensRequest[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if(listProducts.length == 0){
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

  filterSeller(listProducts: ListOrderItensRequest[]): string[]{
    return [... new Set(listProducts.map(p=>p.sellerId).filter(id => !!id))]
  }

  showMessage() {
    this.enableMessage = !this.enableMessage;
    if(this.enableMessage == true){
      setTimeout(() => {
        this.enableMessage = false
      }, 9000);
    }
  }

  dataPickerConfig(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.minDate = today;

    const max = new Date(today);
    max.setMonth(max.getMonth() + 1);

    this.minDate = today;
    this.maxDate = max;
  }

  UpdatePickupDeadline(){
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


  openConfirmDialog(): void {
    this.showDialog = true;
  }

  closeConfirmDialog(): void {
    this.showDialog = false;
  }


  private createCalculateOrderFromItems(items: ListOrderItensRequest[]): CalculateOrder {
    return { listOrderItens: items };
  }


  calculateOrder(payload:CalculateOrder):void{
    this.loadingService.show();
    this.orderService.calculateOrder(payload).subscribe({
      next:(result)=> {
        this.order = result;
        this.totalTemporario = this.order.fee + this.order.total;
        this.loadingService.hide();
      },
      error:(error) =>{
        console.log(error)
        this.loadingService.hide();
      },
    })
  }


  navigate(){
    this.router.navigate(["login"]);
  }
  
  toggleSidebar():void{
    this.sidebarVisible = !this.sidebarVisible;
  }

  onClick():void{
    this.extendBar = !this.extendBar;
  }

  onPageChange(event: PaginatorState):void {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
  }

  navigateToDetail(id: number):void{
    this.router.navigate([`detalhe-compra/${id}`]);
  }

  navigateToProducts():void{
    this.router.navigate([`carrinho`]);
  }
}
