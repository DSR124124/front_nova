import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { LandingRoutingModule } from './landing-routing.module';

import { LandingComponent } from './landing.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { DemoComponent } from './components/demo/demo.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { AboutComponent } from './components/about/about.component';
import { PricingComponent } from './components/pricing/pricing.component';

import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    LandingComponent,
    HeaderComponent,
    HeroComponent,
    DemoComponent,
    TestimonialsComponent,
    AboutComponent,
    PricingComponent,

    ContactComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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
