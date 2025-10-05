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

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  sidebarVisible: boolean = false;
  extendBar: boolean = false;

  errorMessage: string = '';
  searchTerm: string= '';

  quantity: number = 1;

    produtos = [
    {
      name: 'Tomate Orgânico',
      description: 'Tomates frescos, direto da horta',
      image: 'https://via.placeholder.com/300x200?text=Tomate',
      unitValue: 7.99,
    },
    {
      name: 'Cenoura',
      description: 'Cenouras doces e crocantes',
      image: 'https://via.placeholder.com/300x200?text=Cenoura',
      unitValue: 5.49,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
        {
      name: 'Tomate Orgânico',
      description: 'Tomates frescos, direto da horta',
      image: 'https://via.placeholder.com/300x200?text=Tomate',
      unitValue: 7.99,
    },
    {
      name: 'Cenoura',
      description: 'Cenouras doces e crocantes',
      image: 'https://via.placeholder.com/300x200?text=Cenoura',
      unitValue: 5.49,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
        {
      name: 'Tomate Orgânico',
      description: 'Tomates frescos, direto da horta',
      image: 'https://via.placeholder.com/300x200?text=Tomate',
      unitValue: 7.99,
    },
    {
      name: 'Cenoura',
      description: 'Cenouras doces e crocantes',
      image: 'https://via.placeholder.com/300x200?text=Cenoura',
      unitValue: 5.49,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
    {
      name: 'Alface',
      description: 'Alface americana orgânica',
      image: 'https://via.placeholder.com/300x200?text=Alface',
      unitValue: 3.99,
    },
  ];

  productfilter: any[] = [];

  //pagination
  first: number = 0;
  rows: number = 10;

  
  constructor(
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;


  navigate(){
    this.router.navigate(["login"]);
  }
  
  ngOnInit(): void {
    this.productfilter = this.produtos
  }
  
  addItem(){
    this.quantity += 1;
  }

  searchProduct(){
    this.produtos = this.productfilter
    this.produtos = this.produtos.filter(p=> p.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
  }


  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onClick(){
    this.extendBar = !this.extendBar;
  }

  removeItem(){
    if(this.quantity > 1){
      this.quantity -= 1;
    }
  }

  onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
  }


  navigateToDetail(id: number){
    console.log(id)
    this.router.navigate([`shop-detail/${id}`]);
  }
}
