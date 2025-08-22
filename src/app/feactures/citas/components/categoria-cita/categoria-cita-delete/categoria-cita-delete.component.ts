import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Services and Interfaces
import { CategoriaCitaService } from '../../../../../core/services/categoria-cita.service';
import { CategoriaCita } from '../../../../../core/models/Interfaces/cita/CategoriaCita';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-categoria-cita-delete',
  standalone: false,
  templateUrl: './categoria-cita-delete.component.html',
  styleUrl: './categoria-cita-delete.component.css'
})
export class CategoriaCitaDeleteComponent implements OnInit, OnDestroy {

  @Input() categoria: CategoriaCita | null = null;
  @Input() visible = false;

  @Output() deleteSuccess = new EventEmitter<void>();
  @Output() deleteError = new EventEmitter<string>();
  @Output() visibleChange = new EventEmitter<boolean>();

  // State
  loading = false;
  deleting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private categoriaCitaService: CategoriaCitaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    // No hay inicialización especial necesaria
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Mostrar diálogo de confirmación
  confirmarEliminacion(): void {
    if (!this.categoria) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay categoría seleccionada para eliminar'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la categoría "${this.categoria.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined p-button-secondary',
      accept: () => {
        this.eliminarCategoria();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Operación de eliminación cancelada'
        });
      }
    });
  }

  // Eliminar categoría
  eliminarCategoria(): void {
    if (!this.categoria?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de categoría no válido'
      });
      return;
    }

    this.deleting = true;
    this.loading = true;

    this.categoriaCitaService.eliminar(this.categoria.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Categoría "${this.categoria?.nombre}" eliminada correctamente`
            });
            this.deleteSuccess.emit();
            this.cerrarDialogo();
          } else {
            const errorMsg = response.p_menserror || 'Error al eliminar la categoría';
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMsg
            });
            this.deleteError.emit(errorMsg);
          }
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          const errorMsg = 'Error de conexión al eliminar la categoría';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg
          });
          this.deleteError.emit(errorMsg);
        },
        complete: () => {
          this.loading = false;
          this.deleting = false;
        }
      });
  }

  // Cerrar diálogo
  cerrarDialogo(): void {
    this.visibleChange.emit(false);
  }

  // Verificar si se puede eliminar
  puedeEliminar(): boolean {
    return !!(this.categoria && this.categoria.id && !this.loading);
  }

  // Obtener texto del botón de eliminación
  getDeleteButtonText(): string {
    return this.deleting ? 'Eliminando...' : 'Eliminar Categoría';
  }

  // Obtener icono del botón de eliminación
  getDeleteButtonIcon(): string {
    return this.deleting ? 'pi pi-spinner pi-spin' : 'pi pi-trash';
  }

  // Obtener información de la categoría
  getCategoriaInfo(): string {
    if (!this.categoria) return '';

    return `${this.categoria.nombre} (ID: ${this.categoria.id})`;
  }

  // Obtener detalles de la categoría
  getCategoriaDetails(): string {
    if (!this.categoria) return '';

    const details = [];
    if (this.categoria.descripcion) details.push(this.categoria.descripcion);
    if (this.categoria.orden) details.push(`Orden: ${this.categoria.orden}`);
    if (this.categoria.activo !== undefined) {
      details.push(`Estado: ${this.categoria.activo ? 'Activa' : 'Inactiva'}`);
    }

    return details.join(' • ');
  }

  // Verificar si hay datos de categoría
  hasCategoriaData(): boolean {
    return !!(this.categoria && this.categoria.id);
  }
}
