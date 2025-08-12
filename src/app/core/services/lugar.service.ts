import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Lugar, CategoriaLugar } from '../models/lugar';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  private baseUrl = API_ENDPOINTS.LUGARES;

  // Datos mock para desarrollo
  private lugaresMock: Lugar[] = [
    {
      id: 1,
      nombre: 'Restaurante La Terraza',
      descripcion: 'Restaurante romántico con vista al mar',
      direccion: 'Av. Costanera 123',
      categoria: CategoriaLugar.RESTAURANTE,
      rating: 4.5,
      precio: '$$',
      horario: '12:00 - 23:00',
      telefono: '+51 123 456 789',
      email: 'info@laterraza.com',
      sitioWeb: 'www.laterraza.com',
      coordenadas: { lat: -12.0464, lng: -77.0428 },
      imagenes: ['terraza1.jpg', 'terraza2.jpg'],
      servicios: ['WiFi', 'Estacionamiento', 'Terraza'],
      esFavorito: true,
      esVerificado: true
    },
    {
      id: 2,
      nombre: 'Parque Central',
      descripcion: 'Hermoso parque para paseos románticos',
      direccion: 'Plaza Mayor 456',
      categoria: CategoriaLugar.PARQUE,
      rating: 4.2,
      precio: 'Gratis',
      horario: '06:00 - 22:00',
      telefono: '+51 123 456 790',
      email: 'parque@municipio.com',
      sitioWeb: 'www.parquecentral.com',
      coordenadas: { lat: -12.0464, lng: -77.0428 },
      imagenes: ['parque1.jpg', 'parque2.jpg'],
      servicios: ['Áreas verdes', 'Bancas', 'Fuentes'],
      esFavorito: false,
      esVerificado: true
    },
    {
      id: 3,
      nombre: 'Cine Multiplex',
      descripcion: 'Cine moderno para ver películas románticas',
      direccion: 'Centro Comercial Plaza 789',
      categoria: CategoriaLugar.ENTRETENIMIENTO,
      rating: 4.0,
      precio: '$$',
      horario: '10:00 - 02:00',
      telefono: '+51 123 456 791',
      email: 'info@cinemultiplex.com',
      sitioWeb: 'www.cinemultiplex.com',
      coordenadas: { lat: -12.0464, lng: -77.0428 },
      imagenes: ['cine1.jpg', 'cine2.jpg'],
      servicios: ['Sala VIP', 'Comida', 'Estacionamiento'],
      esFavorito: false,
      esVerificado: true
    }
  ];

  constructor(private http: HttpClient) {}

  // Métodos mock para desarrollo
  listar(): Observable<Lugar[]> {
    return of([...this.lugaresMock]).pipe(delay(500));
  }

  listarPorId(id: number): Observable<Lugar> {
    const lugar = this.lugaresMock.find(l => l.id === id);
    if (lugar) {
      return of(lugar).pipe(delay(300));
    }
    throw new Error('Lugar no encontrado');
  }

  registrar(lugar: Lugar): Observable<void> {
    const nuevoLugar = { ...lugar, id: this.lugaresMock.length + 1 };
    this.lugaresMock.push(nuevoLugar);
    return of(void 0).pipe(delay(500));
  }

  modificar(lugar: Lugar): Observable<void> {
    const index = this.lugaresMock.findIndex(l => l.id === lugar.id);
    if (index !== -1) {
      this.lugaresMock[index] = { ...lugar };
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Lugar no encontrado');
  }

  eliminar(id: number): Observable<void> {
    const index = this.lugaresMock.findIndex(l => l.id === id);
    if (index !== -1) {
      this.lugaresMock.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Lugar no encontrado');
  }

  buscarPorNombre(nombre: string): Observable<Lugar[]> {
    const lugares = this.lugaresMock.filter(l => 
      l.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    return of(lugares).pipe(delay(300));
  }

  listarPorCategoria(categoria: string): Observable<Lugar[]> {
    const lugares = this.lugaresMock.filter(l => l.categoria === categoria);
    return of(lugares).pipe(delay(300));
  }

  listarFavoritos(): Observable<Lugar[]> {
    const lugares = this.lugaresMock.filter(l => l.esFavorito);
    return of(lugares).pipe(delay(300));
  }

  masVisitados(): Observable<Lugar[]> {
    // Simular lugares más visitados por rating
    const lugares = [...this.lugaresMock].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return of(lugares.slice(0, 5)).pipe(delay(300));
  }

  mejorCalificados(): Observable<Lugar[]> {
    const lugares = [...this.lugaresMock].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return of(lugares).pipe(delay(300));
  }

  marcarComoFavorito(id: number): Observable<void> {
    const lugar = this.lugaresMock.find(l => l.id === id);
    if (lugar) {
      lugar.esFavorito = true;
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Lugar no encontrado');
  }

  desmarcarComoFavorito(id: number): Observable<void> {
    const lugar = this.lugaresMock.find(l => l.id === id);
    if (lugar) {
      lugar.esFavorito = false;
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Lugar no encontrado');
  }
}
