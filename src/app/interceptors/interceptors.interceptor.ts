import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { SessionService } from '../service/session.service';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const router = inject(Router);

  const authentication = JSON.parse(localStorage.getItem('tokenSection') || 'null');

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

      console.log(error)
      if (error.status === 401 && authentication?.refreshToken) {
        console.warn('🔄 Interceptor: Token expirado. Tentando Refresh...');

        return session.refreshToken(authentication.refreshToken).pipe(
          switchMap((response) => {
            
            localStorage.setItem('tokenSection', JSON.stringify(response));

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.bearerToken}`
              }
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {

            localStorage.removeItem('tokenSection');
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};