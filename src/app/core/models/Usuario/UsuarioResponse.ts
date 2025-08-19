import { MensajeErrorDTO } from '../mensaje-error';
import { Usuario } from './Usuario';

export interface UsuarioResponse extends MensajeErrorDTO<PData> {
  p_menserror: null;
  p_mensavis:  string;
  p_exito:     boolean;
  p_data:      PData;
}

// Interfaz para los datos de la respuesta
export interface PData {
  usuario: Usuario;
}
