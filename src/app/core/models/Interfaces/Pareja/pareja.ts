import { EstadoPareja } from "../../enums/estado-pareja.enum";

export interface Pareja {
  id?: number;
  usuario1Id: number;
  usuario2Id: number;
  fechaCreacion?: string; // ISO string
  estadoRelacion?: EstadoPareja;
  usuario1Nombre?: string;
  usuario2Nombre?: string;
}
