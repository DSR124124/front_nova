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
  const user = authService.getUser();
  if (!user || !user.username) {
    router.navigate(['/login']);
    return false;
  }
  return usuarioService.listarPorUsername(user.username).pipe(
    map(usuario => {
      if (usuario && usuario.parejaId) {
        return true;
      } else {
        router.navigate(['/pareja/crear']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
