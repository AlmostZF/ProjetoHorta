import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,ButtonModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  navigateToCart(){
    this.router.navigate(['/cart'])
  }
  
  navigateToHome(){
    this.router.navigate(['/'])
  }

  navigateToUser(){
    this.router.navigate(['/user'])
  }

  openDetailMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }


}
