import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { environment } from "../../environment";
import { Product, CreateProduct, UpdateProduct, ProductFitered, Filter } from "../models/product.model";
import { DashboardData } from "../models/dashboard.model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getDashboard(month?:number, year?:number, limit: number = 10): Observable<DashboardData>{
    const [targetMonth, targetYear] = this.defaultDashboard(month, year);

    return this.http.get<DashboardData>(`${this.baseUrl}/Dasboard/${targetMonth}/${targetYear}/${limit}`).pipe(take(1))
  }

  private defaultDashboard(month?:number, year?:number): [number, number]{
    const today = new Date();

    const finalMonth = month ?? (today.getMonth() + 1);
    const finalYear = year ?? today.getFullYear();

    return [finalMonth, finalYear];
  }


}