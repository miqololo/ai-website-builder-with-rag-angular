import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from '../services/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const appError = errorHandler.handleError(error) as any;

      // Handle specific error cases
      if (error.status === 401) {
        // Unauthorized - clear auth and redirect to login
        authService.logout();
        router.navigate(['/auth/signin'], {
          queryParams: { returnUrl: router.url }
        });
      } else if (error.status === 403) {
        // Forbidden - redirect to home or show error
        router.navigate(['/']);
      }

      return throwError(() => appError);
    })
  );
};
