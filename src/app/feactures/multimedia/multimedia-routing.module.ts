import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MediaGalleryComponent } from './components/media-gallery/media-gallery.component';
import { MediaUploadComponent } from './components/media-upload/media-upload.component';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { MediaFilterComponent } from './components/media-filter/media-filter.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'galeria',
    pathMatch: 'full'
  },
  {
    path: 'galeria',
    component: MediaGalleryComponent,
    title: 'Galería Multimedia'
  },
  {
    path: 'subir',
    component: MediaUploadComponent,
    title: 'Subir Multimedia'
  },
  {
    path: 'visor',
    component: MediaViewerComponent,
    title: 'Visor Multimedia'
  },
  {
    path: 'filtros',
    component: MediaFilterComponent,
    title: 'Filtros Multimedia'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultimediaRoutingModule { }
