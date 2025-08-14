import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { RecordatorioService } from '../../../../core/services/recordatorio.service';
import { Recordatorio, EstadoRecordatorio, TipoRecordatorio } from '../../../../core/models/recordatorio';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: TipoRecordatorio;
  status: EstadoRecordatorio;
  description?: string;
  location?: string;
  urgent: boolean;
  color: string;
}

interface DayInfo {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  events: CalendarEvent[];
}

interface WeekDayInfo {
  date: Date;
  name: string;
  dayNumber: number;
  isToday: boolean;
}

@Component({
  selector: 'app-recordatorio-calendar',
  standalone: false,
  templateUrl: './recordatorio-calendar.component.html',
  styleUrl: './recordatorio-calendar.component.css'
})
export class RecordatorioCalendarComponent implements OnInit, OnDestroy {
  // Enums para usar en el template
  EstadoRecordatorio = EstadoRecordatorio;
  TipoRecordatorio = TipoRecordatorio;

  // Calendario
  events: CalendarEvent[] = [];
  loading = false;
  selectedDate: Date = new Date();
  view: 'month' | 'week' | 'day' = 'month';
  firstDayOfWeek = 1; // Lunes

  // Días de la semana
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Modal de detalles
  selectedEvent: CalendarEvent | null = null;
  eventModalVisible = false;

  private destroy$ = new Subject<void>();

  constructor(
    private recordatorioService: RecordatorioService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarRecordatorios();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarRecordatorios() {
    this.loading = true;

    this.recordatorioService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recordatorios) => {
          this.events = this.convertirRecordatoriosAEventos(recordatorios || []);
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los recordatorios'
          });
          this.loading = false;
        }
      });
  }

  private convertirRecordatoriosAEventos(recordatorios: Recordatorio[]): CalendarEvent[] {
    return recordatorios.map(r => ({
      id: r.id || 0,
      title: r.titulo,
      date: new Date(r.fechaHora),
      type: r.tipo,
      status: r.estado || EstadoRecordatorio.ACTIVO,
      description: r.descripcion,
      location: r.lugarNombre,
      urgent: this.esRecordatorioUrgente(r),
      color: this.getEventColor(r.tipo, r.estado || EstadoRecordatorio.ACTIVO)
    }));
  }

  private getEventColor(tipo: TipoRecordatorio, estado: EstadoRecordatorio): string {
    if (estado === EstadoRecordatorio.COMPLETADO) return '#495057';
    if (estado === EstadoRecordatorio.CANCELADO) return '#6c757d';

    switch (tipo) {
      case TipoRecordatorio.PERSONAL: return '#0d6efd';
      case TipoRecordatorio.PAREJA: return '#dc3545';
      case TipoRecordatorio.OTRO: return '#fd7e14';
      default: return '#6c757d';
    }
  }

  private esRecordatorioUrgente(recordatorio: Recordatorio): boolean {
    const ahora = new Date();
    const fechaRecordatorio = new Date(recordatorio.fechaHora);
    const diferencia = fechaRecordatorio.getTime() - ahora.getTime();
    const horas = diferencia / (1000 * 3600);
    return horas >= 0 && horas <= 24;
  }

  onDateSelect(event: any) {
    this.selectedDate = event;
  }

  onEventSelect(event: CalendarEvent) {
    this.selectedEvent = event;
    this.eventModalVisible = true;
  }

  onViewChange(event: any) {
    this.view = event;
  }

  cambiarEstado(event: CalendarEvent, nuevoEstado: EstadoRecordatorio) {
    // Buscar el recordatorio original
    this.recordatorioService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recordatorios) => {
          const recordatorio = recordatorios?.find(r => r.id === event.id);
          if (recordatorio) {
            const recordatorioActualizado = { ...recordatorio, estado: nuevoEstado };
            this.recordatorioService.modificar(recordatorioActualizado)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Estado del recordatorio actualizado'
                  });
                  this.cargarRecordatorios();
                  this.eventModalVisible = false;
                },
                error: (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el estado'
                  });
                }
              });
          }
        }
      });
  }

  editarRecordatorio(event: CalendarEvent) {
    this.router.navigate(['/app/recordatorios/editar', event.id]);
    this.eventModalVisible = false;
  }

  crearNuevoRecordatorio() {
    this.router.navigate(['/app/recordatorios/nuevo']);
  }

  getTipoLabel(tipo: TipoRecordatorio): string {
    switch (tipo) {
      case TipoRecordatorio.PERSONAL: return 'Personal';
      case TipoRecordatorio.PAREJA: return 'Pareja';
      case TipoRecordatorio.OTRO: return 'Otro';
      default: return 'Recordatorio';
    }
  }

  getEstadoLabel(estado: EstadoRecordatorio): string {
    switch (estado) {
      case EstadoRecordatorio.ACTIVO: return 'Activo';
      case EstadoRecordatorio.COMPLETADO: return 'Completado';
      case EstadoRecordatorio.CANCELADO: return 'Cancelado';
      default: return 'Desconocido';
    }
  }

  getEstadoSeverity(estado: EstadoRecordatorio): string {
    switch (estado) {
      case EstadoRecordatorio.ACTIVO: return 'success';
      case EstadoRecordatorio.COMPLETADO: return 'info';
      case EstadoRecordatorio.CANCELADO: return 'danger';
      default: return 'secondary';
    }
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refreshCalendar() {
    this.cargarRecordatorios();
  }

  navegarDiaAnterior() {
    this.selectedDate = new Date(this.selectedDate.getTime() - 24 * 60 * 60 * 1000);
  }

  navegarDiaSiguiente() {
    this.selectedDate = new Date(this.selectedDate.getTime() + 24 * 60 * 60 * 1000);
  }

  getRecordatoriosDelDia(fecha?: Date): CalendarEvent[] {
    const fechaSeleccionada = fecha || this.selectedDate;
    const inicioDia = new Date(fechaSeleccionada);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fechaSeleccionada);
    finDia.setHours(23, 59, 59, 999);

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= inicioDia && eventDate <= finDia;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Métodos para Google Calendar-like views
  getDaysInMonth(): DayInfo[] {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: DayInfo[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isSameDay(date, currentDate);
      const dayEvents = this.getRecordatoriosDelDia(date);
      const hasEvents = dayEvents.length > 0;

      days.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday,
        hasEvents,
        events: dayEvents
      });
    }

    return days;
  }

  getWeekDays(): WeekDayInfo[] {
    const weekDays: WeekDayInfo[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.selectedDate);
      date.setDate(this.selectedDate.getDate() - this.selectedDate.getDay() + i);

      const isToday = this.isSameDay(date, currentDate);

      weekDays.push({
        date,
        dayNumber: date.getDate(),
        name: this.weekDays[i],
        isToday
      });
    }

    return weekDays;
  }

  getDayHours(): number[] {
    return Array.from({length: 24}, (_, i) => i);
  }

  getRecordatoriosPorHora(hour: number): CalendarEvent[] {
    return this.events.filter(event => {
      const eventHour = new Date(event.date).getHours();
      return eventHour === hour && this.isSameDay(new Date(event.date), this.selectedDate);
    });
  }

  isCurrentHour(hour: number): boolean {
    const now = new Date();
    return now.getHours() === hour && this.isSameDay(now, this.selectedDate);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  getRecordatoriosPorDia(): { date: Date; count: number }[] {
    const recordatoriosPorDia = new Map<string, number>();

    this.events.forEach(event => {
      const fecha = new Date(event.date);
      const fechaKey = fecha.toDateString();
      recordatoriosPorDia.set(fechaKey, (recordatoriosPorDia.get(fechaKey) || 0) + 1);
    });

    return Array.from(recordatoriosPorDia.entries()).map(([fechaKey, count]) => ({
      date: new Date(fechaKey),
      count
    }));
  }

  getDayPosition(date: Date): number {
    const dayOfWeek = date.getDay();
    const adjustedDay = (dayOfWeek + 6) % 7;
    return (adjustedDay * 100) / 7 + 7;
  }

  getDayTopPosition(date: Date): number {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = startOfMonth.getDay();
    const adjustedFirstDay = (firstDayOfWeek + 6) % 7;

    const weekOfMonth = Math.floor((date.getDate() + adjustedFirstDay - 1) / 7);
    return (weekOfMonth * 100) / 6 + 10;
  }
}
