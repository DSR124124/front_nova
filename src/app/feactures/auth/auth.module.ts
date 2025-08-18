import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { SharedModule } from '../../shared/shared.module';

import { MessageService } from 'primeng/api';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LogoutComponent } from './components/logout/logout.component';

// Importar el módulo de landing para usar header y footer
import { LandingModule } from '../landing/landing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimeNgModule,
    SharedModule,
    AuthRoutingModule,
    LandingModule
  ],
  providers: [MessageService],
  exports: [LogoutComponent]
})
export class AuthModule { }
