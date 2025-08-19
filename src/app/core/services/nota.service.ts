import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Nota } from '../models/Interfaces/Mensaje/nota';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private baseUrl = API_ENDPOINTS.NOTAS;

  constructor(private http: HttpClient) {}

  registrar(nota: Nota): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, nota);
  }

  listar(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(nota: Nota): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, nota);
  }

  listarPorId(id: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.baseUrl}/listar-por-id/${id}`);
  }
}
