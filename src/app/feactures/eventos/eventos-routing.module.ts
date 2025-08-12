import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoListComponent } from './components/evento-list/evento-list.component';
import { EventoFormComponent } from './components/evento-form/evento-form.component';
import { EventoDetailComponent } from './components/evento-detail/evento-detail.component';
import { EventoGalleryComponent } from './components/evento-gallery/evento-gallery.component';
import { EventoTimelineComponent } from './components/evento-timeline/evento-timeline.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    path: 'listar',
    component: EventoListComponent,
    title: 'Lista de Eventos'
  },
  {
    path: 'crear',
    component: EventoFormComponent,
    title: 'Crear Evento'
  },
  {
    path: 'editar/:id',
    component: EventoFormComponent,
    title: 'Editar Evento'
  },
  {
    path: 'detalle/:id',
    component: EventoDetailComponent,
    title: 'Detalle del Evento'
  },
  {
    path: 'galeria',
    component: EventoGalleryComponent,
    title: 'Galería de Eventos'
  },
  {
    path: 'timeline',
    component: EventoTimelineComponent,
    title: 'Timeline de Eventos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
