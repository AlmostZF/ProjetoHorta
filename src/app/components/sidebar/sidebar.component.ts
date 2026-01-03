import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  navigateToHome(){
    this.isMenuOpen = false;
    this.router.navigate(['/'])
  }


}
