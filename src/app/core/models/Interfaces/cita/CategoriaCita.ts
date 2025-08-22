export interface CategoriaCita {
  id:                number;
  nombre:            string;
  descripcion:       string;
  color:             string;
  icono:             string;
  activo:            boolean;
  orden:             number;
  fechaCreacion:     Date;
  fechaModificacion: Date;
  totalCitas:        number;
}
