import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { environment } from "../../environment";
import { Product} from "../models/product.model";
import { CalculateOrder, OrderCalculated, OrderItem, OrderItemCalculated} from "../models/order.model";
import { Seller } from "../models/seller.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getOrder(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseUrl}/Product`).pipe(take(1))
  }

  calculateOrder(payload: CalculateOrder): Observable<OrderCalculated>{
    return this.http.post<OrderCalculated>(`${this.baseUrl}/OrderReservation/pending`, payload).pipe(take(1))
  }

  createOrder(payload: OrderItem): Observable<OrderItemCalculated>{
    return this.http.post<OrderItemCalculated>(`${this.baseUrl}/OrderReservation`, payload).pipe(take(1))
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