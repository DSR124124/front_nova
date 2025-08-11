import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { StatsWidgetComponent } from './components/stats-widget/stats-widget.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';


@NgModule({
  declarations: [
    DashboardHomeComponent,
    StatsWidgetComponent,
    UpcomingEventsComponent,
    RecentActivityComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
