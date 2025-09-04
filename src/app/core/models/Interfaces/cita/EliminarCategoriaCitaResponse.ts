import { Mensaje } from "../Mensaje/mensaje-error";

export interface EliminarCategoriaCitaResponse extends Mensaje<PData> {
  p_data: PData;
}

export interface PData {
  id: number;
}
