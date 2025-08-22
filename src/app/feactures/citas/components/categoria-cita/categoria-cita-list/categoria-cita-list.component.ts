import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Services and Interfaces
import { CategoriaCitaService } from '../../../../../core/services/categoria-cita.service';
import { CategoriaCita } from '../../../../../core/models/Interfaces/cita/CategoriaCita';

@Component({
  selector: 'app-categoria-cita-list',
  standalone: false,
  templateUrl: './categoria-cita-list.component.html',
  styleUrl: './categoria-cita-list.component.css'
})
export class CategoriaCitaListComponent implements OnInit, OnDestroy {

  @Input() showActions = false; // Para mostrar/ocultar botones de acción

  // Data
  categorias: CategoriaCita[] = [];

  // State
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private categoriaCitaService: CategoriaCitaService) { }

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

  // Obtener total de categorías
  getTotalCategorias(): number {
    return this.categorias.length;
  }

  // Obtener categorías activas
  getCategoriasActivas(): number {
    return this.categorias.filter(cat => cat.activo).length;
  }

  // Obtener categorías inactivas
  getCategoriasInactivas(): number {
    return this.categorias.filter(cat => !cat.activo).length;
  }

  // Ver detalle de categoría
  verDetalle(categoria: CategoriaCita): void {
    console.log('Ver detalle de categoría:', categoria);
    // Aquí puedes implementar la lógica para ver detalles
  }

  // Editar categoría
  editarCategoria(categoria: CategoriaCita): void {
    console.log('Editar categoría:', categoria);
    // Aquí puedes implementar la lógica para editar
  }

  // Eliminar categoría
  eliminarCategoria(categoria: CategoriaCita): void {
    console.log('Eliminar categoría:', categoria);
    // Aquí puedes implementar la lógica para eliminar
  }
}
