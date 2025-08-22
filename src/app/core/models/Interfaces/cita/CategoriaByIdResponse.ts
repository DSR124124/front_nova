import { MensajeErrorDTO } from "../Mensaje/mensaje-error";
import { CategoriaCita } from "./CategoriaCita";

export interface CategoriaByIdResponse extends MensajeErrorDTO<PData> {
  p_data: PData;
}

export interface PData {
  categoriaCita: CategoriaCita ;
}


