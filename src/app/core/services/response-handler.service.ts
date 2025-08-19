import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { MensajeErrorDTO } from '../models/Interfaces/Mensaje/mensaje-error';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor() { }

  /**
   * Extrae los datos de una respuesta exitosa del backend
   */
  extractData<T>(response: MensajeErrorDTO<T>): T {
    if (response && response.p_exito) {
      return response.p_data;
    } else if (response && !response.p_exito) {
      throw new Error(response.p_menserror || 'Error del backend');
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  }

  /**
   * Maneja errores de respuesta del backend
   */
  handleError(response: MensajeErrorDTO<any>): Observable<never> {
    const errorMessage = response.p_menserror || 'Error desconocido';
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Maneja errores HTTP del servidor
   */
  handleHttpError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido del servidor';

    // Manejar errores de parsing HTTP (status 200 pero respuesta no parseable)
    if (error && error.message && error.message.includes('Http failure during parsing')) {
      errorMessage = 'Error al procesar la respuesta del servidor. La respuesta no es válida.';
    } else if (error && error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Verifica tus credenciales.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. No tienes permisos para esta acción.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
          break;
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
          break;
        default:
          errorMessage = `Error del servidor (${error.status}): ${error.message || 'Error desconocido'}`;
      }
    } else if (error && error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Verifica si una respuesta es exitosa
   */
  isSuccess(response: MensajeErrorDTO<any>): boolean {
    return response.p_exito;
  }

  /**
   * Obtiene el mensaje de éxito o error
   */
  getMessage(response: MensajeErrorDTO<any>): string {
    return response.p_exito ? response.p_mensavis : (response.p_menserror || 'Error desconocido');
  }

  /**
   * Obtiene solo el mensaje de éxito
   */
  getSuccessMessage(response: MensajeErrorDTO<any>): string | null {
    return response.p_exito ? response.p_mensavis : null;
  }

  /**
   * Obtiene solo el mensaje de error
   */
  getErrorMessage(response: MensajeErrorDTO<any>): string | null {
    return response.p_exito ? null : response.p_menserror;
  }
}
