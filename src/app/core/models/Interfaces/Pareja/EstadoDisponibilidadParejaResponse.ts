import { MensajeErrorDTO } from "../Mensaje/mensaje-error";
import { UsuarioPareja } from "../Usuario/Usuario";

export interface EstadoDisponibilidadParejaResponse extends MensajeErrorDTO<PData> {
  p_menserror: null;
  p_mensavis: string;
  p_exito: boolean;
  p_data: PData;
}

export interface PData {
  codigoRelacion: string;
  disponibleParaPareja: boolean;
  usuario: UsuarioPareja;
}

