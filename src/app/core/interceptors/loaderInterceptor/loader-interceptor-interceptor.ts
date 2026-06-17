import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../services/loaderService/loader-service';

let totalRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  totalRequests++;
  loaderService.isLoading.set(true);
  return next(req).pipe(
    finalize(() => {
      totalRequests--;

      if (totalRequests === 0) {
        loaderService.isLoading.set(false);
      }
    }),
  );
};
