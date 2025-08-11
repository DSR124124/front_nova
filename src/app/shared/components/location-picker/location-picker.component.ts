import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Location {
  id?: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  type?: string;
}

@Component({
  selector: 'app-location-picker',
  standalone: false,
  templateUrl: './location-picker.component.html',
  styleUrl: './location-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationPickerComponent),
      multi: true
    }
  ]
})
export class LocationPickerComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = 'Buscar ubicación...';
  @Input() showMap: boolean = false;
  @Input() showCurrentLocation: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() suggestions: Location[] = [];

  @Output() locationSelected = new EventEmitter<Location>();
  @Output() searchChanged = new EventEmitter<string>();

  selectedLocation: Location | null = null;
  searchText: string = '';
  filteredSuggestions: Location[] = [];
  showSuggestions: boolean = false;
  loading: boolean = false;

  // Ubicaciones predefinidas para ejemplo
  defaultLocations: Location[] = [
    {
      id: '1',
      name: 'Parque Central',
      address: 'Av. Principal 123, Centro',
      city: 'Ciudad',
      country: 'País',
      type: 'parque'
    },
    {
      id: '2',
      name: 'Centro Comercial Plaza',
      address: 'Calle Comercio 456',
      city: 'Ciudad',
      country: 'País',
      type: 'comercial'
    },
    {
      id: '3',
      name: 'Restaurante El Buen Sabor',
      address: 'Av. Gastronómica 789',
      city: 'Ciudad',
      country: 'País',
      type: 'restaurante'
    },
    {
      id: '4',
      name: 'Teatro Municipal',
      address: 'Plaza de las Artes 321',
      city: 'Ciudad',
      country: 'País',
      type: 'entretenimiento'
    }
  ];

  // ControlValueAccessor
  private onChange = (value: Location | null) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.filteredSuggestions = this.suggestions.length > 0 ? this.suggestions : this.defaultLocations;
  }

  onSearchInput(event: any) {
    const query = event.target.value || '';
    this.searchText = query;
    this.searchChanged.emit(query);

    if (query.length >= 2) {
      this.filterSuggestions(query);
      this.showSuggestions = true;
    } else {
      this.showSuggestions = false;
      this.filteredSuggestions = this.suggestions.length > 0 ? this.suggestions : this.defaultLocations;
    }
  }

  private filterSuggestions(query: string) {
    const searchQuery = query.toLowerCase();
    const allLocations = this.suggestions.length > 0 ? this.suggestions : this.defaultLocations;

    this.filteredSuggestions = allLocations.filter(location =>
      location.name.toLowerCase().includes(searchQuery) ||
      location.address.toLowerCase().includes(searchQuery) ||
      location.city?.toLowerCase().includes(searchQuery) ||
      location.type?.toLowerCase().includes(searchQuery)
    );
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
    this.searchText = location.name;
    this.showSuggestions = false;
    this.onChange(location);
    this.onTouched();
    this.locationSelected.emit(location);
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      this.loading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation: Location = {
            name: 'Ubicación actual',
            address: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            type: 'current'
          };
          this.selectLocation(currentLocation);
          this.loading = false;
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          this.loading = false;
        }
      );
    }
  }

  clearSelection() {
    this.selectedLocation = null;
    this.searchText = '';
    this.showSuggestions = false;
    this.onChange(null);
    this.onTouched();
  }

  onFocus() {
    if (this.searchText.length >= 2) {
      this.showSuggestions = true;
    }
  }

  onBlur() {
    // Delay para permitir click en sugerencias
    setTimeout(() => {
      this.showSuggestions = false;
      this.onTouched();
    }, 200);
  }

  getLocationIcon(type?: string): string {
    const iconMap: { [key: string]: string } = {
      'parque': 'pi pi-map',
      'comercial': 'pi pi-shopping-cart',
      'restaurante': 'pi pi-star',
      'entretenimiento': 'pi pi-ticket',
      'current': 'pi pi-map-marker',
      'default': 'pi pi-map-marker'
    };
    return iconMap[type || 'default'] || iconMap['default'];
  }

  // ControlValueAccessor implementation
  writeValue(value: Location | null): void {
    this.selectedLocation = value;
    this.searchText = value ? value.name : '';
  }

  registerOnChange(fn: (value: Location | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
