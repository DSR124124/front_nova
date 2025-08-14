export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export const RoleLabels: Record<Role, string> = {
  [Role.USER]: 'Usuario',
  [Role.ADMIN]: 'Administrador'
};

export const RoleDescriptions: Record<Role, string> = {
  [Role.USER]: 'Usuario regular de la aplicación',
  [Role.ADMIN]: 'Administrador con acceso completo al sistema'
};
