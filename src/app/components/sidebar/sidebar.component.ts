import { Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  
  isSidebarVisible: boolean = false;

  
  isMenuOpen: boolean = false;
  
  constructor(private router: Router,private authService: AuthService) {
    this.router.events.subscribe(() => {
      this.isSidebarVisible = false;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout() {
    this.authService.logout(this.authService.bearerToken ?? '').subscribe({
      complete:()=> {
        this.router.navigate(['/login'])
      },
    })
   }

  navigateToHome() {
    this.isMenuOpen = false;
    this.router.navigate(['/admin'])
  }

  


}
