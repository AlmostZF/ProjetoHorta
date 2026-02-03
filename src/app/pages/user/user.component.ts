import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastService } from '../../service/toast.service';

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
    private messageService: MessageService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
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

    const requests = payload.map((item: CalculateOrder) => this.orderService.calculateViewOrder(item))

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
    this.showDialog = true;
  }

  CancelOrder(){
      const customerFiltered = this.customerData.filter((e:any) => e.securityCode[0].securityCode != this.selectedReservation?.securityCode);
      console.log(customerFiltered)
      console.log(this.selectedReservation)
      this.orderService.CancelOrder(this.selectedReservation?.securityCode ?? '', this.selectedReservation?.seller.id).subscribe({
          next: (value) => {
              this.loadingService.hide();
              this.showConfirm('Peido cancelado com sucesso!', "#93c732");
              this.removeOrderFromStorage(this.selectedReservation?.securityCode);
              this.calculateOrder(this.customerData);
              this.showDialog = false;
              console.log('Pedido cancelado e removido do storage');
            }, 
            error:(error) => {
              console.log(error);
              this.showDialog = false;
              this.showConfirm("Erro ao cancelar o pedido. Tente novamente mais tarde.", "#d32f2f");
              this.loadingService.hide();
          }
      })
  }

  removeOrderFromStorage(securityCode: string): void {
    const customerData = this.getUserData();

    if (customerData) {
      const updatedData = customerData.filter((item: any) => item.securityCode[0].securityCode !== securityCode);

      localStorage.setItem('customerData', JSON.stringify(updatedData));
      
      this.customerData = updatedData;
    }
  }

  createCalculateOrderPayload(items:any): CalculateOrder[] {
    return items.map((itens:any) => {
        return {listOrderItens: itens.listOrderItens}
      });
  };
    
  showConfirm(message: string, severity?: string): void {
    this.toastService.show(
        {
            message: message,
            icon: 'pi pi-shopping-bag',
            color: severity
        }
    )

    this.messageService.add({
        key: 'confirm',
        severity: 'custom',
        summary: message,
        styleClass: 'bg-white rounded-2xl',
        life: 2000
    });
    this.cdr.detectChanges();
  }

  getUserData() {
    const customerData = localStorage.getItem('customerData');
    
    if (customerData) {
      return JSON.parse(customerData);
    }
    return null;
  }

}
