import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const parejaGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const user = authService.getUser();
  if (!user || !user.username) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Usar el método helper que extrae solo los datos
  return usuarioService.obtenerUsuarioPorUsername(user.username).pipe(
    map((usuario: any) => {
      // Verificar si el usuario tiene pareja usando el código de relación
      if (usuario && usuario.codigoRelacion) {
        return true;
      } else {
        router.navigate(['/pareja/crear']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
