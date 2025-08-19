import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from '../models/usuario';
import { MensajeErrorDTO, CambioPasswordDTO, CodigoRelacionDTO } from '../models/mensaje-error';
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

  // Métodos que devuelven la respuesta completa del backend
  registrar(usuario: Usuario): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.post<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/registrar`, usuario);
  }

  listar(): Observable<MensajeErrorDTO<{usuarios: Usuario[], total: number}>> {
    return this.http.get<MensajeErrorDTO<{usuarios: Usuario[], total: number}>>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<MensajeErrorDTO<{id: number}>> {
    return this.http.delete<MensajeErrorDTO<{id: number}>>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(usuario: Usuario): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.put<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/modificar`, usuario);
  }

  listarPorId(id: number): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.get<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorUsername(username: string): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.get<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/listar-por-username/${username}`);
  }

  cambiarPassword(cambioPassword: CambioPasswordDTO): Observable<MensajeErrorDTO<{idUsuario: number}>> {
    return this.http.post<MensajeErrorDTO<{idUsuario: number}>>(`${this.baseUrl}/cambiar-password`, cambioPassword);
  }

  generarCodigoRelacion(codigoRelacion: CodigoRelacionDTO): Observable<MensajeErrorDTO<{codigo: string}>> {
    return this.http.post<MensajeErrorDTO<{codigo: string}>>(`${this.baseUrl}/generar-codigo-relacion`, codigoRelacion);
  }

  buscarPorEmail(email: string): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.get<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/por-email/${email}`);
  }

  buscarPorCodigoRelacion(codigo: string): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    return this.http.get<MensajeErrorDTO<{usuario: Usuario}>>(`${this.baseUrl}/por-codigo-relacion/${codigo}`);
  }

  listarDisponiblesPareja(): Observable<MensajeErrorDTO<{usuarios: Usuario[]}>> {
    return this.http.get<MensajeErrorDTO<{usuarios: Usuario[]}>>(`${this.baseUrl}/disponibles-pareja`);
  }

  cambiarDisponibilidadPareja(id: number, disponible: boolean): Observable<MensajeErrorDTO<{id: number, disponible: boolean}>> {
    return this.http.put<MensajeErrorDTO<{id: number, disponible: boolean}>>(`${this.baseUrl}/${id}/disponibilidad`, disponible);
  }

  // Métodos helper que extraen solo los datos y manejan errores automáticamente
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.registrar(usuario).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.listar().pipe(
      map(response => this.responseHandler.extractData(response).usuarios),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.listarPorId(id).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuarioPorUsername(username: string): Observable<Usuario> {
    return this.listarPorUsername(username).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.modificar(usuario).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  cambiarPasswordUsuario(cambioPassword: CambioPasswordDTO): Observable<number> {
    return this.cambiarPassword(cambioPassword).pipe(
      map(response => this.responseHandler.extractData(response).idUsuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  eliminarUsuario(id: number): Observable<number> {
    return this.eliminar(id).pipe(
      map(response => this.responseHandler.extractData(response).id),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  generarCodigoRelacionUsuario(idUsuario: number): Observable<string> {
    return this.generarCodigoRelacion({ idUsuario }).pipe(
      map(response => this.responseHandler.extractData(response).codigo),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuarioPorEmail(email: string): Observable<Usuario> {
    return this.buscarPorEmail(email).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuarioPorCodigoRelacion(codigo: string): Observable<Usuario> {
    return this.buscarPorCodigoRelacion(codigo).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  obtenerUsuariosDisponiblesPareja(): Observable<Usuario[]> {
    return this.listarDisponiblesPareja().pipe(
      map(response => this.responseHandler.extractData(response).usuarios),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }

  cambiarDisponibilidadParejaUsuario(id: number, disponible: boolean): Observable<{id: number, disponible: boolean}> {
    return this.cambiarDisponibilidadPareja(id, disponible).pipe(
      map(response => this.responseHandler.extractData(response)),
      catchError(error => this.responseHandler.handleHttpError(error))
    );
  }
}
