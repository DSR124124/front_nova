import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
     standalone: false,
})
export class ConfirmationDialogComponent {
  @Input() visible: boolean = false;
  @Input() message: string = '¿Estás seguro?';
  @Input() header: string = 'Confirmar';
  @Input() acceptLabel: string = 'Sí';
  @Input() rejectLabel: string = 'No';
  @Input() icon: string = 'pi pi-exclamation-triangle';

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  onAccept() {
    this.accept.emit();
  }

  onReject() {
    this.reject.emit();
  }
}
