import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Interfaz para estadísticas detalladas
export interface StatData {
  label: string;
  value: number | string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  color?: string;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  standalone: false
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  private timeInterval: any;
  loadingStats = false;

  // Estadísticas básicas (simuladas)
  stats = {
    appointments: 5,
    events: 3,
    messages: 12,
    reminders: 2
  };

  // Estadísticas detalladas para el widget
  detailedStats: StatData[] = [
    {
      label: 'Citas esta semana',
      value: 5,
      icon: 'pi pi-calendar',
      trend: 'up',
      trendValue: 12,
      color: '#3b82f6'
    },
    {
      label: 'Eventos próximos',
      value: 3,
      icon: 'pi pi-calendar-plus',
      trend: 'stable',
      trendValue: 0,
      color: '#10b981'
    },
    {
      label: 'Mensajes sin leer',
      value: 12,
      icon: 'pi pi-comments',
      trend: 'up',
      trendValue: 25,
      color: '#8b5cf6'
    },
    {
      label: 'Recordatorios activos',
      value: 2,
      icon: 'pi pi-bell',
      trend: 'down',
      trendValue: 8,
      color: '#f59e0b'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Actualizar reloj cada segundo
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // Cargar estadísticas reales
    this.loadStats();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private loadStats() {
    this.loadingStats = true;
    
    // Simular carga de estadísticas
    setTimeout(() => {
      // Aquí cargarías las estadísticas reales desde un servicio
      this.detailedStats = [
        {
          label: 'Citas esta semana',
          value: Math.floor(Math.random() * 10) + 1,
          icon: 'pi pi-calendar',
          trend: 'up',
          trendValue: Math.floor(Math.random() * 20) + 5,
          color: '#3b82f6'
        },
        {
          label: 'Eventos próximos',
          value: Math.floor(Math.random() * 8) + 1,
          icon: 'pi pi-calendar-plus',
          trend: 'stable',
          trendValue: 0,
          color: '#10b981'
        },
        {
          label: 'Mensajes sin leer',
          value: Math.floor(Math.random() * 25) + 1,
          icon: 'pi pi-comments',
          trend: 'up',
          trendValue: Math.floor(Math.random() * 30) + 10,
          color: '#8b5cf6'
        },
        {
          label: 'Recordatorios activos',
          value: Math.floor(Math.random() * 6) + 1,
          icon: 'pi pi-bell',
          trend: 'down',
          trendValue: Math.floor(Math.random() * 15) + 5,
          color: '#f59e0b'
        }
      ];
      
      this.loadingStats = false;
    }, 1500);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
