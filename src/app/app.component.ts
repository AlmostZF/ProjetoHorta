
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './service/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Horta comunitaria';
  loading: boolean = false;

  constructor( private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe((status) => {
      this.loading = status;
    });

    this.clearCart();
    this.clearOrder();
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
