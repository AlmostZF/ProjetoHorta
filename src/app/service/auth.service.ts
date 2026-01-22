import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { Authentication, Login } from '../models/session-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authentication = JSON.parse(localStorage.getItem('authState') || 'null');

  getAuthHeaders(): HttpHeaders {
    const token = this.authentication?.bearerToken;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  private baseUrl = `${environment.baseUrl}`;

  private authState$ = new BehaviorSubject<Authentication>({
    isAuthenticated: false,
    bearerToken:null,
    expiration:null,
    refreshToken:null
  });

  constructor(private http: HttpClient, private router: Router) {
  }

  get authState(): Observable<Authentication> {
    return this.authState$.asObservable();
  }

  get currentAuthState(): Authentication {
    return this.authState$.value;
  }

  get isAuthenticated(): boolean {
    return this.authState$.value.isAuthenticated;
  }

  get bearerToken(): string | null {
    return this.authState$.value.bearerToken;
  }

  get refreshToken(): string | null {
    return this.authState$.value.refreshToken;
  }

  loginSeller(credentials: Login): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.baseUrl}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthState({
              isAuthenticated: true,
              bearerToken: response.bearerToken,
              expiration: response.expiration,
              refreshToken: response.refreshToken
          });
        })
      );
  }

  refresh(token: string): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.baseUrl}/refresh`, { refreshToken:token })
      .pipe(
        tap(response => {
          this.setAuthState({
              isAuthenticated: true,
              bearerToken: response.bearerToken,
              expiration: response.expiration,
              refreshToken: response.refreshToken
          });
        })
      );
  }

  logout(refreshToken: string): Observable<void>  {
    const refresh = {refreshToken}

    return this.http.post<void>(`${this.baseUrl}/logout`, refresh)
      .pipe(
        tap(response => {
            this.clearAuthState();
            this.router.navigate(['/login']);
        })
      );
  }

  private setAuthState(state: Authentication): void {
    this.authState$.next(state);
    this.saveAuthState(state);
  }

  private saveAuthState(state: Authentication): void {
    localStorage.setItem('authState', JSON.stringify(state));
  }

  private clearAuthState(): void {
    const emptyState: Authentication = {
      isAuthenticated: false,
      bearerToken:null,
      expiration:null,
      refreshToken:null
    };
    this.authState$.next(emptyState);
    localStorage.removeItem('authState');
  }

  //   return this.http.post(`${environment.baseUrl}/auth/first-access`, request);
  // }
}
