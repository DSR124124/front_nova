import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { StatsWidgetComponent } from './components/stats-widget/stats-widget.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'home',
    component: DashboardHomeComponent,
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'activity',
    component: RecentActivityComponent,
    data: { breadcrumb: 'Actividad Reciente' }
  },
  {
    path: 'events',
    component: UpcomingEventsComponent,
    data: { breadcrumb: 'Eventos Próximos' }
  },
  {
    path: 'stats',
    component: StatsWidgetComponent,
    data: { breadcrumb: 'Estadísticas' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
