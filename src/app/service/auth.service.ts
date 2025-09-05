import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl = `${environment.baseUrl}/api/auth`;

  // private authState$ = new BehaviorSubject<AuthState>({
  //   isAuthenticated: false,
  //   userType: null,
  //   accessToken: null,
  //   user: null
  // });

  // constructor(private http: HttpClient, private router: Router) {
  //   this.loadAuthState();
  // }

  // get authState(): Observable<AuthState> {
  //   return this.authState$.asObservable();
  // }

  // get currentAuthState(): AuthState {
  //   return this.authState$.value;
  // }

  // get isAuthenticated(): boolean {
  //   return this.authState$.value.isAuthenticated;
  // }

  // get userType(): UserType | null {
  //   return this.authState$.value.userType;
  // }

  // get accessToken(): string | null {
  //   return this.authState$.value.accessToken;
  // }

  // get currentUser(): AppClient | ClientUser | null {
  //   return this.authState$.value.user;
  // }

  // loginAppClient(credentials: LoginRequest): Observable<AppClientLoginResponse> {
  //   return this.http.post<AppClientLoginResponse>(`${this.baseUrl}/app-client/login`, credentials)
  //     .pipe(
  //       tap(response => {
  //         this.setAuthState({
  //           isAuthenticated: true,
  //           userType: UserType.APP_CLIENT,
  //           accessToken: response.accessToken,
  //           user: response.appClient
  //         });
  //       })
  //     );
  // }

  // loginClientUser(credentials: LoginRequest): Observable<ClientUserLoginResponse> {
  //   return this.http.post<ClientUserLoginResponse>(`${this.baseUrl}/client-user/login`, credentials)
  //     .pipe(
  //       tap(response => {
  //         this.setAuthState({
  //           isAuthenticated: true,
  //           userType: UserType.CLIENT_USER,
  //           accessToken: response.accessToken,
  //           user: response.clientUser
  //         });
  //       })
  //     );
  // }
  
  // loginSuperAdminUser(credentials: LoginRequest): Observable<ClientUserLoginResponse> {
  //   return this.http.post<ClientUserLoginResponse>(`${this.baseUrl}/app-client/login`, credentials)
  //     .pipe(
  //       tap(response => {
  //         this.setAuthState({
  //           isAuthenticated: true,
  //           userType: UserType.SUPER_ADMIN,
  //           accessToken: response.accessToken,
  //           user: response.clientUser
  //         });
  //       })
  //     );
  // }

  // logout(): void {
  //   this.clearAuthState();
  //   this.router.navigate(['/login']);
  // }

  // private setAuthState(state: AuthState): void {
  //   this.authState$.next(state);
  //   this.saveAuthState(state);
  // }

  // private saveAuthState(state: AuthState): void {
  //   localStorage.setItem('authState', JSON.stringify(state));
  // }

  // private loadAuthState(): void {
  //   const savedState = localStorage.getItem('authState');
  //   if (savedState) {
  //     try {
  //       const state: AuthState = JSON.parse(savedState);
  //       this.authState$.next(state);
  //     } catch (error) {
  //       console.error('Error loading auth state:', error);
  //       this.clearAuthState();
  //     }
  //   }
  // }

  // private clearAuthState(): void {
  //   const emptyState: AuthState = {
  //     isAuthenticated: false,
  //     userType: null,
  //     accessToken: null,
  //     user: null
  //   };
  //   this.authState$.next(emptyState);
  //   localStorage.removeItem('authState');
  // }

  // getAuthHeaders(): HttpHeaders {
  //   const token = this.accessToken;
  //   return new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  // }

  // // Define first password method
  // defineFirstPassword(email: string, newPassword: string, resetToken: string): Observable<any> {
  //   const request = {
  //     Email: email,
  //     NewPassword: newPassword,
  //     ResetToken: resetToken
  //   };

  //   return this.http.post(`${environment.baseUrl}/auth/first-access`, request);
  // }
}
