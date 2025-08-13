import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LugarService } from '../../../../core/services/lugar.service';
import { Lugar, CategoriaLugar } from '../../../../core/models/lugar';

@Component({
  selector: 'app-lugar-list',
  standalone: false,
  templateUrl: './lugar-list.component.html',
  styleUrl: './lugar-list.component.css',
  providers: [ConfirmationService, MessageService]
})
export class LugarListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  lugares: Lugar[] = [];
  lugaresFiltrados: Lugar[] = [];
  loading = false;

  // Pagination
  first = 0;
  rows = 12;
  totalRecords = 0;

  // Filters
  searchTerm = '';
  selectedCategoria: string = '';
  selectedPrecio: string = '';
  selectedRating: number | null = null;

  // Sort
  sortField = 'nombre';
  sortOrder = 1;

  // View options
  viewMode: 'list' | 'gallery' = 'list';

  // Options for filters
  categoriaOptions = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Restaurante', value: CategoriaLugar.RESTAURANTE },
    { label: 'Parque', value: CategoriaLugar.PARQUE },
    { label: 'Cine', value: CategoriaLugar.CINE },
    { label: 'Entretenimiento', value: CategoriaLugar.ENTRETENIMIENTO },
    { label: 'Casa', value: CategoriaLugar.CASA },
    { label: 'Otro', value: CategoriaLugar.OTRO }
  ];

  precioOptions = [
    { label: 'Todos los precios', value: '' },
    { label: 'Gratis', value: 'GRATIS' },
    { label: 'Económico', value: 'ECONOMICO' },
    { label: 'Moderado', value: 'MODERADO' },
    { label: 'Alto', value: 'ALTO' },
    { label: 'Premium', value: 'PREMIUM' }
  ];

  ratingOptions = [
    { label: 'Todas las calificaciones', value: null },
    { label: '5 estrellas', value: 5 },
    { label: '4+ estrellas', value: 4 },
    { label: '3+ estrellas', value: 3 },
    { label: '2+ estrellas', value: 2 },
    { label: '1+ estrella', value: 1 }
  ];

  constructor(
    private lugarService: LugarService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarLugares();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarLugares(): void {
    this.loading = true;
    this.lugarService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          this.lugares = lugares;
          this.aplicarFiltros();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar lugares:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los lugares'
          });
          this.loading = false;
        }
      });
  }

  // Filter methods
  onSearchChange(): void {
    this.first = 0;
    this.aplicarFiltros();
  }

  onCategoriaChange(): void {
    this.first = 0;
    this.aplicarFiltros();
  }

  onPrecioChange(): void {
    this.first = 0;
    this.aplicarFiltros();
  }

  onRatingChange(): void {
    this.first = 0;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let lugaresFiltrados = [...this.lugares];

    // Filter by category
    if (this.selectedCategoria) {
      lugaresFiltrados = lugaresFiltrados.filter(l => l.categoria === this.selectedCategoria);
    }

    // Filter by price
    if (this.selectedPrecio) {
      lugaresFiltrados = lugaresFiltrados.filter(l => l.precio === this.selectedPrecio);
    }

    // Filter by rating
    if (this.selectedRating !== null) {
      lugaresFiltrados = lugaresFiltrados.filter(l => (l.rating || 0) >= this.selectedRating!);
    }

    // Filter by search term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      lugaresFiltrados = lugaresFiltrados.filter(l =>
        l.nombre.toLowerCase().includes(term) ||
        l.direccion?.toLowerCase().includes(term) ||
        l.descripcion?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    lugaresFiltrados.sort((a, b) => {
      let aValue = a[this.sortField as keyof Lugar];
      let bValue = b[this.sortField as keyof Lugar];

      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      if (aValue < bValue) return -1 * this.sortOrder;
      if (aValue > bValue) return 1 * this.sortOrder;
      return 0;
    });

    this.lugaresFiltrados = lugaresFiltrados;
    this.totalRecords = lugaresFiltrados.length;
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.selectedCategoria = '';
    this.selectedPrecio = '';
    this.selectedRating = null;
    this.first = 0;
    this.aplicarFiltros();
  }

  // Sort methods
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.aplicarFiltros();
  }

  // Pagination
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  // View mode toggle
  cambiarVista(mode: 'list' | 'gallery'): void {
    this.viewMode = mode;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'gallery' ? 'list' : 'gallery';
  }

  // OrderList reorder method
  onReorder(event: any): void {
    // Aquí puedes implementar la lógica para guardar el nuevo orden
    console.log('Lugares reordenados:', event.value);
    this.lugaresFiltrados = event.value;
  }

  // Actions
  verDetalle(lugar: Lugar): void {
    if (lugar.id) {
      this.router.navigate(['/app/lugares/detalle', lugar.id]);
    }
  }

  editarLugar(lugar: Lugar): void {
    if (lugar.id) {
      this.router.navigate(['/app/lugares/editar', lugar.id]);
    }
  }

  eliminarLugar(lugar: Lugar): void {
    if (!lugar.id) return;

    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar "${lugar.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.lugarService.eliminar(lugar.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Lugar eliminado correctamente'
            });
            this.cargarLugares();
          },
          error: (error) => {
            console.error('Error al eliminar lugar:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el lugar'
            });
          }
        });
      }
    });
  }

  toggleFavorito(lugar: Lugar): void {
    lugar.esFavorito = !lugar.esFavorito;

    if (lugar.id) {
      this.lugarService.updateLugar(lugar.id, lugar).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Favorito',
            detail: lugar.esFavorito ? 'Agregado a favoritos' : 'Removido de favoritos'
          });
        },
        error: (error) => {
          console.error('Error al actualizar favorito:', error);
          // Revert change on error
          lugar.esFavorito = !lugar.esFavorito;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el favorito'
          });
        }
      });
    }
  }

  agregarLugar(): void {
    this.router.navigate(['/app/lugares/crear']);
  }

  // Utility methods
  trackByLugar(index: number, lugar: Lugar): number {
    return lugar.id || index;
  }

  // Computed properties for statistics
  get totalFavoritos(): number {
    return this.lugares.filter(l => l.esFavorito).length;
  }

  get totalAltamenteCalificados(): number {
    return this.lugares.filter(l => l.rating && l.rating >= 4).length;
  }

  // Actions menu
  showActionsMenu(event: Event, lugar: Lugar): void {
    // This method can be expanded to show a context menu
    // For now, we'll just prevent the default event
    event.preventDefault();
    event.stopPropagation();
  }

  getIconClass(categoria?: CategoriaLugar): string {
    switch (categoria) {
      case CategoriaLugar.RESTAURANTE:
        return 'pi-utensils';
      case CategoriaLugar.PARQUE:
        return 'pi-tree';
      case CategoriaLugar.CINE:
        return 'pi-video';
      case CategoriaLugar.ENTRETENIMIENTO:
        return 'pi-gamepad';
      case CategoriaLugar.CASA:
        return 'pi-home';
      default:
        return 'pi-map-marker';
    }
  }

  getPrecioColor(precio?: string): string {
    switch (precio) {
      case 'GRATIS':
        return 'success';
      case 'ECONOMICO':
        return 'info';
      case 'MODERADO':
        return 'warning';
      case 'ALTO':
        return 'danger';
      case 'PREMIUM':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getEstadoCssClass(estado?: string): string {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      case 'pendiente':
        return 'warning';
      default:
        return 'info';
    }
  }
}
