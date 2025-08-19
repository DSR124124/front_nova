import { MensajeErrorDTO } from "../Mensaje/mensaje-error";
import { UsuarioByCodigoRelacion } from "../Usuario/Usuario";

export interface CodigoRelacionObtenidoResponse extends MensajeErrorDTO<PData> {
  p_menserror: null;
  p_mensavis:  string;
  p_exito:     boolean;
  p_data:      PData;
}

export interface PData {
  usuario:              UsuarioByCodigoRelacion;
  disponibleParaPareja: boolean;
  codigo:               string;
}

