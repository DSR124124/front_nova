export enum EstadoPareja {
  ACTIVA = 'activa',
  PAUSADA = 'pausada',
  TERMINADA = 'terminada',
}

export interface Pareja {
  id?: number;
  usuario1Id: number;
  usuario2Id: number;
  fechaCreacion?: string; // ISO string
  estadoRelacion?: EstadoPareja;
  usuario1Nombre?: string;
  usuario2Nombre?: string;
}
