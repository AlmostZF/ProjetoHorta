import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { CustomerSignUp, Login, Authentication, SellerSignUp } from '../models/session-model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  login(user: Login): Observable<Authentication> {
    const httpHeader = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return this.http.post<Authentication>(`${this.baseUrl}/Auth/login`, user, httpHeader).pipe(take(1))

  }

  refreshToken(token: string): Observable<Authentication> {
    const httpHeader = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return this.http.post<Authentication>(`${this.baseUrl}/refresh`, { refreshToken:token }, httpHeader).pipe(take(1))
  }

  signUpCustomer(user: CustomerSignUp): Observable<Authentication> {
    const httpHeader = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return this.http.post<Authentication>(`${this.baseUrl}/Auth/register/costumer`, user, httpHeader).pipe(take(1))
  }

  signUpSeller(user: SellerSignUp): Observable<Authentication> {
    const httpHeader = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return this.http.post<Authentication>(`${this.baseUrl}/Auth/register/seller`, user, httpHeader).pipe(take(1))
  }
}
