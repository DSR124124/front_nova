import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { LandingRoutingModule } from './landing-routing.module';

import { LandingComponent } from './landing.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { CtaComponent } from './components/cta/cta.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    LandingComponent,
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    CtaComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    LandingRoutingModule
  ],
  exports: [
    LandingComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class LandingModule { }
