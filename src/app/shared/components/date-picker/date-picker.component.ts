import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() showIcon: boolean = true;
  @Input() placeholder: string = 'Selecciona una fecha';
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() disabled: boolean = false;
  @Input() showTime: boolean = false;
  @Input() hourFormat: string = '24';
  @Input() showButtonBar: boolean = false;
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() inline: boolean = false;
  @Input() readonlyInput: boolean = false;
  @Input() showWeek: boolean = false;


  @Output() valueChange = new EventEmitter<Date | Date[] | null>();
  @Output() onSelect = new EventEmitter<Date>();
  @Output() onClear = new EventEmitter<void>();

  value: Date | Date[] | null = null;

  // ControlValueAccessor
  private onChange = (value: Date | Date[] | null) => {};
  private onTouched = () => {};

  onDateChange(event: any) {
    this.value = event;
    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  onDateSelect(event: any) {
    this.onSelect.emit(event);
  }

  clearDate() {
    this.value = null;
    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
    this.onClear.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | Date[] | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Date | Date[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
