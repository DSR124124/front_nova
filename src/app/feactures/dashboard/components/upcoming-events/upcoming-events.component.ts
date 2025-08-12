import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface UpcomingEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  location?: string;
  category: 'cita' | 'aniversario' | 'especial' | 'recordatorio';
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

@Component({
  selector: 'app-upcoming-events',
  standalone: false,
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css'
})
export class UpcomingEventsComponent implements OnInit {
  events: UpcomingEvent[] = [];
  loading: boolean = true;
  maxEvents: number = 5;
  drawerVisible: boolean = false;

  constructor(private router: Router) {}

  // Eventos simulados para mostrar
  private sampleEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: 'Cita Romántica en el Parque',
      description: 'Picnic al atardecer con música y velas',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
      location: 'Parque Central',
      category: 'cita',
      priority: 'high',
      icon: 'pi pi-heart'
    },
    {
      id: 2,
      title: 'Aniversario de 6 Meses',
      description: 'Celebración especial de nuestros 6 meses juntos',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // En 5 días
      location: 'Restaurante Favorito',
      category: 'aniversario',
      priority: 'high',
      icon: 'pi pi-star'
    },
    {
      id: 3,
      title: 'Cine Nocturno',
      description: 'Ver la nueva película romántica',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 1 semana
      location: 'Cinema Plaza',
      category: 'cita',
      priority: 'medium',
      icon: 'pi pi-video'
    },
    {
      id: 4,
      title: 'Comprar Regalo',
      description: 'Buscar el regalo perfecto para el aniversario',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
      category: 'recordatorio',
      priority: 'medium',
      icon: 'pi pi-shopping-bag'
    },
    {
      id: 5,
      title: 'Cena Especial en Casa',
      description: 'Cocinar juntos una cena especial',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // En 10 días
      location: 'Casa',
      category: 'especial',
      priority: 'low',
      icon: 'pi pi-home'
    }
  ];

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    // Simular carga de datos
    setTimeout(() => {
      this.events = this.sampleEvents
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, this.maxEvents);
      this.loading = false;
    }, 1000);
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'pi pi-exclamation-triangle';
      case 'medium': return 'pi pi-info-circle';
      case 'low': return 'pi pi-minus-circle';
      default: return 'pi pi-circle';
    }
  }

  getPrioritySeverity(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'secondary';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'cita': return 'var(--p-pink-500)';
      case 'aniversario': return 'var(--p-yellow-500)';
      case 'especial': return 'var(--p-purple-500)';
      case 'recordatorio': return 'var(--p-blue-500)';
      default: return 'var(--p-primary-color)';
    }
  }

  formatTimeUntil(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays < 0) return 'Pasado';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 7) return `En ${diffDays} días`;
    if (diffDays < 30) return `En ${Math.ceil(diffDays / 7)} semanas`;
    return `En ${Math.ceil(diffDays / 30)} meses`;
  }

  formatEventDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refreshEvents() {
    this.loading = true;
    this.loadEvents();
  }

  viewAllEvents() {
    this.router.navigate(['/app/eventos']);
  }

  createEvent() {
    this.router.navigate(['/app/eventos/nuevo']);
  }

  getCategoryLabel(category: string): string {
    const labels = {
      'cita': 'Cita',
      'aniversario': 'Aniversario',
      'especial': 'Especial',
      'recordatorio': 'Recordatorio'
    };
    return labels[category as keyof typeof labels] || category;
  }

  viewEventDetails(event: UpcomingEvent) {
    // Navegar según el tipo de evento
    switch (event.category) {
      case 'cita':
        this.router.navigate(['/app/citas']);
        break;
      case 'aniversario':
      case 'especial':
        this.router.navigate(['/app/eventos']);
        break;
      case 'recordatorio':
        this.router.navigate(['/app/recordatorios']);
        break;
      default:
        this.router.navigate(['/app/eventos']);
    }
  }

  trackByEvent(index: number, event: UpcomingEvent): number {
    return event.id;
  }
}
