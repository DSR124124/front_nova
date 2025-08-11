import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Recordatorio } from '../models/recordatorio';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  private baseUrl = API_ENDPOINTS.RECORDATORIOS;

  constructor(private http: HttpClient) {}

  registrar(recordatorio: Recordatorio): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, recordatorio);
  }

  listar(): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(recordatorio: Recordatorio): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, recordatorio);
  }

  listarPorId(id: number): Observable<Recordatorio> {
    return this.http.get<Recordatorio>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorPareja(parejaId: number): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.baseUrl}/listar-por-pareja/${parejaId}`);
  }

  listarActivos(parejaId: number): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.baseUrl}/listar-activos/${parejaId}`);
  }
}
