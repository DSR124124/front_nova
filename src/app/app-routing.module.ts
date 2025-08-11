import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { parejaGuard } from './core/guards/pareja.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./feactures/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [authGuard, parejaGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./feactures/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  }
