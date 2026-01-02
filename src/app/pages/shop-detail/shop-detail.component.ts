// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Componentes
import { CardsComponent } from '../../components/cards/cards.component';

// Pipes
import { ProductType } from '../../pipe/product-type.pipe';

// Serviços
import { SessionService } from '../../service/session.service';
import { ProductService } from '../../service/product.service';
import { LoadingService } from '../../service/loading.service';

// Modelos
import { Filter, Product } from '../../models/product.model';
import { ListOrderItensRequest } from '../../models/order.model';


@Component({
  selector: 'app-shop-detail',
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
    CardsComponent,
    CommonModule,
    ProductType,
    Dialog,
    Toast
    
],
  exportAs: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit{
  
  // Estado e controle de interface
  loading: boolean = false;
  showDialog: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Formulário
  signForm!: FormGroup;

  // Mensagens e erros
  errorMessage: string = '';

  // Produto e carrinho
  productId: string = '';
  productSelected!: Product | null;
  productsSugestion: Product[] = [];
  quantity: number = 1;
  hasCartItens: boolean = false;


  
  constructor(
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private messageService: MessageService,
  ) {
  }


  ngOnInit(): void {
    this.loadingService.show();
    this.getParams();
    this.verifyCartItem();
    this.getProductById(this.productId);
  }

  getParams():void {
    this.activeRoute.paramMap.subscribe(params =>{
      this.productId = params.get('id') || ''
    })
  }

  verifyCartItem():void{
    let cart: ListOrderItensRequest[] = JSON.parse(localStorage.getItem('cart') || '[]'); 
  
    const productIndex = cart.findIndex(item => item.productId === this.productId);
    if (productIndex !== -1){
      this.hasCartItens = true;
      return;
    }

    this.hasCartItens = false;
  }

  getProducts():void {
    console.log(this.productSelected)
    const filter:Filter = {MaxItensPerPage: 5, productType: this.productSelected?.productType};
    this.loading = true;
    this.productService.getProductFilter(filter).subscribe({
      next:(result)=> {
        this.productsSugestion = result.products;
        this.loading = false;
      },
      error:(error)=> {
        console.log(error)
        this.loading = false;
        this.loadingService.hide();
      },
      complete:() =>{
        this.loadingService.hide()
      },
    })
  }

  getProductById(id:string):void{
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next:(result)=> {
        this.productSelected = result;
        this.loading = false;
      },
      error:(error)=> {
        console.log(error)
        this.loading = false;
      },
      complete:() =>{
        this.getProducts();
      }
    })
  }

  navigate():void{
    this.router.navigate(["login"]);
  }

  navigateToCart():void{
    if(!this.hasCartItens){
      this.addToCart();
    }
    this.router.navigate(["carrinho"]);
  }

  navigateToDetail(id: string):void {
    this.router.navigate([`detalhe-compra/${id}`]).then(() => {
      window.location.reload();
      window.scrollTo(0, 0);
    });
  }

  openAndCloseDialog():void{
    this.showDialog = !this.showDialog;
  }



  private createExpireTime(): void {
      const now = new Date().getTime();
      const expireDate = now + (24 * 60 * 60 * 1000);
      localStorage.setItem('expireDate', expireDate.toString());
  }

  private getCartStorage(): ListOrderItensRequest[] {
      return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  private saveCartStorage(cart: ListOrderItensRequest[]): void {
      if (cart.length > 0) {
        
          localStorage.setItem('cart', JSON.stringify(cart));
      } else {
          localStorage.removeItem('cart');
          localStorage.removeItem('expireDate');
      }
  }

  private createCartItem(): ListOrderItensRequest | null {
    if (!this.productSelected) return null;

    return {
        productId: this.productSelected.id,
        sellerId: this.productSelected.seller.id,
        quantity: 1
    };
  }


  addToCart(): void {
    this.hasCartItens = !this.hasCartItens

    const newItem = this.createCartItem();
    if (!newItem) return;

    const cart = this.getCartStorage();
    this.createExpireTime();

    const productIndex = cart.findIndex(item => 
        item.productId === newItem.productId
    );

    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
    } else {
        cart.push(newItem);
        this.showConfirm();
    }
    this.saveCartStorage(cart);
  } 


  showConfirm():void {
    this.messageService.add({
        key: 'confirm',
        severity: 'custom',
        summary: 'Produto adicionado ao carrinho',
        styleClass: 'bg-white rounded-2xl',
        life: 2000
    });
  }

}
