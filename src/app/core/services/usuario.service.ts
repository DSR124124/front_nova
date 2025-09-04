import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { UsuarioByIdResponse } from '../models/Interfaces/Usuario/UsuarioByIdResponse';
import { Usuario } from '../models/Interfaces/Usuario/Usuario';
import { Mensaje } from '../models/Interfaces/Mensaje/mensaje-error';
import { CambioPasswordDTO } from '../models/Interfaces/Auth/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = API_ENDPOINTS.USUARIOS;

  constructor(
    private http: HttpClient
  ) {}

  // Método de prueba para verificar conectividad
  testConnection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`);
  }

  // Métodos básicos que devuelven la respuesta completa del backend
  registrar(usuario: Usuario): Observable<Mensaje<{usuario: Usuario}>> {
    return this.http.post<Mensaje<{usuario: Usuario}>>(`${this.baseUrl}/registrar`, usuario);
  }

  modificar(usuario: Usuario): Observable<Mensaje<{usuario: Usuario}>> {
    return this.http.put<Mensaje<{usuario: Usuario}>>(`${this.baseUrl}/modificar`, usuario);
  }

  listarPorId(id: number): Observable<UsuarioByIdResponse> {
    return this.http.get<UsuarioByIdResponse>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorUsername(username: string): Observable<Mensaje<{usuario: Usuario}>> {
    const url = `${this.baseUrl}/listar-por-username/${username}`;
    return this.http.get<Mensaje<{usuario: Usuario}>>(url);
  }

  cambiarPassword(cambioPassword: CambioPasswordDTO): Observable<Mensaje<{idUsuario: number}>> {
    return this.http.post<Mensaje<{idUsuario: number}>>(`${this.baseUrl}/cambiar-password`, cambioPassword);
  }

  // Métodos helper simplificados (sin ResponseHandlerService)
  obtenerUsuarioPorUsername(username: string): Observable<Usuario> {
    return new Observable(subscriber => {
      this.listarPorUsername(username).subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data?.usuario) {
            subscriber.next(response.p_data.usuario);
            subscriber.complete();
          } else {
            subscriber.error(new Error(response.p_menserror || 'Error al obtener usuario'));
          }
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return new Observable(subscriber => {
      this.listarPorId(id).subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data?.usuario) {
            subscriber.next(response.p_data.usuario);
            subscriber.complete();
          } else {
            subscriber.error(new Error(response.p_menserror || 'Error al obtener usuario'));
          }
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario> {
    return new Observable(subscriber => {
      this.modificar(usuario).subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data?.usuario) {
            subscriber.next(response.p_data.usuario);
            subscriber.complete();
          } else {
            subscriber.error(new Error(response.p_menserror || 'Error al modificar usuario'));
          }
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  cambiarPasswordUsuario(cambioPassword: CambioPasswordDTO): Observable<number> {
    return new Observable(subscriber => {
      this.cambiarPassword(cambioPassword).subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data?.idUsuario) {
            subscriber.next(response.p_data.idUsuario);
            subscriber.complete();
          } else {
            subscriber.error(new Error(response.p_menserror || 'Error al cambiar contraseña'));
          }
        },
        error: (error) => subscriber.error(error)
      });
    });
  }
}
