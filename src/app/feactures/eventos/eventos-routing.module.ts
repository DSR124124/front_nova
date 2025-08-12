import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    path: 'listar',
    loadComponent: () => import('./components/evento-list/evento-list.component').then(m => m.EventoListComponent),
    title: 'Lista de Eventos'
  },
  {
    path: 'crear',
    loadComponent: () => import('./components/evento-form/evento-form.component').then(m => m.EventoFormComponent),
    title: 'Crear Evento'
  },
  {
    path: 'galeria',
    loadComponent: () => import('./components/evento-gallery/evento-gallery.component').then(m => m.EventoGalleryComponent),
    title: 'Galería de Eventos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
