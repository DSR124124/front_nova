import { Mensaje } from "../Mensaje/mensaje-error";
import { CategoriaCita } from "./CategoriaCita";

export interface CategoriaByIdResponse extends Mensaje<PData> {
  p_data: PData;
}

export interface PData {
  categoriaCita: CategoriaCita ;
}


