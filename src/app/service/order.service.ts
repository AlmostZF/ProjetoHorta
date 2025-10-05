import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { environment } from "../../environment";
import { Product, CreateProduct, UpdateProduct } from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getOrder(): Observable<any[]>{
    return this.http.get<Product[]>(`${this.baseUrl}/Product`).pipe(take(1))
  }
  


}