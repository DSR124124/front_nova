import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { CitaService } from '../../../../core/services/cita.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Cita, EstadoCita } from '../../../../core/models/Interfaces/cita/cita';

interface CalendarEvent {
  id?: number;
  title: string;
  date: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    cita: Cita;
    descripcion?: string;
    lugar?: string;
    estado: EstadoCita;
  };
}

@Component({
  selector: 'app-cita-calendar',
  standalone: false,
  templateUrl: './cita-calendar.component.html',
  styleUrl: './cita-calendar.component.css'
})
export class CitaCalendarComponent implements OnInit, OnDestroy {
  citas: Cita[] = [];
  events: CalendarEvent[] = [];
  loading = true;
  error = '';
  selectedDate: Date = new Date();
  calendarView: 'month' | 'week' | 'day' = 'month';

  private destroy$ = new Subject<void>();

  // Expose EstadoCita enum to template
  EstadoCita = EstadoCita;

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private messageService: MessageService,
    public router: Router
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCitas() {
    this.loading = true;
    this.error = '';

    const currentUser = this.authService.getUser();
    if (!currentUser?.parejaId) {
      this.error = 'No se encontró información de pareja';
      this.loading = false;
      return;
    }

    this.citaService.listarPorPareja(currentUser.parejaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (citas) => {
          this.citas = citas;
          this.convertirCitasAEventos();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las citas';
          this.loading = false;
          console.error('Error cargando citas:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las citas'
          });
        }
      });
  }

  convertirCitasAEventos() {
    this.events = this.citas.map(cita => {
      const fecha = new Date(cita.fecha);
      const colors = this.getEventColors(cita.estado || EstadoCita.PLANIFICADA);

      return {
        id: cita.id,
        title: cita.titulo,
        date: fecha,
        backgroundColor: colors.background,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          cita: cita,
          descripcion: cita.descripcion,
          lugar: cita.lugarNombre,
          estado: cita.estado || EstadoCita.PLANIFICADA
        }
      };
    });
  }

  getEventColors(estado: EstadoCita): { background: string; border: string; text: string } {
    switch (estado) {
      case EstadoCita.PLANIFICADA:
        return {
          background: 'var(--p-blue-100)',
          border: 'var(--p-blue-500)',
          text: 'var(--p-blue-700)'
        };
      case EstadoCita.REALIZADA:
        return {
          background: 'var(--p-green-100)',
          border: 'var(--p-green-500)',
          text: 'var(--p-green-700)'
        };
      case EstadoCita.CANCELADA:
        return {
          background: 'var(--p-red-100)',
          border: 'var(--p-red-500)',
          text: 'var(--p-red-700)'
        };
      default:
        return {
          background: 'var(--p-surface-100)',
          border: 'var(--p-surface-400)',
          text: 'var(--p-text-color)'
        };
    }
  }

  onDateSelect(date: Date) {
    this.selectedDate = date;
    // Navigate to create new cita with selected date
    this.router.navigate(['/citas/nueva'], {
      queryParams: { fecha: date.toISOString() }
    });
  }

  onEventClick(event: CalendarEvent) {
    if (event.id) {
      this.router.navigate(['/citas/detalle', event.id]);
    }
  }

  changeView(view: 'month' | 'week' | 'day') {
    this.calendarView = view;
  }

  goToToday() {
    this.selectedDate = new Date();
  }

  navigateDate(direction: 'prev' | 'next') {
    const currentDate = new Date(this.selectedDate);

    switch (this.calendarView) {
      case 'month':
        if (direction === 'next') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
          currentDate.setMonth(currentDate.getMonth() - 1);
        }
        break;
      case 'week':
        if (direction === 'next') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else {
          currentDate.setDate(currentDate.getDate() - 7);
        }
        break;
      case 'day':
        if (direction === 'next') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        break;
    }

    this.selectedDate = currentDate;
  }

  getEstadoText(estado: EstadoCita): string {
    switch (estado) {
      case EstadoCita.PLANIFICADA: return 'Planificada';
      case EstadoCita.REALIZADA: return 'Realizada';
      case EstadoCita.CANCELADA: return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  getEstadoSeverity(estado: EstadoCita): 'success' | 'info' | 'warning' | 'danger' {
    switch (estado) {
      case EstadoCita.REALIZADA: return 'success';
      case EstadoCita.PLANIFICADA: return 'info';
      case EstadoCita.CANCELADA: return 'danger';
      default: return 'warning';
    }
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByCita(index: number, cita: Cita): number {
    return cita.id || index;
  }

  getCitasDelDia(): Cita[] {
    const selectedDateStr = this.selectedDate.toDateString();
    return this.citas.filter(cita => {
      const citaDate = new Date(cita.fecha).toDateString();
      return citaDate === selectedDateStr;
    });
  }

  getTotalCitas(): number {
    return this.citas.length;
  }

  getCitasPorEstado(estado: EstadoCita): Cita[] {
    return this.citas.filter(cita => (cita.estado || EstadoCita.PLANIFICADA) === estado);
  }

  formatTime(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onCitaClick(cita: Cita): void {
    if (cita.id) {
      this.router.navigate(['/citas/detalle', cita.id]);
    }
  }

  createNewCita(): void {
    this.router.navigate(['/citas/nueva'], {
      queryParams: { fecha: this.selectedDate.toISOString() }
    });
  }

  navigateToAllCitas(): void {
    this.router.navigate(['/citas']);
  }

  getEstadoCssClass(estado?: EstadoCita): string {
    const estadoActual = estado || EstadoCita.PLANIFICADA;
    return `estado-${estadoActual.toLowerCase()}`;
  }
}
