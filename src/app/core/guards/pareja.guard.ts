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

  // Verificar si el usuario está autenticado
  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const user = authService.getUser();

  if (!user || !user.username) {
    router.navigate(['/auth/login']);
    return false;
  }

  return usuarioService.listarPorUsername(user.username).pipe(
    map(usuario => {
      if (usuario && usuario.parejaId) {
        return true;
      } else {
        // Redirigir a crear pareja si no tiene una
        router.navigate(['/pareja/crear']);
        return false;
      }
    }),
    catchError((error) => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
