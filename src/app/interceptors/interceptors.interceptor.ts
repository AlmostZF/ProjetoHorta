import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { SessionService } from '../service/session.service';
import { AuthService } from '../service/auth.service';

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
  } else {
    
  }

  return next(finalReq).pipe(
    catchError((error) => {

      if (error.status === 401 && authentication?.refreshToken) {
        console.warn('🔄 Interceptor: Token expirado. Tentando Refresh...');

        return session.refresh(authentication.refreshToken).pipe(
          switchMap((response) => {
            
            localStorage.setItem('authState', JSON.stringify(response));

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.bearerToken}`
              }
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {

            localStorage.removeItem('authState');
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};