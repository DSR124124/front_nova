import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Aura from '@primeuix/themes/aura';

import { AppRoutingModule } from './app-routing.module';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './feactures/auth/auth.module';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,        // ← Agregado aquí
    AppRoutingModule,
    PrimeNgModule,
    AuthModule
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,

        }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
