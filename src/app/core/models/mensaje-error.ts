export interface MensajeErrorDTO<T = any> {
  p_menserror: string | null;
  p_mensavis: string;
  p_exito: boolean;
  p_data: T;
}

export interface CambioPasswordDTO {
  idUsuario: number;
  passwordActual: string;
  passwordNueva: string;
}

export interface CodigoRelacionDTO {
  idUsuario: number;
}
