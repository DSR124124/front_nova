import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums/role.enum';

function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.role) return false;
  const requiredRoles = route.data['roles'] as Role[];
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(decoded.role);
};
