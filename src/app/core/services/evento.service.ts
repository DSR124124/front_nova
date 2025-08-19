import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Evento } from '../models/Interfaces/evento/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl = API_ENDPOINTS.EVENTOS;

  // Datos mock para desarrollo
  private eventosMock: Evento[] = [
    {
      id: 1,
      parejaId: 1,
      titulo: 'Primer Aniversario',
      descripcion: 'Celebración de nuestro primer año juntos',
      fecha: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días en el futuro
      tipo: 'ANIVERSARIO',
      lugarId: 1,
      lugarNombre: 'Restaurante La Terraza'
    },
    {
      id: 2,
      parejaId: 1,
      titulo: 'Cumpleaños de María',
      descripcion: 'Celebrar el cumpleaños de María con una sorpresa especial',
      fecha: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días en el futuro
      tipo: 'CUMPLEAÑOS',
      lugarId: 2,
      lugarNombre: 'Parque Central'
    },
    {
      id: 3,
      parejaId: 1,
      titulo: 'San Valentín',
      descripcion: 'Cena romántica para celebrar el día del amor',
      fecha: '2024-02-14T19:00:00.000Z',
      tipo: 'SAN_VALENTIN',
      lugarId: 1,
      lugarNombre: 'Restaurante La Terraza'
    }
  ];

  constructor(private http: HttpClient) {}

  // Métodos mock para desarrollo
  registrar(evento: Evento): Observable<void> {
    const nuevoEvento = { ...evento, id: this.eventosMock.length + 1 };
    this.eventosMock.push(nuevoEvento);
    return of(void 0).pipe(delay(500));
  }

  listar(): Observable<Evento[]> {
    return of([...this.eventosMock]).pipe(delay(500));
  }

  eliminar(id: number): Observable<void> {
    const index = this.eventosMock.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventosMock.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Evento no encontrado');
  }

  modificar(evento: Evento): Observable<void> {
    const index = this.eventosMock.findIndex(e => e.id === evento.id);
    if (index !== -1) {
      this.eventosMock[index] = { ...evento };
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Evento no encontrado');
  }

  listarPorId(id: number): Observable<Evento> {
    const evento = this.eventosMock.find(e => e.id === id);
    if (evento) {
      return of(evento).pipe(delay(300));
    }
    throw new Error('Evento no encontrado');
  }

  listarPorPareja(parejaId: number): Observable<Evento[]> {
    const eventos = this.eventosMock.filter(e => e.parejaId === parejaId);
    return of(eventos).pipe(delay(300));
  }

  listarPorTipo(tipo: string): Observable<Evento[]> {
    const eventos = this.eventosMock.filter(e => e.tipo === tipo);
    return of(eventos).pipe(delay(300));
  }

  listarPorLugar(lugarId: number): Observable<Evento[]> {
    const eventos = this.eventosMock.filter(e => e.lugarId === lugarId);
    return of(eventos).pipe(delay(300));
  }

  listarProximos(): Observable<Evento[]> {
    const ahora = new Date();
    const eventos = this.eventosMock.filter(e => new Date(e.fecha) > ahora);
    return of(eventos).pipe(delay(300));
  }

  listarPasados(): Observable<Evento[]> {
    const ahora = new Date();
    const eventos = this.eventosMock.filter(e => new Date(e.fecha) <= ahora);
    return of(eventos).pipe(delay(300));
  }

  listarPorParejaYTipo(parejaId: number, tipo: string): Observable<Evento[]> {
    const eventos = this.eventosMock.filter(e => e.parejaId === parejaId && e.tipo === tipo);
    return of(eventos).pipe(delay(300));
  }

  listarPorAño(year: number): Observable<Evento[]> {
    const eventos = this.eventosMock.filter(e => new Date(e.fecha).getFullYear() === year);
    return of(eventos).pipe(delay(300));
  }

  listarProximosPorPareja(parejaId: number, dias: number): Observable<Evento[]> {
    const ahora = new Date();
    const limite = new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000);
    const eventos = this.eventosMock.filter(e =>
      e.parejaId === parejaId &&
      new Date(e.fecha) > ahora &&
      new Date(e.fecha) <= limite
    );
    return of(eventos).pipe(delay(300));
  }

  contarPorPareja(parejaId: number): Observable<number> {
    const count = this.eventosMock.filter(e => e.parejaId === parejaId).length;
    return of(count).pipe(delay(300));
  }
}
