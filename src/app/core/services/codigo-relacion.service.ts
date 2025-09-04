import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Mensaje } from '../models/Interfaces/Mensaje/mensaje-error';
import {
  CodigoRelacionResponseDTO,
  ValidacionCodigoResponseDTO,
  CodigoRelacionUsuarioDTO,
} from '../models/Interfaces/Codigos-Relacion/codigo-relacion';

@Injectable({
  providedIn: 'root',
})
export class CodigoRelacionService {
  private baseUrl = API_ENDPOINTS.CODIGOS_RELACION;

  constructor(
    private http: HttpClient
  ) {}

  // ===== MÉTODOS PRINCIPALES =====

  generarCodigo(
    username: string
  ): Observable<Mensaje<CodigoRelacionResponseDTO>> {
    const url = `${this.baseUrl}/generar/${username}`;
    return this.http.post<Mensaje<CodigoRelacionResponseDTO>>(url, {});
  }

  validarCodigo(
    codigo: string
  ): Observable<Mensaje<ValidacionCodigoResponseDTO>> {
    const url = `${this.baseUrl}/validar/${codigo}`;
    return this.http.get<Mensaje<ValidacionCodigoResponseDTO>>(url);
  }

  obtenerCodigoUsuario(
    username: string
  ): Observable<Mensaje<CodigoRelacionUsuarioDTO>> {
    const url = `${this.baseUrl}/usuario/${username}`;
    return this.http.get<Mensaje<CodigoRelacionUsuarioDTO>>(url);
  }
}
