import { environment } from '../../../environments/environment';

// Función helper para construir URLs
const buildUrl = (path: string): string => `${environment.base}${path}`;

export const API_ENDPOINTS = {
  // ===== AUTENTICACIÓN =====
  LOGIN: buildUrl('/login'), // Verificar si es /login o /usuarios/login
  REGISTER: buildUrl('/usuarios/registrar'), // ✅ Confirmado funcionando
  REFRESH_TOKEN: buildUrl('/refresh-token'), // Verificar si existe
  FORGOT_PASSWORD: buildUrl('/forgot-password'), // Verificar si existe
  VALIDATE_RESET_TOKEN: buildUrl('/validate-reset-token'), // Verificar si existe
  RESET_PASSWORD: buildUrl('/reset-password'), // Verificar si existe
  CHANGE_PASSWORD: buildUrl('/usuarios/cambiar-password'), // ✅ Confirmado funcionando
  LOGOUT: buildUrl('/logout'), // Verificar si existe

  // ===== GESTIÓN DE USUARIOS =====
  USUARIOS: buildUrl('/usuarios'), // ✅ Base URL para todos los endpoints de usuarios

  // ===== RELACIONES Y PAREJAS =====
  PAREJAS: buildUrl('/parejas'),
  CODIGOS_RELACION: buildUrl('/codigos-relacion'),

  // ===== FUNCIONALIDADES PRINCIPALES =====
  CITAS: buildUrl('/citas'),
  EVENTOS: buildUrl('/eventos'),
  REGALOS: buildUrl('/regalos'),
  RECORDATORIOS: buildUrl('/recordatorios'),
  NOTAS: buildUrl('/notas'),
  MENSAJES: buildUrl('/mensajes'),
  MULTIMEDIA: buildUrl('/multimedia'),
  LUGARES: buildUrl('/lugares'),
  CATEGORIAS_CITA: buildUrl('/categorias-cita'),

  // ===== ADMINISTRACIÓN =====
  ADMIN_USERS: buildUrl('/admin/usuarios'),
  ADMIN_STATS: buildUrl('/admin/estadisticas'),
};

// ===== FUNCIONES UTILITARIAS =====
export const ApiUtils = {
  // Construir URL con parámetros de consulta
  buildQueryUrl: (baseUrl: string, params: Record<string, any>): string => {
    const url = new URL(baseUrl, environment.base);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  },

  // Construir URL con parámetros de ruta
  buildPathUrl: (baseUrl: string, ...pathParams: (string | number)[]): string => {
    return `${baseUrl}/${pathParams.join('/')}`;
  },

  // Validar si un endpoint está disponible
  isEndpointAvailable: (endpoint: string): boolean => {
    return Boolean(endpoint && endpoint !== 'undefined' && endpoint !== 'null');
  },

  // Obtener URL base de la API
  getBaseUrl: (): string => environment.base,
};
