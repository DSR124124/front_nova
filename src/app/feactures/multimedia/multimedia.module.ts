import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

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
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    MultimediaRoutingModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class MultimediaModule { }
