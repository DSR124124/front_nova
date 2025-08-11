import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseUrl = API_ENDPOINTS.CITAS;

  constructor(private http: HttpClient) {}

  registrar(cita: Cita): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, cita);
  }

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(cita: Cita): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, cita);
  }

  listarPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorPareja(parejaId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/listar-por-pareja/${parejaId}`);
  }

  listarPorEstado(estado: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/listar-por-estado/${estado}`);
  }

  citasFuturas(parejaId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/futuras/${parejaId}`);
  }

  citasPasadas(parejaId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/pasadas/${parejaId}`);
  }

  mejorCalificadas(parejaId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/mejor-calificadas/${parejaId}`);
  }

  completarCita(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/completar/${id}`, {});
  }

  cancelarCita(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/cancelar/${id}`, {});
  }

  calificarCita(id: number, rating: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/calificar/${id}/${rating}`, {});
  }
}
