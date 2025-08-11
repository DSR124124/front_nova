import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosRoutingModule } from './eventos-routing.module';
import { EventoListComponent } from './components/evento-list/evento-list.component';
import { EventoFormComponent } from './components/evento-form/evento-form.component';
import { EventoDetailComponent } from './components/evento-detail/evento-detail.component';
import { EventoGalleryComponent } from './components/evento-gallery/evento-gallery.component';
import { EventoTimelineComponent } from './components/evento-timeline/evento-timeline.component';


@NgModule({
  declarations: [
    EventoListComponent,
    EventoFormComponent,
    EventoDetailComponent,
    EventoGalleryComponent,
    EventoTimelineComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule
  ]
})
export class EventosModule { }
