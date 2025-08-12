import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../feactures/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'citas',
    loadChildren: () => import('../feactures/citas/citas.module').then(m => m.CitasModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('../feactures/eventos/eventos.module').then(m => m.EventosModule)
  },
  {
    path: 'lugares',
    loadChildren: () => import('../feactures/lugares/lugares.module').then(m => m.LugaresModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('../feactures/chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'regalos',
    loadChildren: () => import('../feactures/regalos/regalos.module').then(m => m.RegalosModule)
  },
  {
    path: 'recordatorios',
    loadChildren: () => import('../feactures/recordatorios/recordatorios.module').then(m => m.RecordatoriosModule)
  },
  {
    path: 'notas',
    loadChildren: () => import('../feactures/notas/notas.module').then(m => m.NotasModule)
  },
  {
    path: 'multimedia',
    loadChildren: () => import('../feactures/multimedia/multimedia.module').then(m => m.MultimediaModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('../feactures/perfil/perfil.module').then(m => m.PerfilModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
