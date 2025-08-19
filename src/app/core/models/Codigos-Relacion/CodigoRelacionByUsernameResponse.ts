import { MensajeErrorDTO } from "../mensaje-error";
import { UsuarioByCodigoRelacion } from "../Usuario/Usuario";

export interface CodigoRelacionByUsernameResponse extends MensajeErrorDTO<PData> {
  p_menserror: null;
  p_mensavis:  string;
  p_exito:     boolean;
  p_data:      PData;
}

export interface PData {
  usuario:         UsuarioByCodigoRelacion;
  codigo:          string;
  fechaGeneracion: Date;
}


