// Interfaz para el RolDTO del backend
export interface RolDTO {
  id?: number;
  rol: string; // "ADMIN" o "USER"
}

// Constantes para los roles válidos
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  username: string;
  password?: string;
  enabled: boolean;
  fotoPerfil?: string;
  fechaNacimiento?: string; // Cambiado a string para coincidir con el backend
  genero?: string;
  role: { id: number; rol: string }; // Cambiado a objeto para coincidir con el backend
  // Campos adicionales que podrías necesitar
  fechaCreacion?: Date;
  fechaUltimoAcceso?: Date;
  parejaId?: number;
  pareja?: Usuario;
  preferencias?: PreferenciasUsuario;
}

export interface PreferenciasUsuario {
  id?: number;
  usuarioId: number;
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  notificacionesSMS: boolean;
  idioma: string;
  zonaHoraria: string;
  tema: string;
  privacidad: string;
}

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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
