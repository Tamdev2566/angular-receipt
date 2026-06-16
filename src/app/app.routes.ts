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
        path: 'receipts',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'new-receipt',
        loadComponent: () =>
          import('./components/new-receipts/new-receipts').then((m) => m.NewReceiptComponent),
      },
      {
        path: 'receipt-remove',
        loadComponent: () =>
          import('./components/receipts/receipts').then((m) => m.ReceiptComponent),
      },
      {
        path: 'receipt-undo',
        loadComponent: () =>
          import('./components/undo-receipts/undo-receipts').then((m) => m.UndoReceiptComponent),
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
        path: 'user-mgt-list',
        loadComponent: () =>
          import('./components/user-management/user-mgt-list/user-mgt-list').then(
            (m) => m.UserMgtList,
          ),
      },
      {
        path: 'user-mgt-details',
        loadComponent: () =>
          import('./components/user-management/user-mgt-details/user-mgt-details').then(
            (m) => m.UserMgtDetails,
          ),
      },
      {
        path: 'user-mgt-history',
        loadComponent: () =>
          import('./components/user-management/user-mgt-history/user-mgt-history').then(
            (m) => m.UserMgtHistoryComponent,
          ),
      },
      {
        path: 'group-mgt-list',
        loadComponent: () =>
          import('./components/group-management/group-mgt-list/group-mgt-list').then(
            (m) => m.GroupMgtList,
          ),
      },
      {
        path: 'group-mgt-details',
        loadComponent: () =>
          import('./components/group-management/group-mgt-details/group-mgt-details').then(
            (m) => m.GroupMgtDetails,
          ),
      },
      {
        path: 'group-mgt-history',
        loadComponent: () =>
          import('./components/group-management/group-mgt-history/group-mgt-history').then(
            (m) => m.GroupMgtHistoryComponent,
          ),
      },
    ],
  },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home/404' },
];
