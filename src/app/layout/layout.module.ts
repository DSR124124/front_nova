import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarItemComponent } from './components/sidebar-item/sidebar-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LayoutMainComponent } from './components/layout-main/layout-main.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SidebarItemComponent,
    FooterComponent,
    BreadcrumbComponent,
    LayoutMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimeNgModule,
    LayoutRoutingModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    SidebarItemComponent,
    FooterComponent,
    BreadcrumbComponent,
    LayoutMainComponent
  ],
})
export class LayoutModule { }
