import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

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
    PrimeNgModule,
    PerfilRoutingModule
  ]
})
export class PerfilModule { }
