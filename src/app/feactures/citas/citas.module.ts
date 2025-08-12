import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CitasRoutingModule } from './citas-routing.module';
import { CitaMainComponent } from './components/cita-main/cita-main.component';
import { CitaListComponent } from './components/cita-list/cita-list.component';
import { CitaFormComponent } from './components/cita-form/cita-form.component';
import { CitaDetailComponent } from './components/cita-detail/cita-detail.component';
import { CitaCalendarComponent } from './components/cita-calendar/cita-calendar.component';
import { CitaFilterComponent } from './components/cita-filter/cita-filter.component';


@NgModule({
  declarations: [
    CitaMainComponent,
    CitaListComponent,
    CitaFormComponent,
    CitaDetailComponent,
    CitaCalendarComponent,
    CitaFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CitasRoutingModule
  ],
  exports: [
    CitaMainComponent,
    CitaCalendarComponent,
    CitaDetailComponent,
    CitaFilterComponent,
    CitaFormComponent,
    CitaListComponent
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class CitasModule { }
