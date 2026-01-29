import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { environment } from "../../environment";
import { CalculateOrder, ListOrderItensRequest, OrderCalculated,ReservationRequest, ReservationResponse, ResultOrder} from "../models/order.model";
import { Seller, ViaCepResponse } from "../models/seller.model";

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  url = environment;

  constructor( private http: HttpClient) {
  }

  getSeller(): Observable<Seller>{
    return this.http.get<Seller>(`${this.url.baseUrl}/Seller`).pipe(take(1))
  }

  getZipCode(zipCode: string): Observable<ViaCepResponse>{
    return this.http.get<ViaCepResponse>(`${this.url.viacep}/${zipCode}/json`)
  }
}
