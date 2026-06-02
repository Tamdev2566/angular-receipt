import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout').then((m) => m.MainLayout),
  },
  // {
  //   path: 'dashboard',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./dashboard/dashboard.component').then(
  //       (m) => m.DashboardComponent,
  //     ),
  //   children: [
  //     {
  //       path: 'home',
  //       loadComponent: () =>
  //         import('./home/home.component').then((m) => m.HomeComponent),
  //     },

  //     {
  //       path: '',
  //       redirectTo: 'analytics',
  //       pathMatch: 'full',
  //     },
  //   ],
  // },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
