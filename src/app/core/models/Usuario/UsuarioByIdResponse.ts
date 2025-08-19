import { MensajeErrorDTO } from '../mensaje-error';
import { Usuario } from './Usuario';

// Interfaz para la respuesta del endpoint /usuarios/listar-por-id/{id}
export interface UsuarioByIdResponse extends MensajeErrorDTO<UsuarioByIdData> {
  p_menserror: null;
  p_mensavis: string;
  p_exito: boolean;
  p_data: UsuarioByIdData;
}

// Interfaz para los datos de la respuesta
export interface UsuarioByIdData {
  usuario: Usuario;
}




