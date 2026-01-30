import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { environment } from "../../environment";
import { PickupLocation, Seller, UpdateSeller, ViaCepResponse } from "../models/seller.model";

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  url = environment;

  constructor( private http: HttpClient) {
  }

  getSeller(): Observable<Seller>{
    return this.http.get<Seller>(`${this.url.baseUrl}/Seller`).pipe(take(1));
  }

  getZipCode(zipCode: string): Observable<ViaCepResponse>{
    return this.http.get<ViaCepResponse>(`${this.url.viacep}/${zipCode}/json`).pipe(take(1));
  }

  updateSeller(seller: UpdateSeller): Observable<Seller>{
    return this.http.put<Seller>(`${this.url.baseUrl}/Seller`, seller).pipe(take(1));
  }

  updatePickupLocation(pickupLocation: PickupLocation): Observable<any>{
    return this.http.put<any>(`${this.url.baseUrl}/PickupLocation`, pickupLocation).pipe(take(1));
  }

}
