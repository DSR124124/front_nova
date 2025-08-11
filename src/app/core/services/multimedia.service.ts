import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Multimedia } from '../models/multimedia';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  private baseUrl = API_ENDPOINTS.MULTIMEDIA;

  constructor(private http: HttpClient) {}

  registrar(multimedia: Multimedia): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, multimedia);
  }

  listar(): Observable<Multimedia[]> {
    return this.http.get<Multimedia[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(multimedia: Multimedia): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, multimedia);
  }

  listarPorId(id: number): Observable<Multimedia> {
    return this.http.get<Multimedia>(`${this.baseUrl}/listar-por-id/${id}`);
  }
}
