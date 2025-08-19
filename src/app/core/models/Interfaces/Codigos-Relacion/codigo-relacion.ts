// ===== ENUMS =====

/**
 * Estado del código de relación
 */
export enum EstadoCodigoRelacion {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EXPIRADO = 'expirado',
  USADO = 'usado'
}

/**
 * Tipo de código de relación
 */
export enum TipoCodigoRelacion {
  INVITACION = 'invitacion',
  EMPAREJAMIENTO = 'emparejamiento',
  TEMPORAL = 'temporal'
}

// ===== INTERFACES PRINCIPALES =====

/**
 * Modelo principal de código de relación
 * Coincide con CodigoRelacionDTO del backend Java
 */
export interface CodigoRelacion {
  id?: number;
  codigo: string;
  usuarioId: number;
  usuarioUsername: string;
  usuarioNombre: string;
  fechaGeneracion: string; // ISO string
  fechaExpiracion?: string; // ISO string
  usado: boolean;
  activo: boolean;
  tipo?: TipoCodigoRelacion;
  estado?: EstadoCodigoRelacion;
}

// ===== INTERFACES PARA RESPUESTAS =====

export interface CodigoRelacionResponseDTO {
  codigo: string;
  usuario: {
    id: number;
    username: string;
    nombre: string;
  };
  fechaGeneracion: string;
}

export interface ValidacionCodigoResponseDTO {
  codigo: string;
  usuario: {
    id: number;
    username: string;
    nombre: string;
    fotoPerfil?: string;
  };
  disponibleParaPareja: boolean;
}

export interface CodigoRelacionUsuarioDTO {
  codigo: string;
  usuario: {
    id: number;
    username: string;
    nombre: string;
  };
  disponibleParaPareja: boolean;
}

// ===== INTERFACES PARA PETICIONES =====

export interface CodigoRelacionDTO {
  idUsuario: number;
}
