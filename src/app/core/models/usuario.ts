import { Role } from './enums/role.enum';

// Interfaz única de Usuario - coincide con UsuarioDTO del backend Java
export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  username: string;
  password: string;
  enabled: boolean;
  fotoPerfil?: string;
  fechaNacimiento?: string; // LocalDate en Java se convierte a string
  genero?: string; // M, F, O
  role: Role;
  codigoRelacion?: string;
  disponibleParaPareja: boolean;
}




