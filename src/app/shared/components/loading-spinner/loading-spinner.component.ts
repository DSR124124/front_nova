import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
  standalone: false,
})
export class LoadingSpinnerComponent {
  @Input() strokeWidth: string = '4';
  @Input() ariaLabel: string = 'Cargando...';
  @Input() styleClass: string = '';
  @Input() label?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() overlay: boolean = false;
}
