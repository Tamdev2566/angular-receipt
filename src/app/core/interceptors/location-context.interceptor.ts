import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { LocationContextService } from '../../services/location-context.service';

const locationScopedPaths = [
  '/api/receipts/retrive',
  '/api/receipts/confirm-payment',
  '/api/receipts/over-payment',
  '/api/receiptRetrieve',
  '/api/receiptCheckOutstanding',
  '/api/getvessel',
  '/api/getvoyage',
  '/api/cheque/save',
  '/api/cheque/list',
  '/api/chequeBox/cheque-numbers',
  '/api/chequeBox/full-cheque-numbers',
  '/api/master-banks/',
  '/api/master-accounts/',
  '/api/dashboard/kpi',
  '/api/dashboard/recent-receipts',
  '/api/dashboard/receiptSummary',
  '/api/cheque/search',
  '/api/cheque/update',
  '/api/tt-ref/search',
  '/api/tt-ref/update',
  '/api/removeInvoices/search',
  '/api/removeInvoices/transaction',
  '/api/removeInvoices/remove',
  '/api/undo-payment/retrieve',
  '/api/undo-payment/execute-rollback',
  'api/cheque/search',
  'api/ediCoda/retrieve',
  'api/ediCoda/export',
  '/api/undoCheque/search',
  'api/undoCheque/undo',
];

function requiresLocation(url: string): boolean {
  return locationScopedPaths.some((path) => url.includes(path));
}

function usesLocationQuery(url: string, method: string): boolean {
  return (
    method === 'GET' ||
    url.includes('/api/master-banks/') ||
    url.includes('/api/master-accounts/') ||
    url.includes('/api/undo-payment/execute-rollback') ||
    url.includes('/api/ediCoda/export')
  );
}

export const locationContextInterceptor: HttpInterceptorFn = (req, next) => {
  if (!requiresLocation(req.url)) {
    return next(req);
  }

  return inject(LocationContextService)
    .getLocationCode()
    .pipe(
      switchMap((locationId) => {
        if (!locationId) {
          return next(req);
        }

        const params: HttpParams = usesLocationQuery(req.url, req.method)
          ? req.params.set('locationId', locationId)
          : req.params;

        const body =
          req.body &&
          typeof req.body === 'object' &&
          !Array.isArray(req.body) &&
          !(req.body instanceof FormData)
            ? { ...req.body, locationId }
            : req.body;

        return next(req.clone({ params, body }));
      }),
    );
};
