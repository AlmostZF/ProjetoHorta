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
import { CardsComponent } from '../../components/cards/cards.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product.model';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'app-shop',
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
    PaginatorModule,
    CommonModule
],
  exportAs: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{

  signForm: any = FormGroup;

  loading: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;

  errorMessage: string = '';
  searchTerm: string= '';

  quantity: number = 1;

  products: Product[] = [];

  productfilter: Product[] = [];

  //pagination
  first: number = 0;
  rows: number = 10;

  
  constructor(
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private loaderService: LoadingService
  ) {
  }


  navigate():void {
    this.router.navigate(["login"]);
  }
  
  ngOnInit(): void {
    this.getProducts();
    
  }

  getProducts():void{
    this.loaderService.show();
    this.loading = true;
    this.productService.getProduct().subscribe({
      next:(result) =>{
        this.products = result
        this.loading = false;
      },
      error:(error) =>{
        console.log(error);
        this.loading = false;
      },
      complete:() => {
        this.loaderService.hide();
        this.productfilter = this.products;
      },
    })
  }
  
  addItem():void{
    this.quantity += 1;
  }

  searchProduct():void{
    this.products = this.productfilter
    this.products = this.products.filter(p=> p.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }

  toggleSidebar():void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onClick():void{
    this.extendBar = !this.extendBar;
  }

  removeItem():void{
    if(this.quantity > 1){
      this.quantity -= 1;
    }
  }

  onPageChange(event: PaginatorState):void {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
  }


  navigateToDetail(id: string):void{
    this.router.navigate([`detalhe-compra/${id}`]);
  }
}
