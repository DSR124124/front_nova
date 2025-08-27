import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ParejaUnirCodigosResponse } from '../models/Interfaces/Pareja/ParejaUnirCodigosResponse';
import { EstadoDisponibilidadParejaResponse } from '../models/Interfaces/Pareja/EstadoDisponibilidadParejaResponse';
import { InformacionParejaResponse } from '../models/Interfaces/Pareja/InformacionParejaResponse';

@Injectable({
  providedIn: 'root'
})
export class ParejaService {
  private baseUrl = API_ENDPOINTS.PAREJAS;

  constructor(private http: HttpClient) {}


  unirCodigos(codigo1: string, codigo2: string): Observable<ParejaUnirCodigosResponse> {
    const url = `${this.baseUrl}/unir-codigos`;
    const payload = {
      codigo1,
      codigo2
    };

    return this.http.post<ParejaUnirCodigosResponse>(url, payload);
  }


  puedeCrearPareja(idUsuario: number): Observable<EstadoDisponibilidadParejaResponse> {
    const url = `${this.baseUrl}/puede-crear-pareja/${idUsuario}`;
    return this.http.get<EstadoDisponibilidadParejaResponse>(url);
  }

  obtenerInfoRelacion(idUsuario: number): Observable<InformacionParejaResponse> {
    const url = `${this.baseUrl}/info-relacion/${idUsuario}`;
    return this.http.get<InformacionParejaResponse>(url);
  }
}
