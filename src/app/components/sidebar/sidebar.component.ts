import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  
  @Input() isSidebarVisible: boolean = false;
  
  @Output() cardClick = new EventEmitter<void>();
  
  isMenuOpen: boolean = false;
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isSidebarVisible = false;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout() { }

  navigateToHome() {
    this.isMenuOpen = false;
    this.router.navigate(['/admin'])
  }


}
