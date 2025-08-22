import { MensajeErrorDTO } from "../Mensaje/mensaje-error";

export interface EliminarCategoriaCitaResponse extends MensajeErrorDTO<PData> {
  p_data: PData;
}

export interface PData {
  id: number;
}
