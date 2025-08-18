import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { parejaGuard } from './core/guards/pareja.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feactures/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./feactures/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['USER'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./feactures/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./feactures/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['USER', 'ADMIN'] }
  },
  {
    path: 'user-complete',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [authGuard, parejaGuard, roleGuard],
    data: { roles: ['USER'] }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
