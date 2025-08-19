
export enum TipoPrivacidad {
  PRIVADA = 'PRIVADA',
  COMPARTIDA = 'COMPARTIDA',
}

export interface Nota {
  id?: number;
  autorId: number;
  citaId: number;
  contenido: string;
  fechaCreacion?: string; // ISO string para LocalDateTime
  privacidad: TipoPrivacidad;
  autorNombre?: string;
  citaTitulo?: string;
  privacidadDescripcion?: string;
}
