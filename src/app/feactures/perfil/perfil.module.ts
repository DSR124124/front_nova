import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    PerfilRoutingModule
  ]
})
export class PerfilModule { }
