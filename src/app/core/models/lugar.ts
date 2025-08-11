export enum CategoriaLugar {
  RESTAURANTE = 'RESTAURANTE',
  PARQUE = 'PARQUE',
  CINE = 'CINE',
  CASA = 'CASA',
  OTRO = 'OTRO',
}

export interface Lugar {
  id?: number;
  nombre: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  descripcion?: string;
  categoria?: CategoriaLugar;
  ratingPromedio?: number;
  vecesVisitado?: number;
  esFavorito?: boolean;
  categoriaIcono?: string;
  categoriaNombre?: string;
}
