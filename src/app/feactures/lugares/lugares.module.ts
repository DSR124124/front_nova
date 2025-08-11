import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { LugaresRoutingModule } from './lugares-routing.module';
import { LugarListComponent } from './components/lugar-list/lugar-list.component';
import { LugarFormComponent } from './components/lugar-form/lugar-form.component';
import { LugarMapComponent } from './components/lugar-map/lugar-map.component';
import { LugarFavoritesComponent } from './components/lugar-favorites/lugar-favorites.component';
import { LugarSearchComponent } from './components/lugar-search/lugar-search.component';


@NgModule({
  declarations: [
    LugarListComponent,
    LugarFormComponent,
    LugarMapComponent,
    LugarFavoritesComponent,
    LugarSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    LugaresRoutingModule
  ]
})
export class LugaresModule { }
