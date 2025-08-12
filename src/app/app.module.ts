import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Aura from '@primeuix/themes/aura';

import { AppRoutingModule } from './app-routing.module';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { AppComponent } from './app.component';
import { AuthModule } from './feactures/auth/auth.module';
import { LayoutModule } from './layout/layout.module';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNgModule,
    AuthModule,
    LayoutModule,
    SharedModule
  ],
  providers: [
    providePrimeNG({
        theme: {
            preset: Aura,

        }
    }),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
