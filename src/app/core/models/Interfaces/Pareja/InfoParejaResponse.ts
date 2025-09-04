import { Mensaje } from "../Mensaje/mensaje-error";
import { UsuarioPareja } from "../Usuario/Usuario";

export interface InfoParejaResponse extends Mensaje<PData> {
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
}


