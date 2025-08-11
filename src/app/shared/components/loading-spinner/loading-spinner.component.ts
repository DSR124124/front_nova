import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
    standalone: false,
})
export class LoadingSpinnerComponent {
  @Input() size: string = '50px';
  @Input() strokeWidth: string = '4';
  @Input() animationDuration: string = '1s';
  @Input() ariaLabel: string = 'Cargando...';
  @Input() styleClass: string = '';
  @Input() label?: string;
}
