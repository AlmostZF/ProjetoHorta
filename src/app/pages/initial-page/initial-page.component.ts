import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../../components/cards/cards.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [
    CardsComponent,
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