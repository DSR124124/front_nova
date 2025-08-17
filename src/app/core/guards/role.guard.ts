import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const user = authService.getUser();
  if (!user || !user.role) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  } else {
    // Solo redirigir si estamos en una ruta que no coincide con el rol del usuario
    // y no estamos ya en una ruta válida para ese rol
    const currentUrl = state.url;

    if (user.role === 'ADMIN' && !currentUrl.startsWith('/admin')) {
      router.navigate(['/admin']);
    } else if (user.role === 'USER' && !currentUrl.startsWith('/user')) {
      router.navigate(['/user']);
    }
    return false;
  }
};
