import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { environment } from "../../environment";
import { Product, CreateProduct, UpdateProduct } from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getProduct(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseUrl}/Product`).pipe(take(1))
  }

  getProductById(id:string): Observable<Product>{
    return this.http.get<Product>(`${this.baseUrl}/Product/${id}`).pipe(take(1))
  }
  
  deleteProductById(id:string): Observable<Product>{
    return this.http.delete<Product>(`${this.baseUrl}/Product/${id}`).pipe(take(1))
  }

  createProduct(createProduct: CreateProduct): Observable<string>{
    return this.http.post<string>(`${this.baseUrl}/Product`, createProduct).pipe(take(1))
  }

  updateProduct(updateProduct: UpdateProduct): Observable<Product>{
    return this.http.put<Product>(`${this.baseUrl}/Product`, updateProduct).pipe(take(1))
  }
  


}