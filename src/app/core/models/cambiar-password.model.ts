export interface CambiarPasswordRequest {
  idUsuario: number;
  passwordActual: string;      // Contraseña actual en texto plano
  passwordNueva: string;       // Nueva contraseña en texto plano
  passwordConfirmacion: string; // Confirmación de nueva contraseña en texto plano
}

export interface CambiarPasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

export interface CambiarPasswordError {
  error: string;
  message: string;
  errors?: {
    passwordActual?: string;
    passwordNueva?: string;
    passwordConfirmacion?: string;
  };
  timestamp: string;
  status: number;
}
