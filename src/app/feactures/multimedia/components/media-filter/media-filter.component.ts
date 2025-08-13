import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Multimedia, TipoMultimedia } from '../../../../core/models/multimedia';

export interface MediaFilters {
  searchTerm: string;
  tipo: TipoMultimedia | '';
  autorId: number | null;
  citaId: number | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  ordenarPor: 'fechaSubida' | 'nombre' | 'tipo' | 'citaTitulo';
  orden: 'asc' | 'desc';
}

@Component({
  selector: 'app-media-filter',
  standalone: false,
  templateUrl: './media-filter.component.html',
  styleUrl: './media-filter.component.css'
})
export class MediaFilterComponent implements OnInit, OnDestroy {
  @Output() filtersChanged = new EventEmitter<MediaFilters>();

  private destroy$ = new Subject<void>();

  // Formulario de filtros
  filterForm: FormGroup;

  // Opciones de filtros
  mediaTypes: { label: string; value: TipoMultimedia | '' }[] = [
    { label: 'Todas', value: '' },
    { label: 'Foto', value: 'FOTO' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Audio', value: 'AUDIO' },
    { label: 'Documento', value: 'DOCUMENTO' }
  ];

  sortOptions = [
    { label: 'Fecha de Subida', value: 'fechaSubida' },
    { label: 'Nombre', value: 'nombre' },
    { label: 'Tipo', value: 'tipo' },
    { label: 'Cita', value: 'citaTitulo' }
  ];

  orderOptions = [
    { label: 'Ascendente', value: 'asc' },
    { label: 'Descendente', value: 'desc' }
  ];

  // Autores disponibles (mock data)
  availableAutores = [
    { id: 1, nombre: 'María González' },
    { id: 2, nombre: 'Carlos Rodríguez' },
    { id: 3, nombre: 'Ana Martínez' },
    { id: 4, nombre: 'Luis Pérez' }
  ];

  // Citas disponibles (mock data)
  availableCitas = [
    { id: 1, titulo: 'Vacaciones Familiares' },
    { id: 2, titulo: 'Cumpleaños de María' },
    { id: 3, titulo: 'Sesión de Meditación' },
    { id: 4, titulo: 'Reunión de Trabajo' }
  ];

  // Estados
  isExpanded = false;
  hasActiveFilters = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      tipo: [''],
      autorId: [null],
      citaId: [null],
      fechaDesde: [null],
      fechaHasta: [null],
      ordenarPor: ['fechaSubida'],
      orden: ['desc']
    });
  }

  ngOnInit(): void {
    // Escuchar cambios en el formulario con debounce
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        this.checkActiveFilters(filters);
        this.filtersChanged.emit(filters);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Verificar si hay filtros activos
  private checkActiveFilters(filters: MediaFilters): void {
    this.hasActiveFilters = !!(
      filters.searchTerm ||
      filters.tipo ||
      filters.autorId ||
      filters.citaId ||
      filters.fechaDesde ||
      filters.fechaHasta
    );
  }

  // Limpiar todos los filtros
  clearFilters(): void {
    this.filterForm.patchValue({
      searchTerm: '',
      tipo: '',
      autorId: null,
      citaId: null,
      fechaDesde: null,
      fechaHasta: null,
      ordenarPor: 'fechaSubida',
      orden: 'desc'
    });
  }

  // Aplicar filtros manualmente
  applyFilters(): void {
    if (this.filterForm.valid) {
      const filters = this.filterForm.value;
      this.filtersChanged.emit(filters);
    }
  }

  // Expandir/contraer filtros
  toggleFilters(): void {
    this.isExpanded = !this.isExpanded;
  }

  // Obtener etiqueta del autor
  getAutorLabel(autorId: number): string {
    const autor = this.availableAutores.find(a => a.id === autorId);
    return autor ? autor.nombre : 'Autor desconocido';
  }

  // Obtener etiqueta de la cita
  getCitaLabel(citaId: number): string {
    const cita = this.availableCitas.find(c => c.id === citaId);
    return cita ? cita.titulo : 'Cita desconocida';
  }

  // Getters para el template
  get searchTerm() { return this.filterForm.get('searchTerm'); }
  get tipo() { return this.filterForm.get('tipo'); }
  get autorId() { return this.filterForm.get('autorId'); }
  get citaId() { return this.filterForm.get('citaId'); }
  get fechaDesde() { return this.filterForm.get('fechaDesde'); }
  get fechaHasta() { return this.filterForm.get('fechaHasta'); }
  get ordenarPor() { return this.filterForm.get('ordenarPor'); }
  get orden() { return this.filterForm.get('orden'); }
}
