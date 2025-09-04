import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Services and Interfaces
import { CategoriaCitaService } from '../../../../core/services/categoria-cita.service';
import { MessageInfoService } from '../../../../core/services/message-info.service';
import { CategoriaCita } from '../../../../core/models/Interfaces/cita/CategoriaCita';
import { ConfirmationService } from 'primeng/api';

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
  isViewing = false;

  // View modes
  currentView: 'list' | 'form' | 'delete' | 'filter' = 'list';

  private destroy$ = new Subject<void>();

  constructor(
    private categoriaCitaService: CategoriaCitaService,
    private messageInfoService: MessageInfoService,
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
          if (this.messageInfoService.handleBackendResponse(response)) {
            this.categorias = response.p_data.categorias;
          }
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
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
    this.isViewing = false;
    this.categoriaSeleccionada = null;
    this.currentView = 'form';
    this.showForm = true;
  }

  // Mostrar formulario para editar
  mostrarFormularioEditar(categoria: CategoriaCita): void {
    this.isEditing = true;
    this.isViewing = false;
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
            if (this.messageInfoService.handleBackendResponse(response)) {
              this.cargarCategorias();
              this.cerrarFormulario();
            }
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
          }
        });
    } else {
      // Crear
      this.categoriaCitaService.registrar(categoria)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (this.messageInfoService.handleBackendResponse(response)) {
              this.cargarCategorias();
              this.cerrarFormulario();
            }
          },
          error: (error) => {
            console.error('Error al crear:', error);
          }
        });
    }
  }

  // === MANEJO DE ELIMINACIÓN ===

  // Eliminación exitosa desde subcomponente
  onDeleteSuccess(): void {
    this.messageInfoService.showSuccess('Categoría eliminada correctamente');
    this.cargarCategorias();
    this.cerrarEliminacion();
  }

  // Error en eliminación desde subcomponente
  onDeleteError(error: string): void {
    this.messageInfoService.showError(error);
  }

  // === MANEJO DE BÚSQUEDA ===

  // Resultado de búsqueda desde subcomponente
  onSearchResult(categoria: CategoriaCita | null): void {
    if (categoria) {
      this.messageInfoService.showInfo(`Mostrando detalles de "${categoria.nombre}"`, 'Detalle de Categoría');
      // Aquí podrías navegar a la vista de edición o mostrar detalles
    }
  }

  // Error en búsqueda desde subcomponente
  onSearchError(error: string): void {
    if (error) {
      this.messageInfoService.showWarning(error, 'Búsqueda');
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
            this.messageInfoService.showSuccess(`Categoría ${nuevaCategoria.activo ? 'activada' : 'desactivada'} correctamente`);
            this.cargarCategorias();
          } else {
            this.messageInfoService.showError(response.p_menserror || 'Error al cambiar estado');
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.messageInfoService.showError('Error de conexión al cambiar estado');
        }
      });
  }

  // === CERRAR VISTAS ===

  // Cerrar formulario
  cerrarFormulario(): void {
    this.showForm = false;
    this.categoriaSeleccionada = null;
    this.isEditing = false;
    this.isViewing = false;
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
    this.isViewing = false;
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

  // Ver detalle de categoría (nuevo método)
  verDetalleCategoria(categoria: CategoriaCita): void {
    // Establecer la categoría seleccionada y cambiar a vista de formulario para mostrar detalles
    this.categoriaSeleccionada = categoria;
    this.isViewing = true;
    this.isEditing = false;
    this.currentView = 'form';
  }

}
