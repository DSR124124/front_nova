import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CitaService } from '../../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../../core/models/Interfaces/cita/cita';

@Component({
  selector: 'app-cita-detail',
  standalone: false,
  templateUrl: './cita-detail.component.html',
  styleUrl: './cita-detail.component.css'
})
export class CitaDetailComponent implements OnInit, OnDestroy {
  cita: Cita | null = null;
  loading = true;
  error = '';
  citaId: number = 0;
  showRatingDialog = false;
  rating = 0;
  ratingComment = '';

  // Expose enum to template
  EstadoCita = EstadoCita;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.citaId = +params['id'];
        if (this.citaId) {
          this.cargarCita();
        } else {
          this.error = 'ID de cita no válido';
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCita() {
    this.loading = true;
    this.error = '';

    this.citaService.listarPorId(this.citaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cita) => {
          this.cita = cita;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles de la cita';
          this.loading = false;
          console.error('Error cargando cita:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los detalles de la cita'
          });
        }
      });
  }

  editarCita() {
    if (this.cita?.id) {
      this.router.navigate(['/app/citas/editar', this.cita.id]);
    }
  }

  eliminarCita() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta cita?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (this.cita?.id) {
          this.citaService.eliminar(this.cita.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Cita eliminada correctamente'
                });
                this.router.navigate(['/app/citas']);
              },
              error: (err) => {
                console.error('Error eliminando cita:', err);
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

  completarCita() {
    if (this.cita?.id) {
      this.citaService.completarCita(this.cita.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cita marcada como completada'
            });
            this.cargarCita(); // Recargar para ver el estado actualizado
          },
          error: (err) => {
            console.error('Error completando cita:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo completar la cita'
            });
          }
        });
    }
  }

  cancelarCita() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas cancelar esta cita?',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No cancelar',
      accept: () => {
        if (this.cita?.id) {
          this.citaService.cancelarCita(this.cita.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Cita Cancelada',
                  detail: 'La cita ha sido cancelada'
                });
                this.cargarCita(); // Recargar para ver el estado actualizado
              },
              error: (err) => {
                console.error('Error cancelando cita:', err);
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

  mostrarDialogoRating() {
    this.showRatingDialog = true;
    this.rating = this.cita?.rating || 0;
  }

  calificarCita() {
    if (this.cita?.id && this.rating > 0) {
      this.citaService.calificarCita(this.cita.id, this.rating)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Calificación guardada correctamente'
            });
            this.showRatingDialog = false;
            this.cargarCita(); // Recargar para ver la calificación actualizada
          },
          error: (err) => {
            console.error('Error calificando cita:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo guardar la calificación'
            });
          }
        });
    }
  }

  volver() {
    this.router.navigate(['/app/citas']);
  }

  getEstadoText(estado?: EstadoCita): string {
    switch (estado) {
      case EstadoCita.PLANIFICADA: return 'Planificada';
      case EstadoCita.REALIZADA: return 'Realizada';
      case EstadoCita.CANCELADA: return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  getEstadoSeverity(estado?: EstadoCita): 'success' | 'info' | 'warning' | 'danger' {
    switch (estado) {
      case EstadoCita.REALIZADA: return 'success';
      case EstadoCita.PLANIFICADA: return 'info';
      case EstadoCita.CANCELADA: return 'danger';
      default: return 'warning';
    }
  }

  getEstadoCssClass(estado?: EstadoCita): string {
    const estadoActual = estado || EstadoCita.PLANIFICADA;
    return `estado-${estadoActual.toLowerCase()}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  puedeEditar(): boolean {
    return this.cita?.estado === EstadoCita.PLANIFICADA;
  }

  puedeCompletar(): boolean {
    return this.cita?.estado === EstadoCita.PLANIFICADA;
  }

  puedeCancelar(): boolean {
    return this.cita?.estado === EstadoCita.PLANIFICADA;
  }

  puedeCalificar(): boolean {
    return this.cita?.estado === EstadoCita.REALIZADA;
  }

  cerrarDialogoRating() {
    this.showRatingDialog = false;
  }
}
