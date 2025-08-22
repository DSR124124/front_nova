import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Services and Interfaces
import { CategoriaCitaService } from '../../../../../core/services/categoria-cita.service';
import { CategoriaCita } from '../../../../../core/models/Interfaces/cita/CategoriaCita';

@Component({
  selector: 'app-categoria-cita-filter',
  standalone: false,
  templateUrl: './categoria-cita-filter.component.html',
  styleUrl: './categoria-cita-filter.component.css'
})
export class CategoriaCitaFilterComponent implements OnInit, OnDestroy {

  @Output() searchResult = new EventEmitter<CategoriaCita | null>();
  @Output() searchError = new EventEmitter<string>();

  // Form
  searchForm: FormGroup;

  // State
  loading = false;
  searching = false;
  lastSearchId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private categoriaCitaService: CategoriaCitaService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      id: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    // No hay inicialización especial necesaria
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Buscar categoría por ID
  buscarCategoria(): void {
    if (this.searchForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    const id = this.searchForm.get('id')?.value;
    if (!id) return;

    this.searching = true;
    this.loading = true;
    this.lastSearchId = id;

    this.categoriaCitaService.buscarPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data.categoriaCita) {
            this.searchResult.emit(response.p_data.categoriaCita);
            this.searchError.emit(''); // Limpiar errores previos
          } else {
            this.searchResult.emit(null);
            this.searchError.emit(response.p_menserror || 'No se encontró la categoría');
          }
        },
        error: (error) => {
          console.error('Error al buscar categoría:', error);
          this.searchResult.emit(null);
          this.searchError.emit('Error de conexión al buscar la categoría');
        },
        complete: () => {
          this.loading = false;
          this.searching = false;
        }
      });
  }

  // Limpiar búsqueda
  limpiarBusqueda(): void {
    this.searchForm.reset();
    this.searchResult.emit(null);
    this.searchError.emit('');
    this.lastSearchId = null;
  }

  // Marcar campos inválidos
  marcarCamposInvalidos(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  // Verificar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtener error de un campo
  getFieldError(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['min']) return `El ID debe ser mayor a ${field.errors['min'].min}`;
      if (field.errors['pattern']) return 'El ID debe ser un número válido';
    }
    return '';
  }

  // Verificar si hay resultados de búsqueda
  hasSearchResults(): boolean {
    return this.lastSearchId !== null;
  }

  // Obtener texto del botón de búsqueda
  getSearchButtonText(): string {
    return this.searching ? 'Buscando...' : 'Buscar';
  }

  // Obtener icono del botón de búsqueda
  getSearchButtonIcon(): string {
    return this.searching ? 'pi pi-spinner pi-spin' : 'pi pi-search';
  }
}
