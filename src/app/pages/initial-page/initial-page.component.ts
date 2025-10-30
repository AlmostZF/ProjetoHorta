// Angular Core
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Componentes
import { CardsComponent } from '../../components/cards/cards.component';

// PrimeNG
import { ButtonModule } from 'primeng/button';

// Serviços
import { ProductService } from '../../service/product.service';
import { LoadingService } from '../../service/loading.service';

// Modelos
import { ProductFitered } from '../../models/product.model';




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

  listProducts!: ProductFitered;

  constructor(private router: Router, private productService: ProductService, private loadingService: LoadingService) { }

  ngOnInit():void {
    this.getProducts();
  }

  getProducts():void{
    const filter = {MaxItensPerPage: 4};
    this.loadingService.show();
    this.productService.getProductFilter(filter).subscribe({
      next: (products) => {
        this.listProducts = products;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        console.log(err);
      }
    })
  }

  navigateToProducts():void{
    this.router.navigate(["/product"])
  }

  navigateToDetail(id: string):void{
    window.scrollTo(0, 0);
    this.router.navigate([`detalhe-compra/${id}`]);
  }

}