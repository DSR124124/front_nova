import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Importar interfaces existentes
import { CategoriaCita } from '../models/Interfaces/cita/CategoriaCita';
import { ListarCategoriaCitaResponse } from '../models/Interfaces/cita/ListarCategoriaCitaResponse';
import { CategoriaByIdResponse } from '../models/Interfaces/cita/CategoriaByIdResponse';
import { EliminarCategoriaCitaResponse } from '../models/Interfaces/cita/EliminarCategoriaCitaResponse';
import { API_ENDPOINTS } from '../constants/api-endpoints';



@Injectable({
  providedIn: 'root'
})
export class CategoriaCitaService {

  private baseUrl = API_ENDPOINTS.CATEGORIAS_CITA;

  constructor(private http: HttpClient) { }

  // POST /categorias-cita/registrar
  registrar(categoria: CategoriaCita): Observable<CategoriaByIdResponse> {
    return this.http.post<CategoriaByIdResponse>(`${this.baseUrl}/registrar`, categoria);
  }

  // GET /categorias-cita/listar
  listar(): Observable<ListarCategoriaCitaResponse> {
    return this.http.get<ListarCategoriaCitaResponse>(`${this.baseUrl}/listar`);
  }

  // GET /categorias-cita/buscar/{id}
  buscarPorId(id: number): Observable<CategoriaByIdResponse> {
    return this.http.get<CategoriaByIdResponse>(`${this.baseUrl}/buscar/${id}`);
  }

  // PUT /categorias-cita/modificar
  modificar(categoria: CategoriaCita): Observable<CategoriaByIdResponse> {
    return this.http.put<CategoriaByIdResponse>(`${this.baseUrl}/modificar`, categoria);
  }

  // DELETE /categorias-cita/eliminar/{id}
  eliminar(id: number): Observable<EliminarCategoriaCitaResponse> {
    return this.http.delete<EliminarCategoriaCitaResponse>(`${this.baseUrl}/eliminar/${id}`);
  }
}
