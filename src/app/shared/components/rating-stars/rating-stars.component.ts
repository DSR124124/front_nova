import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating-stars',
  standalone: false,
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingStarsComponent),
      multi: true
    }
  ]
})
export class RatingStarsComponent implements ControlValueAccessor {
  @Input() stars: number = 5;               // Número total de estrellas
  @Input() readonly: boolean = false;       // Solo lectura
  @Input() disabled: boolean = false;       // Deshabilitado
  @Input() showCancel: boolean = false;     // Mostrar botón de cancelar
  @Input() size: 'small' | 'medium' | 'large' = 'medium'; // Tamaño
  @Input() showLabel: boolean = false;      // Mostrar etiqueta con valor
  @Input() labelTemplate?: string;          // Template para etiqueta personalizada

  @Output() rateChange = new EventEmitter<number>();
  @Output() onRate = new EventEmitter<{originalEvent: Event, value: number}>();
  @Output() onClear = new EventEmitter<void>();

  value: number = 0;

  // ControlValueAccessor
  private onChange = (value: number) => {};
  private onTouched = () => {};

  onRatingChange(event: any) {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
    this.rateChange.emit(this.value);
    this.onRate.emit(event);
  }

  clearRating() {
    this.value = 0;
    this.onChange(this.value);
    this.onTouched();
    this.rateChange.emit(this.value);
    this.onClear.emit();
  }

  getRatingLabel(): string {
    if (this.labelTemplate) {
      return this.labelTemplate.replace('{value}', this.value.toString()).replace('{stars}', this.stars.toString());
    }

    if (this.value === 0) {
      return 'Sin calificación';
    }

    const labels: { [key: number]: string } = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };

    return labels[this.value] || `${this.value} de ${this.stars} estrellas`;
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.value = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
