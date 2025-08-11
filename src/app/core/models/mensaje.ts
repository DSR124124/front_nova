export enum EstadoMensaje {
  ENVIADO = 'enviado',
  LEIDO = 'leido',
  ELIMINADO = 'eliminado',
}

export interface Mensaje {
  id?: number;
  parejaId: number;
  remitenteId: number;
  contenido: string;
  fechaEnvio?: string; // ISO string para LocalDateTime
  estado?: EstadoMensaje;
  remitenteNombre?: string;
}
