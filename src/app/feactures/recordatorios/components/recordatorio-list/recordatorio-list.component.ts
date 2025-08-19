import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RecordatorioService } from '../../../../core/services/recordatorio.service';
import { Recordatorio } from '../../../../core/models/Interfaces/recordatorio/recordatorio';
import { TipoRecordatorio } from '../../../../core/models/enums/tipo-recordatorio.enum';
import { EstadoRecordatorio } from '../../../../core/models/enums/estado-recordatorio.enum';
import { FrecuenciaRecordatorio } from '../../../../core/models/enums/frecuencia-recordatorio.enum';

@Component({
  selector: 'app-recordatorio-list',
  standalone: false,
  templateUrl: './recordatorio-list.component.html',
  styleUrl: './recordatorio-list.component.css'
})
export class RecordatorioListComponent implements OnInit, OnDestroy {
  // Enums para usar en el template
  TipoRecordatorio = TipoRecordatorio;
  EstadoRecordatorio = EstadoRecordatorio;
  FrecuenciaRecordatorio = FrecuenciaRecordatorio;

  recordatorios: Recordatorio[] = [];
  recordatoriosFiltrados: Recordatorio[] = [];
  loading = false;

  // Filtros
  searchTerm = '';
  selectedTipo = '';
  selectedEstado = '';
  selectedFrecuencia = '';

  // Vista
  viewMode: 'list' | 'gallery' = 'list';

  // Opciones de filtro
  tipoOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Personal', value: TipoRecordatorio.PERSONAL },
    { label: 'Pareja', value: TipoRecordatorio.PAREJA },
    { label: 'Otro', value: TipoRecordatorio.OTRO }
  ];

  estadoOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Activo', value: EstadoRecordatorio.ACTIVO },
    { label: 'Completado', value: EstadoRecordatorio.COMPLETADO },
    { label: 'Cancelado', value: EstadoRecordatorio.CANCELADO }
  ];

  frecuenciaOptions = [
    { label: 'Todas las frecuencias', value: '' },
    { label: 'Sin repetición', value: FrecuenciaRecordatorio.NINGUNA },
    { label: 'Diaria', value: FrecuenciaRecordatorio.DIARIA },
    { label: 'Semanal', value: FrecuenciaRecordatorio.SEMANAL },
    { label: 'Mensual', value: FrecuenciaRecordatorio.MENSUAL },
    { label: 'Anual', value: FrecuenciaRecordatorio.ANUAL }
  ];

  // Paginación
  first = 0;
  rows = 10;

  // Columnas de la tabla
  cols = [
    { field: 'titulo', header: 'Título' },
    { field: 'tipo', header: 'Tipo' },
    { field: 'fechaHora', header: 'Fecha & Hora' },
    { field: 'lugarNombre', header: 'Lugar' },
    { field: 'estado', header: 'Estado' },
    { field: 'frecuencia', header: 'Frecuencia' },
    { field: 'acciones', header: 'Acciones' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private recordatorioService: RecordatorioService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
          this.recordatorios = recordatorios;
          this.recordatoriosFiltrados = [...recordatorios];
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

  aplicarFiltros() {
    this.recordatoriosFiltrados = this.recordatorios.filter(recordatorio => {
      const cumpleBusqueda = !this.searchTerm ||
        recordatorio.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (recordatorio.descripcion && recordatorio.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const cumpleTipo = !this.selectedTipo || recordatorio.tipo === this.selectedTipo;
      const cumpleEstado = !this.selectedEstado || recordatorio.estado === this.selectedEstado;
      const cumpleFrecuencia = !this.selectedFrecuencia || recordatorio.frecuencia === this.selectedFrecuencia;

      return cumpleBusqueda && cumpleTipo && cumpleEstado && cumpleFrecuencia;
    });
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.selectedTipo = '';
    this.selectedEstado = '';
    this.selectedFrecuencia = '';
    this.recordatoriosFiltrados = [...this.recordatorios];
  }

  nuevoRecordatorio() {
    this.router.navigate(['/app/recordatorios/nuevo']);
  }

  editarRecordatorio(recordatorio: Recordatorio) {
    this.router.navigate(['/app/recordatorios/editar', recordatorio.id]);
  }

  eliminarRecordatorio(recordatorio: Recordatorio) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el recordatorio "${recordatorio.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.recordatorioService.eliminar(recordatorio.id!)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Recordatorio eliminado correctamente'
              });
              this.cargarRecordatorios();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el recordatorio'
              });
            }
          });
      }
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el estado'
          });
        }
      });
  }

  cambiarVista() {
    this.viewMode = this.viewMode === 'list' ? 'gallery' : 'list';
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  getTipoColor(tipo: TipoRecordatorio): string {
    switch (tipo) {
      case TipoRecordatorio.PERSONAL: return 'info';
      case TipoRecordatorio.PAREJA: return 'success';
      case TipoRecordatorio.OTRO: return 'warning';
      default: return 'secondary';
    }
  }

  getTipoIcono(tipo: TipoRecordatorio): string {
    switch (tipo) {
      case TipoRecordatorio.PERSONAL: return 'pi pi-user';
      case TipoRecordatorio.PAREJA: return 'pi pi-heart';
      case TipoRecordatorio.OTRO: return 'pi pi-bell';
      default: return 'pi pi-bell';
    }
  }

  getEstadoSeverity(estado: EstadoRecordatorio | undefined): string {
    if (!estado) return 'secondary';
    switch (estado) {
      case EstadoRecordatorio.ACTIVO: return 'success';
      case EstadoRecordatorio.COMPLETADO: return 'info';
      case EstadoRecordatorio.CANCELADO: return 'danger';
      default: return 'secondary';
    }
  }

  getFrecuenciaSeverity(frecuencia: FrecuenciaRecordatorio | undefined): string {
    if (!frecuencia) return 'secondary';
    switch (frecuencia) {
      case FrecuenciaRecordatorio.NINGUNA: return 'secondary';
      case FrecuenciaRecordatorio.DIARIA: return 'danger';
      case FrecuenciaRecordatorio.SEMANAL: return 'warning';
      case FrecuenciaRecordatorio.MENSUAL: return 'info';
      case FrecuenciaRecordatorio.ANUAL: return 'success';
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

  trackByRecordatorio(index: number, recordatorio: Recordatorio): number {
    return recordatorio.id || index;
  }
}
