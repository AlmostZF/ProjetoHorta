import { Component, OnInit } from '@angular/core';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { CardsComponent } from '../../components/cards/cards.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [
    CardsComponent,
    FooterComponent,
    CommonModule,
    ButtonModule,],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent implements OnInit{

  listProducts: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToProducts(){
    this.router.navigate(["/product"])
  }

}