import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { CitasRoutingModule } from './citas-routing.module';
import { CitaListComponent } from './components/cita-list/cita-list.component';
import { CitaFormComponent } from './components/cita-form/cita-form.component';
import { CitaDetailComponent } from './components/cita-detail/cita-detail.component';
import { CitaCalendarComponent } from './components/cita-calendar/cita-calendar.component';
import { CitaFilterComponent } from './components/cita-filter/cita-filter.component';


@NgModule({
  declarations: [
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
  ]
})
export class CitasModule { }
