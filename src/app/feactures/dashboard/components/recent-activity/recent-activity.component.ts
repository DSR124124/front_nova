import { Component, OnInit } from '@angular/core';

export interface Activity {
  id: number;
  type: 'cita' | 'evento' | 'mensaje' | 'recordatorio' | 'regalo';
  title: string;
  description: string;
  date: Date;
  icon: string;
  user?: string;
}

@Component({
  selector: 'app-recent-activity',
  standalone: false,
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.css'
})
export class RecentActivityComponent implements OnInit {
  activities: Activity[] = [];
  loading: boolean = true;

  // Actividades simuladas para mostrar
  private sampleActivities: Activity[] = [
    {
      id: 1,
      type: 'cita',
      title: 'Nueva cita programada',
      description: 'Cita romántica en el parque central',
      date: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      icon: 'pi pi-calendar',
      user: 'Mi Pareja'
    },
    {
      id: 2,
      type: 'mensaje',
      title: 'Nuevo mensaje recibido',
      description: '¡Hola amor! ¿Cómo estás?',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'pi pi-comments',
      user: 'Mi Pareja'
    },
    {
      id: 3,
      type: 'evento',
      title: 'Evento creado',
      description: 'Aniversario de 6 meses',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      icon: 'pi pi-calendar-plus',
      user: 'Tú'
    },
    {
      id: 4,
      type: 'recordatorio',
      title: 'Recordatorio activado',
      description: 'Comprar flores para la cita',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: 'pi pi-bell',
      user: 'Tú'
    },
    {
      id: 5,
      type: 'regalo',
      title: 'Regalo agregado',
      description: 'Collar de plata para el aniversario',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: 'pi pi-gift',
      user: 'Mi Pareja'
    }
  ];

  ngOnInit() {
    this.loadActivities();
  }

  private loadActivities() {
    // Simular carga de datos
    setTimeout(() => {
      this.activities = this.sampleActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.loading = false;
    }, 1000);
  }

  getActivityTypeLabel(type: string): string {
    const labels = {
      'cita': 'Cita',
      'evento': 'Evento',
      'mensaje': 'Mensaje',
      'recordatorio': 'Recordatorio',
      'regalo': 'Regalo'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getActivitySeverity(type: string): string {
    const severities = {
      'cita': 'info',
      'evento': 'success',
      'mensaje': 'secondary',
      'recordatorio': 'contrast',
      'regalo': 'danger'
    };
    return severities[type as keyof typeof severities] || 'secondary';
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString();
  }

  refreshActivities() {
    this.loading = true;
    this.loadActivities();
  }

  clearActivities() {
    this.activities = [];
  }

  trackByActivity(index: number, activity: Activity): number {
    return activity.id;
  }
}
