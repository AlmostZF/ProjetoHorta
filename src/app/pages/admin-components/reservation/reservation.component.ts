import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// primeNG
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputOtpModule } from 'primeng/inputotp';
import { OrderService } from '../../../service/order.service';
import { ReservationResponse } from '../../../models/order.model';
import { LoadingService } from '../../../service/loading.service';


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
        InputOtpModule,
    ],
    templateUrl: './reservation.component.html',
    styleUrl: './reservation.component.scss'
})

export class ReservationComponent implements OnInit {

    securityCode: string = '5RT7';
    selectedReservation!: ReservationResponse[] | null

    constructor(
        private orderService: OrderService,
        private loadingService: LoadingService,
        private activeRoute: ActivatedRoute,
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
                this.selectedReservation = value
                this.loadingService.hide()
            },
            error: (error) => {
                this.loadingService.hide()
                console.log(error)

            },
        })
    }
}