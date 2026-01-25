import { Injectable } from '@angular/core';
import {  Datasets, MonthlyDetail, ChartConfig } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService{

    configMonthChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            return {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            usePointStyle: true,
                            font: { size: 14 }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                            font: { size: 10 },
                            callback: (value: any) => {
                                if (value >= 1000) return 'R$ ' + (value / 1000) + 'k';
                                return 'R$ ' + value;
                            }
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
    }

    configMonthBarChart(monthlyDetail: MonthlyDetail[] ){
        const documentStyle = getComputedStyle(document.documentElement);
        return this.createDataset(monthlyDetail, documentStyle)
    }

 configYearlyChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    font: { size: 14 }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary,
                    maxRotation: 45,
                    minRotation: 45,
                    font: { weight: 500, size: 10 }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary,
                    font: { size: 10 },
                    callback: (value: any) => {
                        if (value >= 1000) return 'R$ ' + (value / 1000) + 'k';
                        return 'R$ ' + value;
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

    configYearlyBarChart(monthlyDetail: MonthlyDetail[]){
        const documentStyle = getComputedStyle(document.documentElement);
        return this.createDataYearlyset(monthlyDetail, documentStyle)
    }


    private createDataYearlyset(monthlyDetail: MonthlyDetail[] | undefined , documentStyle: CSSStyleDeclaration): ChartConfig | null{

        const allMonths = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            
        const statuses = ['Confirmada', 'Pendente', 'Cancelada', 'Expirada'];
        const colorMap: { [key: string]: string } = {
            'Confirmada': '--p-blue-400',
            'Pendente': '--p-amber-400',
            'Cancelada': '--p-red-400',
            'Expirada': '--p-gray-400'
        };

        const datasets:Datasets[] = statuses.map(statusLabel => {
            const colorVar = colorMap[statusLabel]|| '--p-gray-500';

            const dataValues: number[] = [];
            const dataQuantities: number[] = [];

            allMonths.forEach(monthName => {
                const monthEntry = monthlyDetail?.find(m => m.month.toLowerCase() === monthName);
                const statusEntry = monthEntry?.statuses?.find(s => s.label === statusLabel);

                dataValues.push(statusEntry ? Number(statusEntry.value) : 0);
                dataQuantities.push(statusEntry ? statusEntry.quantity : 0);
            });


            return {
                type: 'bar',
                label: statusLabel,
                backgroundColor: documentStyle.getPropertyValue(colorVar),
                data: dataValues,
                quantities: dataQuantities
            }
        })

        return {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: datasets
    };
    }

    private createDataset(monthlyDetail: MonthlyDetail[] | undefined, documentStyle: CSSStyleDeclaration): ChartConfig | null{

        const todayMonthIndex = new Date().getMonth()+1; 
        const monthlyData = monthlyDetail?.find(e => e.monthNumber === todayMonthIndex);

        if (!monthlyData) return null;

        return {

            labels: monthlyData.statuses.map(s => s.label), 
            datasets: [
                {
                    type: 'bar',
                    label: `Valor das Venda - ${monthlyData.month}`,
                    backgroundColor: monthlyData.statuses.map(s => this.getStatusColor(s.label, documentStyle)),
                    borderColor: documentStyle.getPropertyValue('--p-gray-200'),
                    borderWidth: 1,
                    data: monthlyData.statuses.map(s => s.value)
                }
            ]
        };

    }

    private getStatusColor(label: string, documentStyle: CSSStyleDeclaration): string {
        const colorMap: { [key: string]: string } = {
            'Confirmada': '--p-blue-400',
            'Pendente': '--p-amber-400',
            'Cancelada': '--p-red-400',
            'Expirada': '--p-gray-400'
        };
    return documentStyle.getPropertyValue(colorMap[label] || '--p-gray-500');
}

}
