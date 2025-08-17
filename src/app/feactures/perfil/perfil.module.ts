import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { SharedModule } from '../../shared/shared.module';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { PerfilParejaComponent } from './components/perfil-pareja/perfil-pareja.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';


@NgModule({
  declarations: [
    PerfilUsuarioComponent,
    PerfilParejaComponent,
    ConfiguracionComponent,
    CambiarPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    PerfilRoutingModule
  ],
  providers: [
    MessageService
  ],
  exports: [
    PerfilUsuarioComponent,
    PerfilParejaComponent,
    ConfiguracionComponent,
    CambiarPasswordComponent
  ]
})
export class PerfilModule { }
