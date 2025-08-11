import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Aura from '@primeuix/themes/aura';

import { AppRoutingModule } from './app-routing.module';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { AppComponent } from './app.component';
import { AuthModule } from './feactures/auth/auth.module';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './feactures/dashboard/dashboard.module';

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
    SharedModule,
    DashboardModule
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
