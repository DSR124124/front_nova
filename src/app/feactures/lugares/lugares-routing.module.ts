import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LugarListComponent } from './components/lugar-list/lugar-list.component';
import { LugarFormComponent } from './components/lugar-form/lugar-form.component';
import { LugarMapComponent } from './components/lugar-map/lugar-map.component';
import { LugarFavoritesComponent } from './components/lugar-favorites/lugar-favorites.component';
import { LugarSearchComponent } from './components/lugar-search/lugar-search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    path: 'listar',
    component: LugarListComponent,
    title: 'Lista de Lugares'
  },
  {
    path: 'crear',
    component: LugarFormComponent,
    title: 'Crear Lugar'
  },
  {
    path: 'editar/:id',
    component: LugarFormComponent,
    title: 'Editar Lugar'
  },
  {
    path: 'mapa',
    component: LugarMapComponent,
    title: 'Mapa de Lugares'
  },
  {
    path: 'favoritos',
    component: LugarFavoritesComponent,
    title: 'Lugares Favoritos'
  },
  {
    path: 'buscar',
    component: LugarSearchComponent,
    title: 'Buscar Lugares'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LugaresRoutingModule { }
