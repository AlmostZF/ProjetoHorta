import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

//Prime NG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { StockService } from '../../service/stock.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../service/loading.service';
import { OrderService } from '../../service/order.service';
import { CalculateOrder, ListOrderItensRequest, OrderCalculated, OrderItemCalculated } from '../../models/order.model';
import { Dialog } from 'primeng/dialog';

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
    Dialog
],
  exportAs: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{

  signForm: any = FormGroup;
  loading:boolean = false;

  selectedProductId: number = 0;

  showDialog:boolean = false;

  hasCart:boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;

  errorMessage: string = '';
  searchTerm: string= '';

  quantity: number = 1;

  order!: OrderCalculated | null;
  
  totalTemporario: number = 0;

  productfilter: any[] = [];

  //pagination
  first: number = 0;
  rows: number = 10;

  
  constructor(
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private stockService: StockService,
    private orderService: OrderService
  ) {
  
  }

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;


  ngOnInit(): void {

    const listProducts:ListOrderItensRequest[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if(listProducts.length == 0){
      this.loadingService.hide();
      this.hasCart = false;
      return;
    } 
    
    this.hasCart = true;

    const payload = this.createCalculateOrderFromItems(listProducts);
    this.calculateOrder(payload)

  }

  
  addItem(index: number):void{
    if (!this.order?.listOrderItens) return;

    this.order.listOrderItens[index].quantity += 1;
    this.recalculateOrder();
  }
  
  removeItem(index: number): void {

    this.selectedProductId = index;
    
    if (!this.order?.listOrderItens) return;

    const item = this.order.listOrderItens[index];
    
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.openConfirmDialog();
    }
    
    this.recalculateOrder();
  }

  confirmRemoveItem(item: OrderItemCalculated[], index:number): void {
    item.splice(index, 1);
    if(item.length === 0){
      this.hasCart = false;
    }

    this.closeConfirmDialog();
    this.recalculateOrder();
    
  }

  openConfirmDialog(): void {
    this.showDialog = true;
  }
  closeConfirmDialog(): void {
    this.showDialog = false;
  }

  private recalculateOrder(): void {
    const payload = this.createCalculateOrderFromOrder(this.order!);
    this.calculateOrder(payload);
  }

  private updateStorage(items: ListOrderItensRequest[]){
    localStorage.setItem('cart',JSON.stringify(items))
  }


  private createCalculateOrderFromItems(items: ListOrderItensRequest[]): CalculateOrder {
    return { listOrderItens: items };
  }

  private createCalculateOrderFromOrder(order: OrderCalculated): CalculateOrder {
    const orderItens = {
      listOrderItens: order.listOrderItens.map(element => ({
        productId: element.productId,
        quantity: element.quantity,
        sellerId: element.sellerId
      }))
    };
    this.updateStorage(orderItens.listOrderItens);
    return orderItens
  }

  createOrder(){
    
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
    this.router.navigate([`compra`]);
  }
}
