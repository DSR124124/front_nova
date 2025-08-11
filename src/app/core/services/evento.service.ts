import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl = API_ENDPOINTS.EVENTOS;

  constructor(private http: HttpClient) {}

  registrar(evento: Evento): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, evento);
  }

  listar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(evento: Evento): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, evento);
  }

  listarPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  listarPorPareja(parejaId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/pareja/${parejaId}`);
  }

  listarPorTipo(tipo: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/tipo/${tipo}`);
  }

  listarPorLugar(lugarId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/lugar/${lugarId}`);
  }

  listarProximos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/proximos`);
  }

  listarPasados(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/pasados`);
  }

  listarPorParejaYTipo(parejaId: number, tipo: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/pareja/${parejaId}/tipo/${tipo}`);
  }

  listarPorAño(year: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/año/${year}`);
  }

  listarProximosPorPareja(parejaId: number, dias: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/pareja/${parejaId}/proximos/${dias}`);
  }

  contarPorPareja(parejaId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/contar-pareja/${parejaId}`);
  }
}
