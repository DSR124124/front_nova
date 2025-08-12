import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadoCita } from '../../../../core/models/cita';

export interface CitaFilter {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: EstadoCita;
  lugarId?: number;
  categoriaId?: number;
  titulo?: string;
  rating?: number;
}

export interface LugarOption {
  id: number;
  nombre: string;
}

export interface CategoriaOption {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-cita-filter',
  standalone: false,
  templateUrl: './cita-filter.component.html',
  styleUrl: './cita-filter.component.css'
})
export class CitaFilterComponent implements OnInit {
  @Input() lugares: LugarOption[] = [];
  @Input() categorias: CategoriaOption[] = [];
  @Input() showAdvanced = false;
  @Input() disabled = false;

  @Output() filterChange = new EventEmitter<CitaFilter>();
  @Output() clearFilters = new EventEmitter<void>();

  // Expose enum to template
  EstadoCita = EstadoCita;

  // Filter values
  filtros: CitaFilter = {};

  // Options for dropdowns
  estadoOptions = [
    { label: 'Todos los estados', value: null },
    { label: 'Planificada', value: EstadoCita.PLANIFICADA },
    { label: 'Realizada', value: EstadoCita.REALIZADA },
    { label: 'Cancelada', value: EstadoCita.CANCELADA }
  ];

  ratingOptions = [
    { label: 'Cualquier calificación', value: null },
    { label: '5 estrellas', value: 5 },
    { label: '4+ estrellas', value: 4 },
    { label: '3+ estrellas', value: 3 },
    { label: '2+ estrellas', value: 2 },
    { label: '1+ estrellas', value: 1 }
  ];

  // UI state
  isExpanded = false;
  hasActiveFilters = false;

  ngOnInit() {
    this.updateActiveFiltersState();
  }

  onFilterChange() {
    this.updateActiveFiltersState();
    this.filterChange.emit({ ...this.filtros });
  }

  onClearFilters() {
    this.filtros = {};
    this.updateActiveFiltersState();
    this.clearFilters.emit();
    this.filterChange.emit({});
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  private updateActiveFiltersState() {
    this.hasActiveFilters = !!(
      this.filtros.fechaInicio ||
      this.filtros.fechaFin ||
      this.filtros.estado ||
      this.filtros.lugarId ||
      this.filtros.categoriaId ||
      this.filtros.titulo ||
      this.filtros.rating
    );
  }

  onFechaInicioChange(fecha: Date) {
    this.filtros.fechaInicio = fecha;
    this.onFilterChange();
  }

  onFechaFinChange(fecha: Date) {
    this.filtros.fechaFin = fecha;
    this.onFilterChange();
  }

  onEstadoChange(estado: EstadoCita) {
    this.filtros.estado = estado;
    this.onFilterChange();
  }

  onLugarChange(lugarId: number) {
    this.filtros.lugarId = lugarId;
    this.onFilterChange();
  }

  onCategoriaChange(categoriaId: number) {
    this.filtros.categoriaId = categoriaId;
    this.onFilterChange();
  }

  onTituloChange(titulo: string) {
    this.filtros.titulo = titulo?.trim() || undefined;
    this.onFilterChange();
  }

  onRatingChange(rating: number) {
    this.filtros.rating = rating;
    this.onFilterChange();
  }

  getLugarOptions() {
    return [
      { label: 'Todos los lugares', value: null },
      ...this.lugares.map(lugar => ({ label: lugar.nombre, value: lugar.id }))
    ];
  }

  getCategoriaOptions() {
    return [
      { label: 'Todas las categorías', value: null },
      ...this.categorias.map(categoria => ({ label: categoria.nombre, value: categoria.id }))
    ];
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filtros.fechaInicio) count++;
    if (this.filtros.fechaFin) count++;
    if (this.filtros.estado) count++;
    if (this.filtros.lugarId) count++;
    if (this.filtros.categoriaId) count++;
    if (this.filtros.titulo) count++;
    if (this.filtros.rating) count++;
    return count;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Methods to clear individual filters
  clearTitulo() {
    this.filtros.titulo = undefined;
    this.onFilterChange();
  }

  clearEstado() {
    this.filtros.estado = undefined;
    this.onFilterChange();
  }

  clearFechaInicio() {
    this.filtros.fechaInicio = undefined;
    this.onFilterChange();
  }

  clearFechaFin() {
    this.filtros.fechaFin = undefined;
    this.onFilterChange();
  }

  clearLugar() {
    this.filtros.lugarId = undefined;
    this.onFilterChange();
  }

  clearCategoria() {
    this.filtros.categoriaId = undefined;
    this.onFilterChange();
  }

  clearRating() {
    this.filtros.rating = undefined;
    this.onFilterChange();
  }

  // Helper methods to get display names
  getLugarNombre(): string {
    if (!this.filtros.lugarId) return 'Desconocido';
    const lugar = this.lugares.find(l => l.id === this.filtros.lugarId);
    return lugar?.nombre || 'Desconocido';
  }

  getCategoriaNombre(): string {
    if (!this.filtros.categoriaId) return 'Desconocida';
    const categoria = this.categorias.find(c => c.id === this.filtros.categoriaId);
    return categoria?.nombre || 'Desconocida';
  }
}
