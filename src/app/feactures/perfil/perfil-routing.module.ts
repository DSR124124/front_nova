import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { PerfilParejaComponent } from './components/perfil-pareja/perfil-pareja.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'usuario',
    pathMatch: 'full'
  },
  {
    path: 'usuario',
    component: PerfilUsuarioComponent,
    data: { title: 'Mi Perfil', breadcrumb: 'Mi Perfil' }
  },
  {
    path: 'pareja',
    component: PerfilParejaComponent,
    data: { title: 'Perfil de Pareja', breadcrumb: 'Perfil de Pareja' }
  },
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
    data: { title: 'Configuración', breadcrumb: 'Configuración' }
  },
  {
    path: 'cambiar-password',
    component: CambiarPasswordComponent,
    data: { title: 'Cambiar Contraseña', breadcrumb: 'Cambiar Contraseña' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
