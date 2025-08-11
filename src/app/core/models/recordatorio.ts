export enum TipoRecordatorio {
  PERSONAL = 'PERSONAL',
  PAREJA = 'PAREJA',
  OTRO = 'OTRO',
}

export enum FrecuenciaRecordatorio {
  NINGUNA = 'NINGUNA',
  DIARIA = 'DIARIA',
  SEMANAL = 'SEMANAL',
  MENSUAL = 'MENSUAL',
  ANUAL = 'ANUAL',
}

export enum EstadoRecordatorio {
  ACTIVO = 'ACTIVO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export interface Recordatorio {
  id?: number;
  parejaId: number;
  creadoPorId: number;
  titulo: string;
  descripcion?: string;
  fechaHora: string; // ISO string para LocalDateTime
  tipo: TipoRecordatorio;
  esRecurrente?: boolean;
  frecuencia?: FrecuenciaRecordatorio;
  estado?: EstadoRecordatorio;
  minutosAntes?: number;
  lugarId?: number;
  creadoPorNombre?: string;
  lugarNombre?: string;
  tipoDescripcion?: string;
  estadoDescripcion?: string;
  frecuenciaDescripcion?: string;
}
