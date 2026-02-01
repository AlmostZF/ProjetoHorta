import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CalculateOrder, ListOrderItensRequest, OrderCalculated, OrderFront } from '../../models/order.model';
import { OrderService } from '../../service/order.service';
import { LoadingService } from '../../service/loading.service';
import { forkJoin } from 'rxjs';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    PaginatorModule,
    CommonModule,
    Dialog
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  customerData: any = null;
  order: OrderFront[] = [];
  totalTemporario!: number | null;
  today: Date = new Date();
  selectedReservation: any = null;


  showDialogConfirm = true; 

  isEditing: boolean = false;
  showDialog: boolean = false;


  constructor(
    private loadingService: LoadingService,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this.customerData = this.getUserData();
    this.calculateOrder(this.customerData);
  }

  calculateOrder(ListOrderItensGrouped:any): void {
    if(!ListOrderItensGrouped){
      return;
    }
    this.loadingService.show();
    const payload = this.createCalculateOrderPayload(ListOrderItensGrouped);

    const requests = payload.map((item: CalculateOrder) => this.orderService.calculateOrder(item))

    forkJoin(requests).subscribe({
      next: (results) => {
        this.order = results.map((o, i) => ({ ...o,
        selectedPickupLocation: ListOrderItensGrouped[i].pickupLocation,
        pickupDate: ListOrderItensGrouped[i].pickupDate,
        pickupDeadline: ListOrderItensGrouped[i].pickupDeadline,
        securityCode: ListOrderItensGrouped[i].securityCode[0].securityCode,
        disableDays: []}));;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Erro em uma das requisições', error);
        this.loadingService.hide();
      }
    });
  
  }

  
  closeConfirmDialog(){
    this.showDialog = false;
  }

  openConfirmDialog(item: any){
    this.selectedReservation = item;
    console.log(item)
    this.showDialog = true;
  }

  CancelOrder(){
      this.orderService.CancelOrder(this.selectedReservation?.securityCode ?? '', this.selectedReservation?.seller.id).subscribe({
          next: (value) => {
              this.loadingService.hide();
          },
          error: (error) => {
              this.loadingService.hide();
              console.log(error)

          },
      })
  }

  createCalculateOrderPayload(items:any): CalculateOrder[] {
    return items.map((itens:any) => {
        return {listOrderItens: itens.listOrderItens}
      });
  };
  
  

  getUserData() {
    const customerData = localStorage.getItem('customerData');
    
    if (customerData) {
      return JSON.parse(customerData);
    }
    return null;
  }

}
