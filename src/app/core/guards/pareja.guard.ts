import { CanActivateFn } from '@angular/router';

export const parejaGuard: CanActivateFn = (route, state) => {
  return true;
};
