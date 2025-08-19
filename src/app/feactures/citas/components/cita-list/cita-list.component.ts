import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CitaService } from '../../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../../core/models/Interfaces/cita/cita';
import { CitaFilter, LugarOption, CategoriaOption } from '../cita-filter/cita-filter.component';

@Component({
  selector: 'app-cita-list',
  standalone: false,
  templateUrl: './cita-list.component.html',
  styleUrl: './cita-list.component.css'
})
export class CitaListComponent implements OnInit, OnDestroy {
  citas: Cita[] = [];
  loading = false;

  // Filtros
  filtros: CitaFilter = {};

  // Opciones para los filtros
  lugares: LugarOption[] = [];
  categorias: CategoriaOption[] = [];

  // Opciones de filtrado (mantenidas para compatibilidad)
  estadoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Planificada', value: EstadoCita.PLANIFICADA },
    { label: 'Realizada', value: EstadoCita.REALIZADA },
    { label: 'Cancelada', value: EstadoCita.CANCELADA }
  ];

  // Columnas para la tabla
  cols = [
    { field: 'titulo', header: 'Título' },
    { field: 'fecha', header: 'Fecha' },
    { field: 'lugarNombre', header: 'Lugar' },
    { field: 'estado', header: 'Estado' },
    { field: 'rating', header: 'Calificación' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private citaService: CitaService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarCitas();
    this.cargarOpcionesFiltros();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCitas() {
    this.loading = true;
    this.citaService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (citas) => {
          this.citas = citas;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar citas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las citas'
          });
          this.loading = false;
        }
      });
  }

  cargarOpcionesFiltros() {
    // Aquí cargarías las opciones de lugares y categorías desde los servicios
    // Por ahora las dejo como arrays vacíos
    this.lugares = [];
    this.categorias = [];
  }

  // Filtros
  get citasFiltradas(): Cita[] {
    let resultado = this.citas;

    // Aplicar filtros avanzados
    if (this.filtros.titulo?.trim()) {
      const term = this.filtros.titulo.toLowerCase();
      resultado = resultado.filter(cita =>
        cita.titulo.toLowerCase().includes(term) ||
        cita.lugarNombre?.toLowerCase().includes(term) ||
        cita.descripcion?.toLowerCase().includes(term)
      );
    }

    if (this.filtros.estado) {
      resultado = resultado.filter(cita => cita.estado === this.filtros.estado);
    }

    if (this.filtros.fechaInicio) {
      resultado = resultado.filter(cita =>
        new Date(cita.fecha) >= this.filtros.fechaInicio!
      );
    }

    if (this.filtros.fechaFin) {
      resultado = resultado.filter(cita =>
        new Date(cita.fecha) <= this.filtros.fechaFin!
      );
    }

    if (this.filtros.lugarId) {
      resultado = resultado.filter(cita =>
        cita.lugarId === this.filtros.lugarId
      );
    }

    if (this.filtros.categoriaId) {
      resultado = resultado.filter(cita =>
        cita.categoriaId === this.filtros.categoriaId
      );
    }

    if (this.filtros.rating) {
      resultado = resultado.filter(cita =>
        (cita.rating || 0) >= this.filtros.rating!
      );
    }

    return resultado;
  }

  // Métodos para manejar cambios de filtros
  onFilterChange(filtros: CitaFilter) {
    this.filtros = filtros;
  }

  onClearFilters() {
    this.filtros = {};
  }

  // Verificar si hay filtros activos
  get hasActiveFilters(): boolean {
    return !!(
      this.filtros.titulo?.trim() ||
      this.filtros.estado ||
      this.filtros.fechaInicio ||
      this.filtros.fechaFin ||
      this.filtros.lugarId ||
      this.filtros.categoriaId ||
      this.filtros.rating
    );
  }

  // Acciones
  nuevaCita() {
    this.router.navigate(['/app/citas/nueva']);
  }

  verDetalle(cita: Cita) {
    this.router.navigate(['/app/citas', cita.id]);
  }

  editarCita(cita: Cita) {
    this.router.navigate(['/app/citas/editar', cita.id]);
  }

  eliminarCita(cita: Cita) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la cita "${cita.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (cita.id) {
          this.citaService.eliminar(cita.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Cita eliminada correctamente'
                });
                this.cargarCitas();
              },
              error: (error) => {
                console.error('Error al eliminar cita:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo eliminar la cita'
                });
              }
            });
        }
      }
    });
  }

  completarCita(cita: Cita) {
    if (cita.id) {
      this.citaService.completarCita(cita.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cita marcada como realizada'
            });
            this.cargarCitas();
          },
          error: (error) => {
            console.error('Error al completar cita:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo completar la cita'
            });
          }
        });
    }
  }

  cancelarCita(cita: Cita) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de cancelar la cita "${cita.titulo}"?`,
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (cita.id) {
          this.citaService.cancelarCita(cita.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Cita cancelada correctamente'
                });
                this.cargarCitas();
              },
              error: (error) => {
                console.error('Error al cancelar cita:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo cancelar la cita'
                });
              }
            });
        }
      }
    });
  }

  // Utilidades
  getEstadoSeverity(estado?: EstadoCita): 'success' | 'info' | 'danger' | 'warning' {
    switch (estado) {
      case EstadoCita.REALIZADA:
        return 'success';
      case EstadoCita.PLANIFICADA:
        return 'info';
      case EstadoCita.CANCELADA:
        return 'danger';
      default:
        return 'warning';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getRatingStars(rating?: number): string {
    if (!rating) return '';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
