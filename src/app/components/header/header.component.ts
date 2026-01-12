import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from "../footer/footer.component";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule, FooterComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  navigateToCart(){
    this.isMenuOpen = false;
    this.router.navigate(['/carrinho']);
  }
  
  navigateToHome(){
    this.isMenuOpen = false;
    this.router.navigate(['/'])
  }

  navigateToUser(){
    this.isMenuOpen = false;
    this.router.navigate(['/user'])
  }

  openDetailMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }


}
