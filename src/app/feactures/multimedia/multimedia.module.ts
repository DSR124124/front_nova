import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultimediaRoutingModule } from './multimedia-routing.module';
import { MediaGalleryComponent } from './components/media-gallery/media-gallery.component';
import { MediaUploadComponent } from './components/media-upload/media-upload.component';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { MediaFilterComponent } from './components/media-filter/media-filter.component';


@NgModule({
  declarations: [
    MediaGalleryComponent,
    MediaUploadComponent,
    MediaViewerComponent,
    MediaFilterComponent
  ],
  imports: [
    CommonModule,
    MultimediaRoutingModule
  ]
})
export class MultimediaModule { }
