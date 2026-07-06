import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UndoReceiptComponent } from './components/receipt/model/undo-receipts/undo-receipts';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'home',
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
      // {
      //   path: 'receipt-remove',
      //   loadComponent: () =>
      //     import('./components/receipt/receipts/receipts').then((m) => m.ReceiptComponent),
      // },
      {
        path: 'receipt-undo',
        loadComponent: () => import('./shared/wrapper/wrapper').then((m) => m.Wrapper),
        data: {
          isModal: false,
          title: 'Undo Receipt',
          dynamicComponent: UndoReceiptComponent,
        },
      },
      // {
      //   path: 'receipt-update-cheque',
      //   loadComponent: () =>
      //     import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      // },
      // {
      //   path: 'receipt-update-tt',
      //   loadComponent: () =>
      //     import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      // },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home/404' },
];
