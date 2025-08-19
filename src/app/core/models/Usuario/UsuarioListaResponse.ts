import { UsuarioResponse } from "./UsuarioResponse";
import { MensajeErrorDTO } from "../mensaje-error";


export interface UsuarioListaResponse extends MensajeErrorDTO<PData> {
  p_menserror: null;
  p_mensavis:  string;
  p_exito:     boolean;
  p_data:      PData;
}

export interface PData {
  usuarios: UsuarioResponse[];
  total:    number;
}
