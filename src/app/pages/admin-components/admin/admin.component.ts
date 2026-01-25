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
import { DashboardService } from '../../../service/product.service copy';
import { Reservation, Summary, TopProduct, YearlyReport } from '../../../models/dashboard.model';
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
    securityCode: string = '5RT7';
    summary: Summary | null = null;
    yearlyReport: YearlyReport | null = null;
    recentReservations: Reservation[] | null = null;
    topProducts: TopProduct[] | null = null;
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
        private router: Router) {
    }

    toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
    }

    logout() { }

    ngOnInit(): void {
        this.getDashboard();
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
        this.router.navigate(['/admin'])
    }

    navigateToOrderReservation() {
        this.router.navigate([`admin/reservas/${this.securityCode}`])
    }


}