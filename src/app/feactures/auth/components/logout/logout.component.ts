import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  @Output() logoutConfirmed = new EventEmitter<void>();

  visible: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  showDialog(): void {
    this.visible = true;
  }

  hideDialog(): void {
    this.visible = false;
  }

  confirmLogout(): void {
    this.loading = true;

    try {
      this.authService.logout();
      this.messageService.add({
        severity: 'success',
        summary: 'Sesión cerrada',
        detail: 'Has cerrado sesión exitosamente'
      });
      this.logoutConfirmed.emit();
      this.hideDialog();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cerrar sesión'
      });
    } finally {
      this.loading = false;
    }
  }

  cancelLogout(): void {
    this.hideDialog();
  }
}
