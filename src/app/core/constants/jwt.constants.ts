export const JWT_CONSTANTS = {
  // Nombres de las claves en localStorage
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',

  // Tiempo de expiración (en segundos)
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutos
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 días

  // Tiempo antes de expirar para refrescar (en segundos)
  REFRESH_THRESHOLD: 5 * 60, // 5 minutos

  // Intervalo de refresh automático (en milisegundos)
  AUTO_REFRESH_INTERVAL: 14 * 60 * 1000, // 14 minutos

  // Headers HTTP
  AUTHORIZATION_HEADER: 'Authorization',
  BEARER_PREFIX: 'Bearer ',

  // Tipos de contenido
  CONTENT_TYPE: 'application/json',

  // Endpoints de autenticación
  AUTH_ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    REFRESH: '/refresh-token',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  }
};

export const JWT_ERROR_MESSAGES = {
  TOKEN_EXPIRED: 'El token ha expirado. Por favor, inicie sesión nuevamente.',
  INVALID_TOKEN: 'Token inválido. Por favor, inicie sesión nuevamente.',
  REFRESH_FAILED: 'Error al refrescar el token. Por favor, inicie sesión nuevamente.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicie sesión nuevamente.',
  FORBIDDEN: 'Acceso denegado. No tiene permisos para esta acción.',
  NETWORK_ERROR: 'Error de conexión. Por favor, verifique su conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Por favor, intente más tarde.'
};

export const JWT_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente.',
  TOKEN_REFRESHED: 'Token refrescado exitosamente.',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente.',
  PASSWORD_RESET: 'Contraseña restablecida exitosamente.'
};
