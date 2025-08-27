import { MensajeErrorDTO } from "../Mensaje/mensaje-error";
import { UsuarioPareja } from "../Usuario/Usuario";

export interface ParejaUnirCodigosResponse extends MensajeErrorDTO<PData> {
  p_menserror: null;
  p_mensavis: string;
  p_exito: boolean;
  p_data: PData;
}

export interface PData {
  pareja: Pareja;
  usuario1: UsuarioPareja;
  usuario2: UsuarioPareja;
}

export interface Pareja {
  id: number;
  usuario1Id?: number;
  usuario2Id?: number;
  fechaCreacion?: string;
  estadoRelacion?: string;
  usuario1Nombre?: string;
  usuario2Nombre?: string;
}


