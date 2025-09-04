import { Mensaje } from "../Mensaje/mensaje-error";
import { CategoriaCita } from "./CategoriaCita";

export interface ListarCategoriaCitaResponse extends Mensaje<PData> {
  p_data: PData;
}

export interface PData {
  categorias: CategoriaCita[];
  total:      number;
}

