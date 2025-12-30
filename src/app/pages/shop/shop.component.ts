// Angular Core
import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// RxJS
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  switchMap
} from 'rxjs';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

// Componentes
import { CardsComponent } from '../../components/cards/cards.component';

// Serviços
import { SessionService } from '../../service/session.service';
import { ProductService } from '../../service/product.service';
import { LoadingService } from '../../service/loading.service';

// Modelos
import {
  Filter,
  Pagination,
  Product,
  productType,
  productTypesList
} from '../../models/product.model';
import { CapitalizeFirstPipe } from "../../pipe/capitalize-first.pipe";


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
    CommonModule,
    CapitalizeFirstPipe
],
  exportAs: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{

  // Formulário
  signForm!: FormGroup;

  // Produtos
  products: Product[] = [];
  productfilter: Product[] = [];
  productType: productType[] = productTypesList;
  productTypeParam: string | productType = '';
  productTypeSelected!: productType | null;
  quantity: number = 1;

  // Paginação
  pagination: Pagination = {
    pageNumber: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };

  // Busca
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;
  filter: Filter = {};

  // Interface controle
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;

  // Mensagens e erros
  errorMessage: string = '';

  
  constructor(
    private router: Router,
    private productService: ProductService,
    private loadingService: LoadingService,
    private activeRoute: ActivatedRoute,
  ) {
    this.getParams();
  }
  
  ngOnInit(): void {
    this.getProducts();
    this.subscription = this.searchSubject.pipe(
      debounceTime(300),          
      distinctUntilChanged(), 
      switchMap((term) => {
        this.loadingService.show();
        this.filter.name = term

        if(this.productTypeSelected){
          this.filter.productType = this.productTypeSelected.value;
        }

        return this.productService.getProductFilter(this.filter);
      })
    ).subscribe({
      next: (products) => {
        this.products = products.products;
        this.pagination = products.pagination;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error(err);
        this.loadingService.hide();
      }
    });
  }

  getParams():void {
      this.activeRoute.paramMap.subscribe(params =>{
      const param = params.get('productType');
      if (param) {
        this.productTypeParam = param;

        this.productTypeSelected = Object.values(this.productType)
        .find((t: any) => t.name === param)!;

        if(this.productTypeSelected?.value == undefined){
          this.filter = {};
          this.filterProducts(this.filter);
          return;
        }
        
        this.filter = {productType: this.productTypeSelected?.value};
        this.filterProducts(this.filter);

      }
    })
  }


  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProducts():void{
    this.filter.PageNumber = this.pagination.pageNumber;
    this.filter.MaxItensPerPage = this.pagination.itemsPerPage;

    this.loadingService.show();
    this.loading = true;
    this.productService.getProductFilter(this.filter).subscribe({
      next:(result) =>{
        this.products = result.products;
        this.pagination = result.pagination;
        this.loading = false;
      },
      error:(error) =>{
        console.log(error);
        this.loading = false;
        this.loadingService.hide();
      },
      complete:() => {
        this.loadingService.hide();
        this.productfilter = this.products;
      },
    })
  }

  filterProducts(filter:Filter):void{
    this.loadingService.show();
    this.productService.getProductFilter(filter).subscribe({
      next: (products) => {
        this.products = products.products;
        this.pagination = products.pagination;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        console.log(err);
      }
    })
  }
  
  addItem():void{
    this.quantity += 1;
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

  onPageChange(event: PaginatorState): void {
    this.pagination.pageNumber = (event.first! / event.rows!) + 1;
    this.pagination.itemsPerPage = event.rows!;
    this.getProducts();
  }


  navigateToDetail(id: string):void{
    window.scrollTo(0, 0);
    this.router.navigate([`detalhe-compra/${id}`]);
  }

  navigateToCategory(category: string):void{
    this.resetFilters();
    this.router.navigate([`compra/${category}`]);
  }

  resetFilters():void{
    this.searchTerm = '';
    this.filter.PageNumber = 1;
    this.filter.MaxItensPerPage = 10;
  }

  navigate():void {
    this.router.navigate(["login"]);
  }

}
