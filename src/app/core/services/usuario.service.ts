import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { UsuarioByIdResponse } from '../models/Usuario/UsuarioByIdResponse';
import { Usuario } from '../models/Usuario/Usuario';
import { MensajeErrorDTO } from '../models/mensaje-error';
import { CambioPasswordDTO } from '../models/auth.interface';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = API_ENDPOINTS.USUARIOS;

  constructor(
    private http: HttpClient,
    private responseHandler: ResponseHandlerService
  ) {}

  // Métodos básicos que devuelven la respuesta completa del backend
  registrar(usuario: Usuario): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.post<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/registrar`, usuario);
  }

  modificar(usuario: Usuario): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.put<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/modificar`, usuario);
  }

  listarPorId(id: number): Observable<UsuarioByIdResponse> {
    return this.http.get<UsuarioByIdResponse>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorUsername(username: string): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.get<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/listar-por-username/${username}`);
  }

  cambiarPassword(cambioPassword: CambioPasswordDTO): Observable<MensajeErrorDTO<{idUsuario: number}>> {
    return this.http.post<MensajeErrorDTO<{idUsuario: number}>>(`${this.baseUrl}/cambiar-password`, cambioPassword);
  }

  // Métodos helper que extraen solo los datos
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.registrar(usuario).pipe(
      map(response => {
        if (response.p_exito && response.p_data?.usuario) {
          return response.p_data.usuario;
        }
        throw new Error(response.p_menserror || 'Error al registrar usuario');
      }),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.listarPorId(id).pipe(
      map(response => {
        if (response.p_exito && response.p_data?.usuario) {
          return response.p_data.usuario;
        }
        throw new Error(response.p_menserror || 'Error al obtener usuario');
      }),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuarioPorUsername(username: string): Observable<Usuario> {
    return this.listarPorUsername(username).pipe(
      map(response => {
        if (response.p_exito && response.p_data?.usuario) {
          return response.p_data.usuario;
        }
        throw new Error(response.p_menserror || 'Error al obtener usuario');
      }),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.modificar(usuario).pipe(
      map(response => {
        if (response.p_exito && response.p_data?.usuario) {
          return response.p_data.usuario;
        }
        throw new Error(response.p_menserror || 'Error al modificar usuario');
      }),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  cambiarPasswordUsuario(cambioPassword: CambioPasswordDTO): Observable<number> {
    return this.cambiarPassword(cambioPassword).pipe(
      map(response => {
        if (response.p_exito && response.p_data?.idUsuario) {
          return response.p_data.idUsuario;
        }
        throw new Error(response.p_menserror || 'Error al cambiar contraseña');
      }),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }
}
