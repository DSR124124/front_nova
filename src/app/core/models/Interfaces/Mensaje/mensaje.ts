import { EstadoMensaje } from "../../enums/estado-mensaje.enum";
export interface Mensaje {
  id?: number;
  parejaId: number;
  remitenteId: number;
  contenido: string;
  fechaEnvio?: string; // ISO string para LocalDateTime
  estado?: EstadoMensaje;
  remitenteNombre?: string;
}
