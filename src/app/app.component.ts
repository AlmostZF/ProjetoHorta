
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './service/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FooterComponent, HeaderComponent, CommonModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projectStore';
  showLayout:boolean = true;
  loading:boolean = false;
  
  constructor(private router: Router, private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe((status) => {
      this.loading = status;
    });

    this.clearCart();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hiddenRoutes = ['/login', '/signup', '/admin', '/admin/list'];
        this.showLayout = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }

    clearCart():void{
      const now = new Date().getTime();
      const expireDate = Number(localStorage.getItem('expireDate'));
        if (expireDate && now > expireDate) {
          localStorage.removeItem('expireDate');
          localStorage.removeItem('cart');
          console.log('Carrinho expirado e limpo');
      }
    }
}
