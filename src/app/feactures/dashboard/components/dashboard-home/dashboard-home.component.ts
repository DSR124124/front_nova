import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  standalone: false
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  private timeInterval: any;

  // Estadísticas básicas (simuladas)
  stats = {
    appointments: 5,
    events: 3,
    messages: 12,
    reminders: 2
  };

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
    // Aquí cargarías las estadísticas reales desde un servicio
    // Por ahora mantenemos datos simulados
    this.stats = {
      appointments: Math.floor(Math.random() * 10) + 1,
      events: Math.floor(Math.random() * 5) + 1,
      messages: Math.floor(Math.random() * 20) + 1,
      reminders: Math.floor(Math.random() * 5) + 1
    };
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
