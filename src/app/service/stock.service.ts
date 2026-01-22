import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { environment } from "../../environment";
import { CreateStock, InventoryMovement, UpdateStock, StockAvailable } from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class StockService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getStock(): Observable<InventoryMovement[]>{
    return this.http.get<InventoryMovement[]>(`${this.baseUrl}/Stock/all`).pipe(take(1))
  }

  getStockById(id:string): Observable<InventoryMovement>{
    return this.http.get<InventoryMovement>(`${this.baseUrl}/Stock/${id}`).pipe(take(1))
  }

  getStockByProductId(id:string): Observable<StockAvailable>{
    return this.http.get<StockAvailable>(`${this.baseUrl}/Stock/product/${id}`).pipe(take(1))
  }

  updateStock(updateStock: UpdateStock): Observable<InventoryMovement>{
    return this.http.put<InventoryMovement>(`${this.baseUrl}/Stock`, updateStock).pipe(take(1))
  }

  createStock(createStock: CreateStock): Observable<InventoryMovement>{
    return this.http.post<InventoryMovement>(`${this.baseUrl}/Stock`, createStock).pipe(take(1))
  }

  


}