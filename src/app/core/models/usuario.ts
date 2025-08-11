import { Role } from './role.enum';

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  username: string;
  password: string;
  enabled: boolean;
  fotoPerfil?: string;
  fechaNacimiento?: string; // ISO string, para interoperabilidad con LocalDate
  genero?: 'M' | 'F' | 'O';
  role: Role;
}
