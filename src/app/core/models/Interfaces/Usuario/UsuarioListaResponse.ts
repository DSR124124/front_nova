import { UsuarioResponse } from "./UsuarioResponse";
import { Mensaje } from "../Mensaje/mensaje-error";


export interface UsuarioListaResponse extends Mensaje<PData> {
  p_menserror: null;
  p_mensavis:  string;
  p_exito:     boolean;
  p_data:      PData;
}

export interface PData {
  usuarios: UsuarioResponse[];
  total:    number;
}
