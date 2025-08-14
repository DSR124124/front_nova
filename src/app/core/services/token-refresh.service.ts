import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {
  private refreshInterval: any;
  private readonly REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutos

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.startTokenRefresh();
  }

  startTokenRefresh(): void {
    // Limpiar intervalo existente
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Configurar refresh automático
    this.refreshInterval = setInterval(() => {
      this.refreshTokenIfNeeded();
    }, this.REFRESH_INTERVAL);
  }

  stopTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  private refreshTokenIfNeeded(): void {
    if (this.authService.isLoggedIn() && this.authService.isTokenExpired()) {
      this.authService.refreshToken().subscribe({
        next: (token) => {
          console.log('Token refrescado automáticamente');
        },
        error: (error) => {
          console.error('Error al refrescar token:', error);
          this.authService.logout();
        }
      });
    }
  }

  // Método para refrescar token manualmente
  refreshTokenNow(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken().subscribe({
        next: (token) => {
          console.log('Token refrescado manualmente');
        },
        error: (error) => {
          console.error('Error al refrescar token:', error);
          this.authService.logout();
        }
      });
    }
  }

  // Método para verificar y refrescar token antes de una operación importante
  ensureValidToken(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.authService.isLoggedIn()) {
        resolve(false);
        return;
      }

      if (this.authService.isTokenExpired()) {
        this.authService.refreshToken().subscribe({
          next: (token) => {
            resolve(true);
          },
          error: (error) => {
            console.error('Error al refrescar token:', error);
            this.authService.logout();
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    });
  }
}
