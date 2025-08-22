import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Services and Interfaces
import { CategoriaCitaService } from '../../../../core/services/categoria-cita.service';
import { CategoriaCita } from '../../../../core/models/Interfaces/cita/CategoriaCita';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-categoria-cita',
  standalone: false,
  templateUrl: './categoria-cita.component.html',
  styleUrl: './categoria-cita.component.css'
})
export class CategoriaCitaComponent implements OnInit, OnDestroy {

  // Data
  categorias: CategoriaCita[] = [];
  categoriaSeleccionada: CategoriaCita | null = null;
  categoriaParaEliminar: CategoriaCita | null = null;

  // State
  loading = false;
  showForm = false;
  showDelete = false;
  showFilter = false;
  isEditing = false;

  // View modes
  currentView: 'list' | 'form' | 'delete' | 'filter' = 'list';

  private destroy$ = new Subject<void>();

  constructor(
    private categoriaCitaService: CategoriaCitaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cargar categorías
  cargarCategorias(): void {
    this.loading = true;
    this.categoriaCitaService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.categorias = response.p_data.categorias;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `${response.p_data.total} categorías cargadas`
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.p_menserror || 'Error al cargar categorías'
            });
          }
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión al cargar categorías'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  // === NAVEGACIÓN ENTRE VISTAS ===

  // Mostrar vista de listado
  mostrarListado(): void {
    this.currentView = 'list';
    this.resetState();
  }

  // Mostrar formulario para crear
  mostrarFormularioCrear(): void {
    this.isEditing = false;
    this.categoriaSeleccionada = null;
    this.currentView = 'form';
    this.showForm = true;
  }

  // Mostrar formulario para editar
  mostrarFormularioEditar(categoria: CategoriaCita): void {
    this.isEditing = true;
    this.categoriaSeleccionada = categoria;
    this.currentView = 'form';
    this.showForm = true;
  }

  // Mostrar vista de eliminación
  mostrarEliminacion(categoria: CategoriaCita): void {
    this.categoriaParaEliminar = categoria;
    this.currentView = 'delete';
    this.showDelete = true;
  }

  // Mostrar vista de filtro
  mostrarFiltro(): void {
    this.currentView = 'filter';
    this.showFilter = true;
  }

  // === MANEJO DE FORMULARIOS ===

  // Guardar categoría (llamado desde el subcomponente)
  guardarCategoria(categoria: CategoriaCita): void {
    if (this.isEditing && this.categoriaSeleccionada) {
      // Actualizar
      this.categoriaCitaService.modificar(categoria)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.p_exito) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Categoría actualizada correctamente'
              });
              this.cargarCategorias();
              this.cerrarFormulario();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.p_menserror || 'Error al actualizar categoría'
              });
            }
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error de conexión al actualizar'
            });
          }
        });
    } else {
      // Crear
      this.categoriaCitaService.registrar(categoria)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.p_exito) {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Categoría creada correctamente'
              });
              this.cargarCategorias();
              this.cerrarFormulario();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.p_menserror || 'Error al crear categoría'
              });
            }
          },
          error: (error) => {
            console.error('Error al crear:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error de conexión al crear'
            });
          }
        });
    }
  }

  // === MANEJO DE ELIMINACIÓN ===

  // Eliminación exitosa desde subcomponente
  onDeleteSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Categoría eliminada correctamente'
    });
    this.cargarCategorias();
    this.cerrarEliminacion();
  }

  // Error en eliminación desde subcomponente
  onDeleteError(error: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error
    });
  }

  // === MANEJO DE BÚSQUEDA ===

  // Resultado de búsqueda desde subcomponente
  onSearchResult(categoria: CategoriaCita | null): void {
    if (categoria) {
      this.messageService.add({
        severity: 'info',
        summary: 'Búsqueda',
        detail: `Categoría encontrada: ${categoria.nombre}`
      });
      // Aquí podrías navegar a la vista de edición o mostrar detalles
    }
  }

  // Error en búsqueda desde subcomponente
  onSearchError(error: string): void {
    if (error) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Búsqueda',
        detail: error
      });
    }
  }

  // === MANEJO DE ESTADOS ===

  // Cambiar estado activo/inactivo
  cambiarEstado(categoria: CategoriaCita): void {
    const nuevaCategoria: CategoriaCita = {
      ...categoria,
      activo: !categoria.activo
    };

    this.categoriaCitaService.modificar(nuevaCategoria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Categoría ${nuevaCategoria.activo ? 'activada' : 'desactivada'} correctamente`
            });
            this.cargarCategorias();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.p_menserror || 'Error al cambiar estado'
            });
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión al cambiar estado'
          });
        }
      });
  }

  // === CERRAR VISTAS ===

  // Cerrar formulario
  cerrarFormulario(): void {
    this.showForm = false;
    this.categoriaSeleccionada = null;
    this.isEditing = false;
    this.currentView = 'list';
  }

  // Cerrar eliminación
  cerrarEliminacion(): void {
    this.showDelete = false;
    this.categoriaParaEliminar = null;
    this.currentView = 'list';
  }

  // Cerrar filtro
  cerrarFiltro(): void {
    this.showFilter = false;
    this.currentView = 'list';
  }

  // === UTILIDADES ===

  // Resetear estado
  resetState(): void {
    this.showForm = false;
    this.showDelete = false;
    this.showFilter = false;
    this.categoriaSeleccionada = null;
    this.categoriaParaEliminar = null;
    this.isEditing = false;
  }

  // Obtener icono para mostrar
  getIconClass(iconValue: string): string {
    return iconValue || 'pi pi-heart';
  }

  // Obtener color de fondo para el tag
  getTagSeverity(activo: boolean): string {
    return activo ? 'success' : 'danger';
  }

  // Obtener texto del tag
  getTagText(activo: boolean): string {
    return activo ? 'Activa' : 'Inactiva';
  }

  // Verificar si estamos en vista de listado
  isListView(): boolean {
    return this.currentView === 'list';
  }

  // Verificar si estamos en vista de formulario
  isFormView(): boolean {
    return this.currentView === 'form';
  }

  // Verificar si estamos en vista de eliminación
  isDeleteView(): boolean {
    return this.currentView === 'delete';
  }

  // Verificar si estamos en vista de filtro
  isFilterView(): boolean {
    return this.currentView === 'filter';
  }
}
