import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('receipt_token');

  if (token) {
    req = req.clone({
      setHeaders: { Token: token },
    });
  }

  return next(req);
};
