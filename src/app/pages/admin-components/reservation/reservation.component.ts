import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// primeNG
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputOtpModule } from 'primeng/inputotp';
import { OrderService } from '../../../service/order.service';
import { ReservationResponse } from '../../../models/order.model';
import { LoadingService } from '../../../service/loading.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';


@Component({
    selector: 'app-reservation',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    CommonModule,
    InputOtpModule,
    RouterModule,
    Toast,
],
    templateUrl: './reservation.component.html',
    styleUrl: './reservation.component.scss'
})

export class ReservationComponent implements OnInit {

    securityCode: string = '5RT7';
    selectedReservation!: ReservationResponse[] | null;
    isSidebarVisible:boolean = false;

    colorMessage: string | undefined = undefined;
    showDialog:boolean = false;

    message: string = "Nenhuma reserva encontrada";

    constructor(
        private orderService: OrderService,
        private loadingService: LoadingService,
        private activeRoute: ActivatedRoute,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private router: Router) {
    }

    ngOnInit(): void {
        this.getParams();
    }

    getParams(): void {
        this.activeRoute.paramMap.subscribe(params => {
            this.securityCode = params.get('securityCode') || ''
        })
        if(this.securityCode){
            this.buscarReserva();
        }
    }

    navigateToHome() {
        this.router.navigate(['/admin'])
    }

    buscarReserva() {
        this.loadingService.show()
        this.orderService.getOrderBySecurityCode(this.securityCode).subscribe({
            next: (value) => {
                this.selectedReservation = value;
                this.loadingService.hide();
                
            },
            error: (error) => {
                this.showConfirm("Nenhuma reserva encontrada","#d32f2f");
                this.loadingService.hide();
                console.log(error)

            },
        })
    }

    toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
    }

    openConfirmDialog(): void {
        this.showDialog = true;
    }

    showConfirm(message: string, severity?: string): void {

        this.colorMessage = severity ?? undefined;

        this.messageService.add({
        key: 'confirm',
        severity: 'custom',
        summary: message,
        styleClass: 'bg-white rounded-2xl',
        life: 2000
        });
        this.cdr.detectChanges();
    }

}