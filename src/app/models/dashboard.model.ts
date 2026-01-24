export interface DashboardData {
  summary: Summary;
  yearlyReport: YearlyReport;
  recentReservations: Reservation[];
  topProducts: TopProduct[];
}

export interface Summary {
  totalProfit: number;
  totalReservations: number;
  finishedReservations: number;
  pendingReservations: number;
  canceledReservations: number;
  expiredReservations: number;
}

export interface StatusComparison {
  label: string;
  value: number;
  quantity: number;
}

export interface YearlyReport {
  salesEvolution: any[];
  statusComparison: StatusComparison[];
}

export interface Reservation {
  reservationId: string;
  customerName: string;
  orderStatus: "Pendente" | "Confirmada" | "Cancelado" | "Expirado"; 
  totalValue: number;
  itemsCount: number;
  reservationDate: string;
  pickUpDate: string;  
  pickupDeadline: string;
}

export interface TopProduct {
categoryName: string ;
imageUrl: string;
productId: string;
productName: string;
profit: number;
quantity: number;
totalSold: number;
}

export interface Datasets {
    type: string,
    label: string,
    backgroundColor: any
    data: number[]
}