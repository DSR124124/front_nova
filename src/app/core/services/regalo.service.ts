import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { DetalleRegalo } from '../models/Interfaces/recordatorio/regalo';

@Injectable({
  providedIn: 'root'
})
export class RegaloService {
  private baseUrl = API_ENDPOINTS.REGALOS;

  constructor(private http: HttpClient) {}

  registrar(regalo: DetalleRegalo): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, regalo);
  }

  listar(): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(regalo: DetalleRegalo): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, regalo);
  }

  listarPorId(id: number): Observable<DetalleRegalo> {
    return this.http.get<DetalleRegalo>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorPareja(parejaId: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/pareja/${parejaId}`);
  }

  listarPorRemitente(remitenteId: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/remitente/${remitenteId}`);
  }

  listarPorReceptor(receptorId: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/receptor/${receptorId}`);
  }

  listarEntreUsuarios(usuario1Id: number, usuario2Id: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/entre-usuarios/${usuario1Id}/${usuario2Id}`);
  }

  listarPorCita(citaId: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/cita/${citaId}`);
  }

  listarPorEvento(eventoId: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/evento/${eventoId}`);
  }

  listarRecientes(dias: number): Observable<DetalleRegalo[]> {
    return this.http.get<DetalleRegalo[]>(`${this.baseUrl}/recientes/${dias}`);
  }

  contarPorPareja(parejaId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/contar-pareja/${parejaId}`);
  }
}
