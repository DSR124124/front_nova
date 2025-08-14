import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = error.error.message;
        } else {
          // Error del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente';
              // No hacer logout automático aquí, el AuthInterceptor se encarga
              break;
            case 403:
              errorMessage = 'Acceso denegado. No tiene permisos para esta acción';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflicto con el estado actual del recurso';
              break;
            case 422:
              errorMessage = error.error?.message || 'Datos de entrada inválidos';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            case 503:
              errorMessage = 'Servicio no disponible temporalmente';
              break;
            default:
              errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
          }
        }

        // Mostrar mensaje de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });

        return throwError(() => error);
      })
    );
  }
}
