import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CalculateOrder, ListOrderItensRequest, OrderCalculated } from '../../models/order.model';
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
  resultOrder: any[] = [];
  order: OrderCalculated[] = [];
  totalTemporario!: number | null;
  today: Date = new Date();

  showDialogConfirm = true; 

  isEditing: boolean = false;


  constructor(
    private loadingService: LoadingService,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this.customerData = this.getUserData();
    let objTeste:ListOrderItensRequest[][] = [];
    let payload: any[] = [];
    
    this.customerData.forEach((element:any) => {
      objTeste.push(element.listOrderItens);
    });

    const listOrderItens: ListOrderItensRequest[][] = objTeste || [];

    
    if (listOrderItens.length == 0) {
      this.loadingService.hide();
      return;
    }

    listOrderItens.forEach(element => {
      payload.push(this.createCalculateOrderFromItems(element));
    });
    
    this.calculateOrder(payload)
    this.filterSecurityCode();
  }
  
  filterSecurityCode(){
    console.log(this.customerData)
    this.customerData.forEach((e:any) => {
      this.resultOrder.push({
        securityCode:e?.resultOrder?.[0]?.securityCode,
        sellerName: e?.resultOrder?.[0]?.sellerName
      })
    })
  }


  calculateOrder(payload: CalculateOrder[]): void {
    this.loadingService.show();
      const requests = payload.map(item => this.orderService.calculateOrder(item))

      forkJoin(requests).subscribe({
        next: (results) => {
          this.order.push(...results);
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('Erro em uma das requisições', error);
          this.loadingService.hide();
        }
      });
    
  }



  getUserData() {
    const customerData = localStorage.getItem('customerData');
    
    if (customerData) {
      return JSON.parse(customerData);
    }
    return null;
  }

  private createCalculateOrderFromItems(items: ListOrderItensRequest[]): CalculateOrder {
    return { listOrderItens: items };
  }





  editUser(): void {
    console.log('teste');
    this.isEditing = false;
  }

  enbleEditUser(): void {
    this.isEditing = true;
  }
}
