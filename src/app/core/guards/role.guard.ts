import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums/role.enum';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const user = authService.getUser();

  if (!user || !user.role) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as Role[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene el rol requerido
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  } else {
    // Redirigir a la ruta principal según el rol si no tiene permisos
    if (user.role === 'ADMIN') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/user']);
    }
    return false;
  }
};
