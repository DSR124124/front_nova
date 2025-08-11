import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { RecordatoriosRoutingModule } from './recordatorios-routing.module';
import { RecordatorioListComponent } from './components/recordatorio-list/recordatorio-list.component';
import { RecordatorioFormComponent } from './components/recordatorio-form/recordatorio-form.component';
import { RecordatorioCalendarComponent } from './components/recordatorio-calendar/recordatorio-calendar.component';
import { RecordatorioNotificationsComponent } from './components/recordatorio-notifications/recordatorio-notifications.component';


@NgModule({
  declarations: [
    RecordatorioListComponent,
    RecordatorioFormComponent,
    RecordatorioCalendarComponent,
    RecordatorioNotificationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    RecordatoriosRoutingModule
  ]
})
export class RecordatoriosModule { }
