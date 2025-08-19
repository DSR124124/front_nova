import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Lugar } from '../../../../core/models/Interfaces/lugar/lugar';
import { CategoriaLugar } from '../../../../core/models/enums/categoria-lugar.enum';

@Component({
  selector: 'app-lugar-search',
  standalone: false,
  templateUrl: './lugar-search.component.html',
  styleUrl: './lugar-search.component.css'
})
export class LugarSearchComponent implements OnInit, OnDestroy {
  @Output() searchResults = new EventEmitter<Lugar[]>();
  @Output() searchCleared = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  searchForm: FormGroup;
  isAdvancedSearch = false;
  loading = false;

  // Opciones de categoría para filtros
  categoriaOptions = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Restaurante', value: CategoriaLugar.RESTAURANTE },
    { label: 'Parque', value: CategoriaLugar.PARQUE },
    { label: 'Cine', value: CategoriaLugar.CINE },
    { label: 'Entretenimiento', value: CategoriaLugar.ENTRETENIMIENTO },
    { label: 'Casa', value: CategoriaLugar.CASA },
    { label: 'Otro', value: CategoriaLugar.OTRO }
  ];

  // Opciones de precio para filtros
  precioOptions = [
    { label: 'Todos los precios', value: '' },
    { label: 'Gratis', value: 'GRATIS' },
    { label: 'Económico', value: 'ECONOMICO' },
    { label: 'Moderado', value: 'MODERADO' },
    { label: 'Costoso', value: 'COSTOSO' },
    { label: 'Premium', value: 'PREMIUM' }
  ];

  // Opciones de rating para filtros
  ratingOptions = [
    { label: 'Todas las calificaciones', value: null },
    { label: '5 estrellas', value: 5 },
    { label: '4+ estrellas', value: 4 },
    { label: '3+ estrellas', value: 3 },
    { label: '2+ estrellas', value: 2 },
    { label: '1+ estrella', value: 1 }
  ];

  // Opciones de servicios
  serviciosOptions = [
    { label: 'WiFi', value: 'WiFi' },
    { label: 'Estacionamiento', value: 'Estacionamiento' },
    { label: 'Terraza', value: 'Terraza' },
    { label: 'Música en vivo', value: 'Música en vivo' },
    { label: 'Áreas verdes', value: 'Áreas verdes' },
    { label: 'Bancas', value: 'Bancas' },
    { label: 'Fuentes', value: 'Fuentes' },
    { label: 'Sala VIP', value: 'Sala VIP' },
    { label: 'Comida', value: 'Comida' },
    { label: 'Vista panorámica', value: 'Vista panorámica' },
    { label: 'Áreas de descanso', value: 'Áreas de descanso' },
    { label: 'Seguridad', value: 'Seguridad' }
  ];

  // Opciones de horario
  horarioOptions = [
    { label: 'Cualquier horario', value: '' },
    { label: '24 horas', value: '24 horas' },
    { label: 'Mañana (06:00 - 12:00)', value: '06:00 - 12:00' },
    { label: 'Tarde (12:00 - 18:00)', value: '12:00 - 18:00' },
    { label: 'Noche (18:00 - 00:00)', value: '18:00 - 00:00' },
    { label: 'Madrugada (00:00 - 06:00)', value: '00:00 - 06:00' }
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      categoria: [''],
      precio: [''],
      rating: [null],
      servicios: [[]],
      horario: [''],
      esFavorito: [false],
      esVerificado: [false],
      distancia: [null]
    });
  }

  ngOnInit(): void {
    // Configurar búsqueda en tiempo real con debounce
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.performSearch();
      });

    // Configurar filtros automáticos
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (this.searchForm.get('searchTerm')?.value || this.hasActiveFilters()) {
          this.performSearch();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearch = !this.isAdvancedSearch;
  }

  performSearch(): void {
    this.loading = true;

    // Simular búsqueda (en un caso real, esto se conectaría con un servicio)
    setTimeout(() => {
      this.loading = false;
      // Emitir resultados de búsqueda (esto se conectará con el componente padre)
      this.searchResults.emit([]);
    }, 500);
  }

  clearSearch(): void {
    this.searchForm.reset({
      searchTerm: '',
      categoria: '',
      precio: '',
      rating: null,
      servicios: [],
      horario: '',
      esFavorito: false,
      esVerificado: false,
      distancia: null
    });
    this.searchCleared.emit();
  }

  hasActiveFilters(): boolean {
    const formValue = this.searchForm.value;
    return !!(
      formValue.categoria ||
      formValue.precio ||
      formValue.rating !== null ||
      formValue.servicios?.length > 0 ||
      formValue.horario ||
      formValue.esFavorito ||
      formValue.esVerificado ||
      formValue.distancia
    );
  }

  getActiveFiltersCount(): number {
    let count = 0;
    const formValue = this.searchForm.value;

    if (formValue.categoria) count++;
    if (formValue.precio) count++;
    if (formValue.rating !== null) count++;
    if (formValue.servicios?.length > 0) count++;
    if (formValue.horario) count++;
    if (formValue.esFavorito) count++;
    if (formValue.esVerificado) count++;
    if (formValue.distancia) count++;

    return count;
  }

  onServicioChange(event: any): void {
    const servicios = this.searchForm.get('servicios')?.value || [];
    const servicio = event.value;

    if (event.checked) {
      if (!servicios.includes(servicio)) {
        servicios.push(servicio);
      }
    } else {
      const index = servicios.indexOf(servicio);
      if (index > -1) {
        servicios.splice(index, 1);
      }
    }

    this.searchForm.patchValue({ servicios });
  }
}
