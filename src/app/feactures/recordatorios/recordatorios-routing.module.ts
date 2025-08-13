import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecordatorioListComponent } from './components/recordatorio-list/recordatorio-list.component';
import { RecordatorioFormComponent } from './components/recordatorio-form/recordatorio-form.component';
import { RecordatorioCalendarComponent } from './components/recordatorio-calendar/recordatorio-calendar.component';
import { RecordatorioNotificationsComponent } from './components/recordatorio-notifications/recordatorio-notifications.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    component: RecordatorioListComponent,
    title: 'Lista de Recordatorios'
  },
  {
    path: 'nuevo',
    component: RecordatorioFormComponent,
    title: 'Nuevo Recordatorio'
  },
  {
    path: 'editar/:id',
    component: RecordatorioFormComponent,
    title: 'Editar Recordatorio'
  },
  {
    path: 'calendario',
    component: RecordatorioCalendarComponent,
    title: 'Calendario de Recordatorios'
  },
  {
    path: 'notificaciones',
    component: RecordatorioNotificationsComponent,
    title: 'Notificaciones'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordatoriosRoutingModule { }
