import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { environment } from "../../environment";
import { CalculateOrder, OrderCalculated,ReservationRequest, ReservationResponse} from "../models/order.model";
import { Seller } from "../models/seller.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getOrder(): Observable<ReservationResponse[]>{
    return this.http.get<ReservationResponse[]>(`${this.baseUrl}/OrderReservation`).pipe(take(1))
  }

  getOrderBySecurityCode(securityCode:string):Observable<ReservationResponse[]>{
    const httpHeader = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return this.http.get<ReservationResponse[]>(`${this.baseUrl}/OrderReservation/securitycode/${securityCode}`, httpHeader).pipe(take(1))
  }

  calculateOrder(payload: CalculateOrder): Observable<OrderCalculated>{
    return this.http.post<OrderCalculated>(`${this.baseUrl}/OrderReservation/pending`, payload).pipe(take(1))
  }

  createOrder(payload: ReservationRequest): Observable<string>{
    return this.http.post<string>(`${this.baseUrl}/OrderReservation`, payload).pipe(take(1))
  }

  getSellerAddress(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/Seller/${id}`).pipe(take(1),
      tap({
        error: (err) => console.error(`Erro ao buscar seller ${id}:`, err)
      }))
  }
  
  // createOrder():Observable<any>{
  //   return this.http.post<any>(`${this.baseUrl}/Product`).pipe(take(1))
  // }

}
