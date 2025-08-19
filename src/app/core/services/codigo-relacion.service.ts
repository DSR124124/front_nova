import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ResponseHandlerService } from './response-handler.service';
import { MensajeErrorDTO } from '../models/mensaje-error';
import {
  CodigoRelacionResponseDTO,
  ValidacionCodigoResponseDTO,
  CodigoRelacionUsuarioDTO,
} from '../models/codigo-relacion';

@Injectable({
  providedIn: 'root',
})
export class CodigoRelacionService {
  private baseUrl = API_ENDPOINTS.CODIGOS_RELACION;

  constructor(
    private http: HttpClient,
    private responseHandler: ResponseHandlerService
  ) {}

  // ===== MÉTODOS PRINCIPALES =====

  generarCodigo(
    username: string
  ): Observable<MensajeErrorDTO<CodigoRelacionResponseDTO>> {
    const url = `${this.baseUrl}/generar/${username}`;
    return this.http.post<MensajeErrorDTO<CodigoRelacionResponseDTO>>(url, {});
  }

  validarCodigo(
    codigo: string
  ): Observable<MensajeErrorDTO<ValidacionCodigoResponseDTO>> {
    const url = `${this.baseUrl}/validar/${codigo}`;
    return this.http.get<MensajeErrorDTO<ValidacionCodigoResponseDTO>>(url);
  }

  obtenerCodigoUsuario(
    username: string
  ): Observable<MensajeErrorDTO<CodigoRelacionUsuarioDTO>> {
    const url = `${this.baseUrl}/usuario/${username}`;
    return this.http.get<MensajeErrorDTO<CodigoRelacionUsuarioDTO>>(url);
  }
}
