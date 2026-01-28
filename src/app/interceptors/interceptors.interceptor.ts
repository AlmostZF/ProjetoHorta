import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthService);
  const router = inject(Router);

  const authentication = JSON.parse(localStorage.getItem('authState') || 'null');
  let finalReq = req;

  if (authentication?.bearerToken) {

    finalReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authentication.bearerToken}`
      }
    });
  }

  return next(finalReq).pipe(
      catchError((error) => {
        if (error.status === 401 && req.url.includes('/refresh')) {
          isRefreshing = false;
          session.logout(authentication.refreshToken);
          router.navigate(['/login']);
          return throwError(() => error);
        }

        if (error.status === 401 && authentication?.refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;

            return session.refresh(authentication.refreshToken).pipe(
              switchMap((response) => {
                isRefreshing = false;
                localStorage.setItem('authState', JSON.stringify(response));
                refreshTokenSubject.next(response.bearerToken);

                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${response.bearerToken}` }
                }));
              }),
              catchError((err) => {
                isRefreshing = false;
                localStorage.removeItem('authState');
                router.navigate(['/login']);
                return throwError(() => err);
              })
            );
          } else {
            return refreshTokenSubject.pipe(
              filter(token => token !== null),
              take(1),
              switchMap(token => {
                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                }));
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
};