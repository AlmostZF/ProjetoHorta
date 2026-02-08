import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, inject, effect } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// primeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../../service/dashBoard.service';
import { Reservation, Summary, TopProduct, YearlyReport } from '../../../models/dashboard.model';
import { Seller} from '../../../models/seller.model';
import { SellerService } from '../../../service/seller.service';
import { ChartService } from '../../../service/chart.service';
import { LoadingService } from '../../../service/loading.service';


@Component({
    selector: 'app-admin',
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
        InputOtpModule,
        ChartModule,
        RouterModule
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
    securityCode: string = '';
    summary: Summary | null = null;
    yearlyReport: YearlyReport | null = null;
    recentReservations: Reservation[] | null = [];
    topProducts: TopProduct[] | null = [];
    seller: Seller | null = null;
    enableStep: boolean = false;
    enableMessage: boolean = false;

    data: any;
    dataSeller: any;

    options: any;
    optionsSeller: any;

    platformId = inject(PLATFORM_ID);
    
    isSidebarVisible = false;

    constructor(
        private cd: ChangeDetectorRef,
        private dashboardService: DashboardService,
        private chartService: ChartService,
        private loadingService: LoadingService,
        private sellerService: SellerService,
        private router: Router) {
    }

    toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
    }

    ngOnInit(): void {
        this.getDashboard();
        this.getSeller();
        const session = sessionStorage.getItem('Product') ?? ''
        this.enableMessage = session == '' ? false : JSON.parse(session);
    }

    getSeller(){
        this.loadingService.show();
        this.sellerService.getSeller().subscribe({
            next:(result)=>{
                this.seller = result;
                if((result.listPickupLocations?.length ?? 0) > 0 && result.phoneNumber !== ''){
                    this.enableStep = true;
                }
                this.loadingService.hide();
            },
            error:(result)=>{
                this.loadingService.hide();
            }
        })
    }
    
    getDashboard(){
        this.loadingService.show();
        this.dashboardService.getDashboard().subscribe({
            next:(result)=>{
                
                this.summary = result.summary;
                this.yearlyReport = result.yearlyReport;
                this.recentReservations = result.recentReservations;
                this.topProducts = result.topProducts;
                this.initMonthChart();
                this.initYeartlyChart();
                this.loadingService.hide();
            },
            error:(error)=>{
                console.log(error)
                this.loadingService.hide();
            }
        })
    }

    initYeartlyChart() {
        if (isPlatformBrowser(this.platformId)) {
            this.data = this.chartService.configYearlyBarChart(this.yearlyReport!.monthlyData);
            this.options = this.chartService.configYearlyChart();
            this.cd.markForCheck()
        }
    }

    initMonthChart() {
        if (isPlatformBrowser(this.platformId)) {
            this.dataSeller = this.chartService.configMonthBarChart(this.yearlyReport!.monthlyData);
            this.optionsSeller = this.chartService.configMonthChart();
            this.cd.markForCheck()
        }
    }

    navigateToHome() {
        this.router.navigate(['/admin']);
    }

    navigate(route:string){
        this.router.navigate([route]);
    }
    
    navigateToOrderReservation() {
        this.router.navigate([`admin/reservas/${this.securityCode}`])
    }


}