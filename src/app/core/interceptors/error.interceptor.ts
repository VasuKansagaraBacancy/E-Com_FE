import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log error for debugging
      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        message: error.message
      });

      if (error.status === 401) {
        // Unauthorized - clear storage and redirect to login
        storageService.clear();
        router.navigate(['/auth/login']);
      }

      // Return the error so components can handle it
      return throwError(() => error);
    })
  );
};

