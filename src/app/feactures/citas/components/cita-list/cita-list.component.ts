import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CitaService } from '../../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../../core/models/cita';

@Component({
  selector: 'app-cita-list',
  standalone: false,
  templateUrl: './cita-list.component.html',
  styleUrl: './cita-list.component.css'
})
export class CitaListComponent implements OnInit, OnDestroy {
  citas: Cita[] = [];
  loading = false;
  searchTerm = '';
  selectedEstado = '';

  // Opciones de filtrado
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

  // Filtros
  get citasFiltradas(): Cita[] {
    let resultado = this.citas;

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(cita =>
        cita.titulo.toLowerCase().includes(term) ||
        cita.lugarNombre?.toLowerCase().includes(term) ||
        cita.descripcion?.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.selectedEstado) {
      resultado = resultado.filter(cita => cita.estado === this.selectedEstado);
    }

    return resultado;
  }

  // Acciones
  nuevaCita() {
    this.router.navigate(['/citas/nueva']);
  }

  verDetalle(cita: Cita) {
    this.router.navigate(['/citas', cita.id]);
  }

  editarCita(cita: Cita) {
    this.router.navigate(['/citas/editar', cita.id]);
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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getRatingStars(rating?: number): string {
    if (!rating) return '';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
