export interface Mensaje<T = any> {
  p_menserror: string | null;
  p_mensavis: string;
  p_exito: boolean;
  p_data: T;
}
