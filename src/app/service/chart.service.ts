import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { YearlyReport, Datasets, StatusComparison } from '../models/dashboard.model';

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
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
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
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
    }

    configMonthBarChart(month:string,statusComparison: StatusComparison[] ){
         const documentStyle = getComputedStyle(document.documentElement);
        return {
            labels: [month],
            datasets: this.createDataset(statusComparison, documentStyle)
        };
    }

    configYearlyChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        return {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
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
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    configYearlyBarChart(){
        const documentStyle = getComputedStyle(document.documentElement);
        return {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'agost', 'september', 'obctuber', 'december'],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        data: [65, 59, 80, 81, 56, 55, 65, 59, 80, 81, 56, 55,]
                    },
                    {
                        label: 'My Second dataset',
                        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                        data: [28, 48, 40, 19, 86, 27, 28, 48, 40, 19, 86, 27]
                    }
                ]
            };
    }

    private createDataset(statusComparison: StatusComparison[],documentStyle: CSSStyleDeclaration): Datasets[] | null{

        const colorMap: { [key: string]: string } = {
            'Confirmada': '--p-blue-200',
            'Pendente': '--p-amber-200',
            'Expirada': '--p-grey-200',
            'Cancelada': '--p-red-200'
        };

        return statusComparison.map((element) => {
            const colorVar = colorMap[element.label] || '--p-gray-500';
            return {
                type: 'bar',
                label: element.label,
                backgroundColor: documentStyle.getPropertyValue(colorVar),
                data: [element.quantity]
            }
        });
    }



}
