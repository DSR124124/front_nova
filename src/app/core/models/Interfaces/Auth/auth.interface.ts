// Interfaces para autenticación y gestión de contraseñas

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: Date;
  genero?: string;
  telefono?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface CambioPasswordDTO {
  idUsuario: number;
  passwordActual: string;
  passwordNueva: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface DecodedToken {
  sub: string;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
// Interfaces para respuestas de cambio de contraseña
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
