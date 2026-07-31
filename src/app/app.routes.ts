import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RemoveInvoiceDetails } from './components/remove-invoice/remove-invoice-details/remove-invoice-details';
import { UndoPaymentDetails } from './components/undo-payments/undo-payment-details/undo-payment-details';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./components/change-password/change-password').then((m) => m.ChangePasswordPage),
  },
  {
    path: 'main',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '404',
        loadComponent: () =>
          import('./shared/not-found-page/not-found-page').then((m) => m.NotFoundPage),
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./components/layout/welcome/welcome').then((m) => m.WelcomeComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'receipts',
        loadComponent: () =>
          import('./components/receipt/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'new-receipt',
        loadComponent: () =>
          import('./components/receipt/new-receipts/new-receipts').then(
            (m) => m.NewReceiptComponent,
          ),
      },
      {
        path: 'undo-receipt',
        loadComponent: () => import('./shared/wrapper/wrapper').then((m) => m.Wrapper),
        data: {
          isModal: false,
          title: 'Undo Receipt',
          dynamicComponent: UndoPaymentDetails,
        },
      },

      {
        path: 'receipt-remove',
        loadComponent: () => import('./shared/wrapper/wrapper').then((m) => m.Wrapper),
        data: {
          isModal: false,
          title: 'Undo Receipt',
          dynamicComponent: RemoveInvoiceDetails,
        },
      },

      // {
      //   path: 'remove-invoice',
      //   loadComponent: () =>
      //     import('./components/remove-invoice/remove-invoice-list/remove-invoice-list').then(
      //       (m) => m.RemoveInvoiceList,
      //     ),
      // },
      {
        path: 'remove-invoice',
        loadComponent: () =>
          import('./components/remove-invoice/remove-invoice-details/remove-invoice-details').then(
            (m) => m.RemoveInvoiceDetails,
          ),
      },
      {
        path: 'undo-payment',
        loadComponent: () =>
          import('./components/undo-payments/undo-payment-details/undo-payment-details').then(
            (m) => m.UndoPaymentDetails,
          ),
      },
      // {
      //   path: 'undo-payment-details',
      //   loadComponent: () =>
      //     import('./components/undo-payments/undo-payment-details/undo-payment-details').then(
      //       (m) => m.UndoPaymentDetails,
      //     ),
      // },

      {
        path: 'update-cheque',
        loadComponent: () =>
          import('./components/update-cheque/update-cheque').then((m) => m.UpdateCheque),
      },

      {
        path: 'update-tt-ref',
        loadComponent: () =>
          import('./components/update-tt-reference/update-tt-reference').then(
            (m) => m.UpdateTtReference,
          ),
      },
      {
        path: 'edi-to-coda',
        loadComponent: () =>
          import('./components/edi-to-coda/edi-to-coda').then((m) => m.EdiToCoda),
      },
      {
        path: 'print-report',
        loadComponent: () =>
          import('./components/print-report/print-report').then((m) => m.PrintReport),
      },
      {
        path: 'updated-cheque-report',
        loadComponent: () =>
          import('./components/updated-cheque-report/updated-cheque-report').then(
            (m) => m.UpdatedChequeReport,
          ),
      },
      {
        path: 'removed-invoice-report',
        loadComponent: () =>
          import('./components/removed-invoice-report/removed-invoice-report').then(
            (m) => m.RemovedInvoiceReport,
          ),
      },
      {
        path: 'updated-tt-ref-report',
        loadComponent: () =>
          import('./components/updated-tt-ref-report/updated-tt-ref-report').then(
            (m) => m.UpdatedTtRefReport,
          ),
      },
      {
        path: 'cheque-reader-info',
        loadComponent: () =>
          import('./components/cheque-reader-info/cheque-reader-info').then(
            (m) => m.ChequeReaderInfo,
          ),
      },
      {
        path: 'undo-cheque',
        loadComponent: () =>
          import('./components/undo-cheque/undo-cheque').then((m) => m.UndoCheque),
      },
      {
        path: 'aging-report',
        loadComponent: () =>
          import('./components/aging-report/aging-report').then((m) => m.AgingReport),
      },
      {
        path: 'daily-scan-report',
        loadComponent: () =>
          import('./components/daily-scan-report/daily-scan-report').then((m) => m.DailyScanReport),
      },
      {
        path: 'undo-cheque-reader-report',
        loadComponent: () =>
          import('./components/undo-cheque-reader-report/undo-cheque-reader-report').then(
            (m) => m.UndoChequeReaderReport,
          ),
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'main/404' },
];
