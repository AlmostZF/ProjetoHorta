import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { environment } from "../../environment";
import { CalculateOrder, ListOrderItensRequest, OrderCalculated,ReservationRequest, ReservationResponse, ResultOrder} from "../models/order.model";
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
    return this.http.post<OrderCalculated>(`${this.baseUrl}/OrderReservation/pending`, payload).pipe(take(1),
    tap({
          error: (err) => console.error(`Erro ao buscar seller ${payload}:`, err)
        }))
  }

  createOrder(payload: ReservationRequest): Observable<ResultOrder[]>{
    return this.http.post<ResultOrder[]>(`${this.baseUrl}/OrderReservation`, payload).pipe(take(1))
  }

  getSellerAddress(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/Seller/${id}`).pipe(take(1),
      tap({
        error: (err) => console.error(`Erro ao buscar seller ${id}:`, err)
      }))
  }

  createCalculateOrderPayload(items: Record<string, ListOrderItensRequest[]>): CalculateOrder[] {

    return Object.keys(items).map((sellerId:any) => {

      return {listOrderItens: items[sellerId]};
      
    });
    
  }

  groupSeller(ListOrderItens: ListOrderItensRequest[]) {
    return ListOrderItens.reduce((accumulator:any, currentItem) => {
      const sellerId = currentItem.sellerId;

      if(!accumulator[sellerId]){
        accumulator[sellerId] = []
      }
      accumulator[sellerId].push(currentItem);
      
      return accumulator;
    },{})
  }

}
