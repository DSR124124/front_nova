export type TipoMultimedia = 'FOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENTO';

export interface Multimedia {
  id?: number;
  citaId: number;
  autorId: number;
  url: string;
  tipo: TipoMultimedia;
  descripcion?: string;
  fechaSubida?: string; // ISO string para LocalDateTime
  autorNombre?: string;
  citaTitulo?: string;
}
