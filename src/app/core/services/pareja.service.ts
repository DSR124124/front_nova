import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Pareja } from '../models/Interfaces/Pareja/pareja';

@Injectable({
  providedIn: 'root'
})
export class ParejaService {
  private baseUrl = API_ENDPOINTS.PAREJAS;

  constructor(private http: HttpClient) {}

  registrar(pareja: Pareja): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, pareja);
  }

  listar(): Observable<Pareja[]> {
    return this.http.get<Pareja[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(pareja: Pareja): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, pareja);
  }

  listarPorId(id: number): Observable<Pareja> {
    return this.http.get<Pareja>(`${this.baseUrl}/listar-por-id/${id}`);
  }
}
