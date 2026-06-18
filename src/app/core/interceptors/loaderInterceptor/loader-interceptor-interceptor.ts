import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../services/loaderService/loader-service';

export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

let totalRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADER)) {
    return next(req);
  }
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
