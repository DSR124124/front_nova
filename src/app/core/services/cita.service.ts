import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Cita, EstadoCita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseUrl = API_ENDPOINTS.CITAS;

  // Datos mock para desarrollo
  private citasMock: Cita[] = [
    {
      id: 1,
      parejaId: 1,
      lugarId: 1,
      titulo: 'Cena Romántica',
      descripcion: 'Una cena especial en nuestro restaurante favorito',
      fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días en el futuro
      estado: EstadoCita.PLANIFICADA,
      lugarNombre: 'Restaurante La Terraza',
      rating: 5
    },
    {
      id: 2,
      parejaId: 1,
      lugarId: 2,
      titulo: 'Paseo por el Parque',
      descripcion: 'Un paseo romántico por el parque central',
      fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días en el futuro
      estado: EstadoCita.PLANIFICADA,
      lugarNombre: 'Parque Central',
      rating: undefined
    },
    {
      id: 3,
      parejaId: 1,
      lugarId: 3,
      titulo: 'Cine Romántico',
      descripcion: 'Ver una película romántica juntos',
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días en el pasado
      estado: EstadoCita.REALIZADA,
      lugarNombre: 'Cine Multiplex',
      rating: 4
    }
  ];

  constructor(private http: HttpClient) {}

  // Métodos mock para desarrollo
  listar(): Observable<Cita[]> {
    return of([...this.citasMock]).pipe(delay(500)); // Simular delay de red
  }

  listarPorId(id: number): Observable<Cita> {
    const cita = this.citasMock.find(c => c.id === id);
    if (cita) {
      return of(cita).pipe(delay(300));
    }
    throw new Error('Cita no encontrada');
  }

  registrar(cita: Cita): Observable<void> {
    const nuevaCita = { ...cita, id: this.citasMock.length + 1 };
    this.citasMock.push(nuevaCita);
    return of(void 0).pipe(delay(500));
  }

  modificar(cita: Cita): Observable<void> {
    const index = this.citasMock.findIndex(c => c.id === cita.id);
    if (index !== -1) {
      this.citasMock[index] = { ...cita };
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Cita no encontrada');
  }

  eliminar(id: number): Observable<void> {
    const index = this.citasMock.findIndex(c => c.id === id);
    if (index !== -1) {
      this.citasMock.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Cita no encontrada');
  }

  completarCita(id: number): Observable<void> {
    const cita = this.citasMock.find(c => c.id === id);
    if (cita) {
      cita.estado = EstadoCita.REALIZADA;
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Cita no encontrada');
  }

  cancelarCita(id: number): Observable<void> {
    const cita = this.citasMock.find(c => c.id === id);
    if (cita) {
      cita.estado = EstadoCita.CANCELADA;
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Cita no encontrada');
  }

  calificarCita(id: number, rating: number): Observable<void> {
    const cita = this.citasMock.find(c => c.id === id);
    if (cita) {
      cita.rating = rating;
      return of(void 0).pipe(delay(500));
    }
    throw new Error('Cita no encontrada');
  }

  // Métodos adicionales
  listarPorPareja(parejaId: number): Observable<Cita[]> {
    const citas = this.citasMock.filter(c => c.parejaId === parejaId);
    return of(citas).pipe(delay(500));
  }

  listarPorEstado(estado: string): Observable<Cita[]> {
    const citas = this.citasMock.filter(c => c.estado === estado);
    return of(citas).pipe(delay(500));
  }

  citasFuturas(parejaId: number): Observable<Cita[]> {
    const ahora = new Date();
    const citas = this.citasMock.filter(c => 
      c.parejaId === parejaId && new Date(c.fecha) > ahora
    );
    return of(citas).pipe(delay(500));
  }

  citasPasadas(parejaId: number): Observable<Cita[]> {
    const ahora = new Date();
    const citas = this.citasMock.filter(c => 
      c.parejaId === parejaId && new Date(c.fecha) <= ahora
    );
    return of(citas).pipe(delay(500));
  }

  mejorCalificadas(parejaId: number): Observable<Cita[]> {
    const citas = this.citasMock
      .filter(c => c.parejaId === parejaId && c.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return of(citas).pipe(delay(500));
  }
}
