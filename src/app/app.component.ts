
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './service/loading.service';
import { Console } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, CommonModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projectStore';
  showLayout: boolean = true;
  loading: boolean = false;

  hiddenRoutes = ['/login', '/signup', '/admin'];

  constructor(private router: Router, private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe((status) => {
      this.loading = status;
    });

    this.clearCart();
    this.clearOrder();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        const isHidden = this.hiddenRoutes.some(route => url.startsWith(route));

        const isReservationWithParam = url.includes('admin/reservas');

        this.showLayout = !(isHidden || isReservationWithParam);
      });
  }

  clearCart(): void {
    const now = new Date().getTime();
    const expireDate = Number(localStorage.getItem('expireDate'));
    if (expireDate && now > expireDate) {
      localStorage.removeItem('expireDate');
      localStorage.removeItem('cart');
      console.log('Carrinho expirado e limpo');
    }
  }

  clearOrder(): void {
    const now = Date.now();

    const customerData = JSON.parse(
      localStorage.getItem('customerData') || '[]'
    );
    if (customerData.length == 0) {
      return;
    }
    const validOrders = customerData.filter((order: any) => {
      if (!order.pickupDeadline) return true;

      const deadline = new Date(order.pickupDeadline).getTime();

      return now <= deadline;
    });

    if (validOrders.length !== customerData.length) {
      localStorage.setItem('customerData', JSON.stringify(validOrders));
      console.log('Pedidos expirados removidos');
    }
  }

}
