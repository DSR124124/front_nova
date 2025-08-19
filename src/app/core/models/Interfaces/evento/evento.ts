export interface Evento {
  id?: number;
  parejaId: number;
  titulo: string;
  descripcion?: string;
  fecha: string; // ISO string para LocalDate
  tipo?: string;
  lugarId?: number;
  lugarNombre?: string;
}
