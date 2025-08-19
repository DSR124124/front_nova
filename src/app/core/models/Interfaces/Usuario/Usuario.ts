import { Role } from "../../enums/role.enum";

export interface UsuarioByCodigoRelacion {
  nombre:   string;
  id:       number;
  username: string;
}

export interface Usuario {
  idUsuario:            number;
  nombre:               string;
  apellido:             string;
  correo:               string;
  username:             string;
  password:             string;
  enabled:              boolean;
  fotoPerfil:           string | null;
  fechaNacimiento:      string;
  genero:               string;
  role:                 Role;
  codigoRelacion:       string | null;
  disponibleParaPareja: boolean;
}
