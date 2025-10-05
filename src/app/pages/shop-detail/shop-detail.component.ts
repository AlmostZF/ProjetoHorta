import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//Prime NG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardsComponent } from '../../components/cards/cards.component';

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
  ],
  exportAs: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit{

  signForm: any = FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage = '';
  quantity:number = 1;

  
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
  }
  addItem(){
    this.quantity += 1;
  }

  removeItem(){
    if(this.quantity > 1){
      this.quantity -= 1;
    }
  }

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
    // adicione quantos quiser
  ];

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
