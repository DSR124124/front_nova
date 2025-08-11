import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { RegalosRoutingModule } from './regalos-routing.module';
import { RegaloListComponent } from './components/regalo-list/regalo-list.component';
import { RegaloFormComponent } from './components/regalo-form/regalo-form.component';
import { RegaloDetailComponent } from './components/regalo-detail/regalo-detail.component';
import { RegaloHistoryComponent } from './components/regalo-history/regalo-history.component';
import { RegaloStatsComponent } from './components/regalo-stats/regalo-stats.component';


@NgModule({
  declarations: [
    RegaloListComponent,
    RegaloFormComponent,
    RegaloDetailComponent,
    RegaloHistoryComponent,
    RegaloStatsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    RegalosRoutingModule
  ]
})
export class RegalosModule { }
