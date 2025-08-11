export enum EstadoCita {
  PLANIFICADA = 'PLANIFICADA',
  REALIZADA = 'REALIZADA',
  CANCELADA = 'CANCELADA',
}

export interface Cita {
  id?: number;
  parejaId: number;
  lugarId: number;
  categoriaId?: number;
  titulo: string;
  descripcion?: string;
  fecha: string; // ISO string para LocalDateTime
  estado?: EstadoCita;
  rating?: number;
  lugarNombre?: string;
  categoriaNombre?: string;
  estadoDescripcion?: string;
}
