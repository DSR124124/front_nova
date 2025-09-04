import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Mensaje } from '../models/Interfaces/Mensaje/mensaje-error';

@Injectable({
  providedIn: 'root',
})
export class MessageInfoService {
  constructor(private messageService: MessageService) {}

  handleBackendResponse<T>(
    response: Mensaje<T>,
    successMessage?: string,
    showSuccessToast: boolean = true
  ): boolean {
    if (response.p_exito) {
      // Éxito
      if (showSuccessToast) {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail:
            successMessage ||
            response.p_mensavis ||
            'Operación realizada correctamente',
          life: 3000,
        });
      }
      return true;
    } else {
      // Error
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response.p_menserror || 'Ha ocurrido un error inesperado',
        life: 5000,
      });
      return false;
    }
  }

  showSuccess(message: string, summary: string = 'Éxito'): void {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: message,
      life: 3000,
    });
  }

  showError(message: string, summary: string = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: message,
      life: 5000,
    });
  }

  showInfo(message: string, summary: string = 'Información'): void {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: message,
      life: 4000,
    });
  }

  showWarning(message: string, summary: string = 'Advertencia'): void {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: message,
      life: 4000,
    });
  }
}
