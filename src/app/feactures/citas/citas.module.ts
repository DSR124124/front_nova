import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { ConfirmationService } from 'primeng/api';

import { CitasRoutingModule } from './citas-routing.module';
import { CitaListComponent } from './components/cita-list/cita-list.component';
import { CitaFormComponent } from './components/cita-form/cita-form.component';
import { CitaDetailComponent } from './components/cita-detail/cita-detail.component';
import { CitaCalendarComponent } from './components/cita-calendar/cita-calendar.component';
import { CitaFilterComponent } from './components/cita-filter/cita-filter.component';
import { CategoriaCitaComponent } from './components/categoria-cita/categoria-cita.component';
import { CategoriaCitaFormsComponent } from './components/categoria-cita/categoria-cita-forms/categoria-cita-forms.component';
import { CategoriaCitaListComponent } from './components/categoria-cita/categoria-cita-list/categoria-cita-list.component';
import { CategoriaCitaDeleteComponent } from './components/categoria-cita/categoria-cita-delete/categoria-cita-delete.component';
import { CategoriaCitaFilterComponent } from './components/categoria-cita/categoria-cita-filter/categoria-cita-filter.component';

@NgModule({
  declarations: [
    CitaListComponent,
    CitaFormComponent,
    CitaDetailComponent,
    CitaCalendarComponent,
    CitaFilterComponent,
    CategoriaCitaComponent,
    CategoriaCitaFormsComponent,
    CategoriaCitaListComponent,
    CategoriaCitaDeleteComponent,
    CategoriaCitaFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CitasRoutingModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class CitasModule { }
