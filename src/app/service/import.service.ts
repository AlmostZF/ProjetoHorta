import { Injectable } from "@angular/core";
import { environment } from "../../environment";
import { Observable, take } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  baseUrl = environment.worker;

  constructor( private http: HttpClient) {
  }

  importSheet(file: File): Observable<any>{
    const formData = new FormData();
    formData.append("planilha",file);
    
    return this.http.post<any[]>(`${this.baseUrl}/worker/import`, formData).pipe(take(1))
  }
}