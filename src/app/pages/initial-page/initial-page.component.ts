import { Component, OnInit } from '@angular/core';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { CardsComponent } from '../../components/cards/cards.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [ BtnPrimaryComponent, CardsComponent, FooterComponent, CommonModule],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent implements OnInit{

  listProducts: any;

  constructor() { }

  ngOnInit() {
  }

}