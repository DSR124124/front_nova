import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { RecordatorioService } from '../../../../core/services/recordatorio.service';
import { Recordatorio, EstadoRecordatorio, TipoRecordatorio } from '../../../../core/models/recordatorio';

@Component({
  selector: 'app-recordatorio-notifications',
  templateUrl: './recordatorio-notifications.component.html',
  styleUrl: './recordatorio-notifications.component.css',
  standalone: false
})
export class RecordatorioNotificationsComponent implements OnInit, OnDestroy {
  // Enum para usar en el template
  EstadoRecordatorio = EstadoRecordatorio;

  recordatorios: Recordatorio[] = [];
  loading = false;
  selectedRecordatorio: Recordatorio | null = null;
  maxNotifications: number = 5;
  drawerVisible: boolean = false;

  // Filtros
  showActivos = true;
  showCompletados = false;
  showCancelados = false;

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
          console.log('✅ Recordatorios cargados:', recordatorios);
          this.recordatorios = recordatorios || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar recordatorios:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las notificaciones'
          });
          this.loading = false;
        }
      });
  }

  getRecordatoriosFiltrados(): Recordatorio[] {
    return this.recordatorios.filter(recordatorio => {
      if (this.showActivos && recordatorio.estado === EstadoRecordatorio.ACTIVO) return true;
      if (this.showCompletados && recordatorio.estado === EstadoRecordatorio.COMPLETADO) return true;
      if (this.showCancelados && recordatorio.estado === EstadoRecordatorio.CANCELADO) return true;
      return false;
    }).slice(0, this.maxNotifications);
  }

  getRecordatoriosPorEstado(estado: EstadoRecordatorio): Recordatorio[] {
    return this.recordatorios.filter(r => r.estado === estado);
  }

  getRecordatoriosProximos(): Recordatorio[] {
    return this.recordatorios.filter(r => this.esRecordatorioProximo(r));
  }

  hayRecordatoriosActivos(): boolean {
    return this.recordatorios.some(r => r.estado === EstadoRecordatorio.ACTIVO);
  }

  marcarTodosComoLeidos() {
    const recordatoriosActivos = this.recordatorios.filter(r => r.estado === EstadoRecordatorio.ACTIVO);
    recordatoriosActivos.forEach(recordatorio => {
      this.cambiarEstado(recordatorio, EstadoRecordatorio.COMPLETADO);
    });
  }

  limpiarFiltros() {
    this.showActivos = true;
    this.showCompletados = false;
    this.showCancelados = false;
  }

  agruparPorFecha(): any[] {
    const grupos: { [key: string]: Recordatorio[] } = {};

    this.getRecordatoriosFiltrados().forEach(recordatorio => {
      const fecha = this.formatearFecha(recordatorio.fechaHora);
      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }
      grupos[fecha].push(recordatorio);
    });

    return Object.keys(grupos).map(fecha => ({
      fecha,
      recordatorios: grupos[fecha].sort((a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
      )
    })).sort((a, b) => {
      const fechaA = new Date(a.recordatorios[0].fechaHora);
      const fechaB = new Date(b.recordatorios[0].fechaHora);
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  cambiarEstado(recordatorio: Recordatorio, nuevoEstado: EstadoRecordatorio) {
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
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el estado'
          });
        }
      });
  }

  posponerRecordatorio(recordatorio: Recordatorio) {
    // Posponer 1 hora
    const nuevaFecha = new Date(recordatorio.fechaHora);
    nuevaFecha.setHours(nuevaFecha.getHours() + 1);

    const recordatorioActualizado = {
      ...recordatorio,
      fechaHora: nuevaFecha.toISOString()
    };

    this.recordatorioService.modificar(recordatorioActualizado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Recordatorio pospuesto 1 hora'
          });
          this.cargarRecordatorios();
        },
        error: (error) => {
          console.error('Error al posponer recordatorio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo posponer el recordatorio'
          });
        }
      });
  }

  esRecordatorioProximo(recordatorio: Recordatorio): boolean {
    const ahora = new Date();
    const fechaRecordatorio = new Date(recordatorio.fechaHora);
    const diferencia = fechaRecordatorio.getTime() - ahora.getTime();
    const dias = diferencia / (1000 * 3600 * 24);
    return dias >= 0 && dias <= 7;
  }

  esRecordatorioVencido(recordatorio: Recordatorio): boolean {
    const ahora = new Date();
    const fechaRecordatorio = new Date(recordatorio.fechaHora);
    return fechaRecordatorio < ahora && recordatorio.estado === EstadoRecordatorio.ACTIVO;
  }

  esRecordatorioUrgente(recordatorio: Recordatorio): boolean {
    const ahora = new Date();
    const fechaRecordatorio = new Date(recordatorio.fechaHora);
    const diferencia = fechaRecordatorio.getTime() - ahora.getTime();
    const horas = diferencia / (1000 * 3600);
    return horas >= 0 && horas <= 24;
  }

  getTipoSeverity(tipo: TipoRecordatorio): string {
    switch (tipo) {
      case TipoRecordatorio.PERSONAL: return 'info';
      case TipoRecordatorio.PAREJA: return 'success';
      case TipoRecordatorio.OTRO: return 'warning';
      default: return 'secondary';
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

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  crearNuevoRecordatorio() {
    this.router.navigate(['/app/recordatorios/nuevo']);
  }

  refreshNotifications() {
    this.cargarRecordatorios();
  }

  viewAllNotifications() {
    this.router.navigate(['/app/recordatorios/notificaciones']);
  }

  formatTimeUntil(date: string): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    const diffHours = Math.ceil(diffMs / (60 * 60 * 1000));

    if (diffDays < 0) return 'Pasado';
    if (diffDays === 0) {
      if (diffHours <= 1) return 'En menos de 1 hora';
      return `En ${diffHours} horas`;
    }
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 7) return `En ${diffDays} días`;
    if (diffDays < 30) return `En ${Math.ceil(diffDays / 7)} semanas`;
    return `En ${Math.ceil(diffDays / 30)} meses`;
  }

  getCategoryLabel(tipo: TipoRecordatorio): string {
    switch (tipo) {
      case TipoRecordatorio.PERSONAL: return 'Personal';
      case TipoRecordatorio.PAREJA: return 'Pareja';
      case TipoRecordatorio.OTRO: return 'Otro';
      default: return 'Recordatorio';
    }
  }

  viewNotificationDetails(recordatorio: Recordatorio) {
    this.router.navigate(['/app/recordatorios/editar', recordatorio.id]);
  }

  trackByRecordatorio(index: number, recordatorio: Recordatorio): number {
    return recordatorio.id || index;
  }
}
