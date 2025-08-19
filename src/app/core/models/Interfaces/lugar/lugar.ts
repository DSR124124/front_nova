import { CategoriaLugar } from '../../enums/categoria-lugar.enum';

export interface Lugar {
  id?: number;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  categoria?: CategoriaLugar;
  rating?: number;
  precio?: string;
  horario?: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  coordenadas?: { lat: number; lng: number };
  latitud?: number;
  longitud?: number;
  imagenes?: string[];
  servicios?: string[];
  esFavorito?: boolean;
  esVerificado?: boolean;
  ratingPromedio?: number;
  vecesVisitado?: number;
  categoriaIcono?: string;
  categoriaNombre?: string;
}
