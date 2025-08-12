import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitaListComponent } from './components/cita-list/cita-list.component';
import { CitaFormComponent } from './components/cita-form/cita-form.component';
import { CitaDetailComponent } from './components/cita-detail/cita-detail.component';
import { CitaCalendarComponent } from './components/cita-calendar/cita-calendar.component';
import { CitaFilterComponent } from './components/cita-filter/cita-filter.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    path: 'listar',
    component: CitaListComponent,
    title: 'Lista de Citas'
  },
  {
    path: 'nueva',
    component: CitaFormComponent,
    title: 'Nueva Cita'
  },
  {
    path: 'editar/:id',
    component: CitaFormComponent,
    title: 'Editar Cita'
  },
  {
    path: ':id',
    component: CitaDetailComponent,
    title: 'Detalle de Cita'
  },
  {
    path: 'calendario',
    component: CitaCalendarComponent,
    title: 'Calendario de Citas'
  },
  {
    path: 'filtros',
    component: CitaFilterComponent,
    title: 'Filtros de Citas'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }
