import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { NotasRoutingModule } from './notas-routing.module';
import { NotaListComponent } from './components/nota-list/nota-list.component';
import { NotaFormComponent } from './components/nota-form/nota-form.component';
import { NotaDetailComponent } from './components/nota-detail/nota-detail.component';
import { NotaSearchComponent } from './components/nota-search/nota-search.component';


@NgModule({
  declarations: [
    NotaListComponent,
    NotaFormComponent,
    NotaDetailComponent,
    NotaSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    NotasRoutingModule
  ]
})
export class NotasModule { }
