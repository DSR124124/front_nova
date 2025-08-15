import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${environment.base}/login`,
  REGISTER: `${environment.base}/usuarios/registrar`, // Corregido para coincidir con el backend
  REFRESH_TOKEN: `${environment.base}/refresh-token`,
  FORGOT_PASSWORD: `${environment.base}/forgot-password`,
  VALIDATE_RESET_TOKEN: `${environment.base}/validate-reset-token`,
  RESET_PASSWORD: `${environment.base}/reset-password`,
  LOGOUT: `${environment.base}/logout`,

  // User management
  USUARIOS: `${environment.base}/usuarios`,
  PAREJAS: `${environment.base}/parejas`,

  // Core features
  CITAS: `${environment.base}/citas`,
  EVENTOS: `${environment.base}/eventos`,
  REGALOS: `${environment.base}/regalos`,
  RECORDATORIOS: `${environment.base}/recordatorios`,
  NOTAS: `${environment.base}/notas`,
  MENSAJES: `${environment.base}/mensajes`,
  MULTIMEDIA: `${environment.base}/multimedia`,
  LUGARES: `${environment.base}/lugares`,

  // Admin endpoints
  ADMIN_USERS: `${environment.base}/admin/usuarios`,
  ADMIN_STATS: `${environment.base}/admin/estadisticas`,

  // Agrega más endpoints según tu backend
};
