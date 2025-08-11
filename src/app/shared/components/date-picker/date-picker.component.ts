import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  standalone: false,
})
export class DatePickerComponent {
  @Input() value: Date | null = null;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() showIcon: boolean = true;
  @Input() placeholder: string = 'Selecciona una fecha';
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() disabled: boolean = false;
  @Input() showTime: boolean = false;
  @Input() hourFormat: string = '24';

  @Output() valueChange = new EventEmitter<Date | null>();

  onChange(event: any) {
    this.valueChange.emit(event.value);
  }
}
