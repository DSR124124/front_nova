import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Lugar } from '../models/lugar';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  private baseUrl = API_ENDPOINTS.LUGARES;

  constructor(private http: HttpClient) {}

  registrar(lugar: Lugar): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/registrar`, lugar);
  }

  listar(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/listar`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`);
  }

  modificar(lugar: Lugar): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/modificar`, lugar);
  }

  listarPorId(id: number): Observable<Lugar> {
    return this.http.get<Lugar>(`${this.baseUrl}/listar-por-id/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/buscar/${nombre}`);
  }

  listarPorCategoria(categoria: string): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/categoria/${categoria}`);
  }

  listarFavoritos(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/favoritos`);
  }

  masVisitados(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/mas-visitados`);
  }

  mejorCalificados(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/mejor-calificados`);
  }

  marcarComoFavorito(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/marcar-favorito/${id}`, {});
  }

  desmarcarComoFavorito(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/desmarcar-favorito/${id}`, {});
  }
}
