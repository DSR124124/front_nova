import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = API_ENDPOINTS.USUARIOS;

  constructor(private http: HttpClient) {}

  registrar(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, usuario);
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, usuario);
  }

  listarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/listar-por-username/${username}`);
  }
}
