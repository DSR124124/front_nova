import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Recordatorio, TipoRecordatorio, EstadoRecordatorio, FrecuenciaRecordatorio } from '../models/recordatorio';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  private baseUrl = API_ENDPOINTS.RECORDATORIOS;

  // Datos de prueba
  private mockRecordatorios: Recordatorio[] = [
    {
      id: 1,
      parejaId: 1,
      creadoPorId: 1,
      titulo: 'Aniversario de Pareja',
      descripcion: 'Celebrar nuestro 2do aniversario juntos',
      fechaHora: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      tipo: TipoRecordatorio.PAREJA,
      esRecurrente: true,
      frecuencia: FrecuenciaRecordatorio.ANUAL,
      estado: EstadoRecordatorio.ACTIVO,
      minutosAntes: 60,
      lugarId: 1,
      lugarNombre: 'Restaurante El Rincón',
      creadoPorNombre: 'María',
      tipoDescripcion: 'Pareja',
      estadoDescripcion: 'Activo',
      frecuenciaDescripcion: 'Anual'
    },
    {
      id: 2,
      parejaId: 1,
      creadoPorId: 1,
      titulo: 'Cita Médica',
      descripcion: 'Revisión médica anual',
      fechaHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      tipo: TipoRecordatorio.PERSONAL,
      esRecurrente: true,
      frecuencia: FrecuenciaRecordatorio.ANUAL,
      estado: EstadoRecordatorio.ACTIVO,
      minutosAntes: 30,
      lugarId: 2,
      lugarNombre: 'Clínica San José',
      creadoPorNombre: 'María',
      tipoDescripcion: 'Personal',
      estadoDescripcion: 'Activo',
      frecuenciaDescripcion: 'Anual'
    },
    {
      id: 3,
      parejaId: 1,
      creadoPorId: 2,
      titulo: 'Cumpleaños de Juan',
      descripcion: 'Preparar sorpresa para el cumpleaños',
      fechaHora: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      tipo: TipoRecordatorio.PAREJA,
      esRecurrente: true,
      frecuencia: FrecuenciaRecordatorio.ANUAL,
      estado: EstadoRecordatorio.ACTIVO,
      minutosAntes: 120,
      lugarId: 3,
      lugarNombre: 'Casa',
      creadoPorNombre: 'Juan',
      tipoDescripcion: 'Pareja',
      estadoDescripcion: 'Activo',
      frecuenciaDescripcion: 'Anual'
    },
    {
      id: 4,
      parejaId: 1,
      creadoPorId: 1,
      titulo: 'Pago de Servicios',
      descripcion: 'Pagar electricidad, agua e internet',
      fechaHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tipo: TipoRecordatorio.PERSONAL,
      esRecurrente: true,
      frecuencia: FrecuenciaRecordatorio.MENSUAL,
      estado: EstadoRecordatorio.COMPLETADO,
      minutosAntes: 60,
      lugarId: undefined,
      lugarNombre: undefined,
      creadoPorNombre: 'María',
      tipoDescripcion: 'Personal',
      estadoDescripcion: 'Completado',
      frecuenciaDescripcion: 'Mensual'
    },
    {
      id: 5,
      parejaId: 1,
      creadoPorId: 2,
      titulo: 'Reunión de Trabajo',
      descripcion: 'Presentación del proyecto trimestral',
      fechaHora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tipo: TipoRecordatorio.OTRO,
      esRecurrente: false,
      frecuencia: FrecuenciaRecordatorio.NINGUNA,
      estado: EstadoRecordatorio.CANCELADO,
      minutosAntes: 15,
      lugarId: 4,
      lugarNombre: 'Oficina Central',
      creadoPorNombre: 'Juan',
      tipoDescripcion: 'Otro',
      estadoDescripcion: 'Cancelado',
      frecuenciaDescripcion: 'Ninguna'
    }
  ];

  constructor(private http: HttpClient) {}

  registrar(recordatorio: Recordatorio): Observable<void> {
    // Mock: agregar a la lista local
    const nuevoRecordatorio = { ...recordatorio, id: this.mockRecordatorios.length + 1 };
    this.mockRecordatorios.push(nuevoRecordatorio);
    return of(void 0);
  }

  listar(): Observable<Recordatorio[]> {
    // Mock: devolver datos de prueba
    return of([...this.mockRecordatorios]);
  }

  eliminar(id: number): Observable<void> {
    // Mock: eliminar de la lista local
    this.mockRecordatorios = this.mockRecordatorios.filter(r => r.id !== id);
    return of(void 0);
  }

  modificar(recordatorio: Recordatorio): Observable<void> {
    // Mock: actualizar en la lista local
    const index = this.mockRecordatorios.findIndex(r => r.id === recordatorio.id);
    if (index !== -1) {
      this.mockRecordatorios[index] = { ...recordatorio };
    }
    return of(void 0);
  }

  listarPorId(id: number): Observable<Recordatorio> {
    // Mock: buscar por ID
    const recordatorio = this.mockRecordatorios.find(r => r.id === id);
    if (recordatorio) {
      return of(recordatorio);
    }
    throw new Error('Recordatorio no encontrado');
  }

  listarPorPareja(parejaId: number): Observable<Recordatorio[]> {
    // Mock: filtrar por pareja
    const recordatorios = this.mockRecordatorios.filter(r => r.parejaId === parejaId);
    return of(recordatorios);
  }

  listarActivos(parejaId: number): Observable<Recordatorio[]> {
    // Mock: filtrar por pareja y estado activo
    const recordatorios = this.mockRecordatorios.filter(r => 
      r.parejaId === parejaId && r.estado === EstadoRecordatorio.ACTIVO
    );
    return of(recordatorios);
  }
}
