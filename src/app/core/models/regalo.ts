export type TipoMultimedia = 'FOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENTO';

export interface DetalleRegalo {
  id?: number;
  remitenteId: number;
  receptorId: number;
  parejaId: number;
  titulo: string;
  descripcion?: string;
  fecha: string; // ISO string para LocalDateTime
  citaId?: number;
  eventoId?: number;
  urlMultimedia?: string;
  tipoMultimedia?: TipoMultimedia;
  remitenteNombre?: string;
  receptorNombre?: string;
  citaTitulo?: string;
  eventoTitulo?: string;
}
