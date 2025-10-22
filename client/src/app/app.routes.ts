import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'sing-in',
    loadComponent: () => import('./pages/sing-in/sing-in').then((m) => m.SingIn),
  },
  {
    path: 'sing-up',
    loadComponent: () => import('./pages/sing-up/sing-up').then((m) => m.SingUp),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./pages/chat/chat').then((m) => m.Chat),
    canActivate: [authGuard],
  },
  { path: '**', loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing) },
];
