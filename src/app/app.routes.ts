import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
        path: 'receipt-glossys',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'receipt-undo',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'receipt-remove',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'receipt-update-cheque',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'receipt-update-tt',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./components/user-creation/user-creation').then((m) => m.UserCreation),
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
