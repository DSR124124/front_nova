import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Mensaje } from '../models/Interfaces/Mensaje/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private baseUrl = API_ENDPOINTS.MENSAJES;

  constructor(private http: HttpClient) {}

  registrar(mensaje: Mensaje): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, mensaje);
  }

  listar(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(mensaje: Mensaje): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, mensaje);
  }

  listarPorId(id: number): Observable<Mensaje> {
    return this.http.get<Mensaje>(`${this.baseUrl}/listar-por-id/${id}`);
  }
}
