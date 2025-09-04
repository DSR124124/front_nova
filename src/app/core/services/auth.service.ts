import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { JWT_CONSTANTS } from '../constants/jwt.constants';
import { UsuarioResponse } from '../models/Interfaces/Usuario/UsuarioResponse';
import { Usuario } from '../models/Interfaces/Usuario/Usuario';
import { DecodedToken, CambioPasswordDTO, CambiarPasswordResponse, CambiarPasswordError } from '../models/Interfaces/Auth/auth.interface';
import { Mensaje } from '../models/Interfaces/Mensaje/mensaje-error';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromToken();
  }

  // Login - devuelve respuesta completa del backend
  login(credentials: { username: string; password: string }): Observable<Mensaje<{token: string, refreshToken: string, usuario: Usuario}>> {
    return this.http.post<Mensaje<{token: string, refreshToken: string, usuario: Usuario}>>(API_ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password
    });
  }


  // Registro - devuelve respuesta completa del backend
  register(usuario: Usuario): Observable<Mensaje<{usuario: Usuario}>> {
    // No hasheamos la contraseña aquí, el backend se encarga de eso
    return this.http.post<Mensaje<{usuario: Usuario}>>(API_ENDPOINTS.REGISTER, usuario, {
      headers: new HttpHeaders({ 'Content-Type': JWT_CONSTANTS.CONTENT_TYPE })
    });
  }


  // Logout
  logout(): void {
    localStorage.removeItem(JWT_CONSTANTS.ACCESS_TOKEN_KEY);
    localStorage.removeItem(JWT_CONSTANTS.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Verificar autenticación
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

    // Obtener usuario actual
  getUser(): any {
    // Si no hay usuario en el subject, intentar obtenerlo del token
    let user = this.currentUserSubject.value;

    if (!user) {
      const token = this.getAccessToken();
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        try {
          user = this.decodeToken(token);
          if (user) {
            // Asegurarse de que el username esté disponible
            if (user.sub && !user.username) {
              user.username = user.sub;
            }
            // Actualizar el subject con el usuario del token
            this.currentUserSubject.next(user);
          }
        } catch (error) {
          console.error('Error decodificando token:', error);
        }
      }
    } else {
      // Asegurarse de que el usuario actual tenga username
      if (user.sub && !user.username) {
        user.username = user.sub;
        // Actualizar el subject
        this.currentUserSubject.next(user);
      }
    }

    return user;
  }

  // Obtener token
  getAccessToken(): string | null {
    return localStorage.getItem(JWT_CONSTANTS.ACCESS_TOKEN_KEY);
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(JWT_CONSTANTS.REFRESH_TOKEN_KEY);
  }

  // Refresh token - devuelve respuesta completa del backend
  refreshToken(): Observable<Mensaje<{token: string, refreshToken: string}>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<Mensaje<{token: string, refreshToken: string}>>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken: refreshToken
    });
  }


  // Recuperación de contraseña - devuelve respuesta completa del backend
  forgotPassword(email: string): Observable<Mensaje<{message: string}>> {
    return this.http.post<Mensaje<{message: string}>>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  validateResetToken(token: string): Observable<Mensaje<{valid: boolean}>> {
    return this.http.post<Mensaje<{valid: boolean}>>(API_ENDPOINTS.VALIDATE_RESET_TOKEN, { token });
  }

  resetPassword(token: string, password: string): Observable<Mensaje<{message: string}>> {
    return this.http.post<Mensaje<{message: string}>>(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      password: password
    });
  }


  // Cambiar contraseña del usuario autenticado
  changePassword(passwordData: CambioPasswordDTO): Observable<CambiarPasswordResponse | CambiarPasswordError> {
    return this.http.put<CambiarPasswordResponse | CambiarPasswordError>(API_ENDPOINTS.CHANGE_PASSWORD, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  // Información del usuario desde token
  getUsername(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    // Usar username si existe, sino usar sub como fallback
    return decoded?.username ?? decoded?.sub ?? null;
  }

  getUserId(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.idUsuario ?? null;
  }

  getRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role;
  }

  // Verificación de roles
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // Headers de autenticación
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Content-Type': JWT_CONSTANTS.CONTENT_TYPE,
      [JWT_CONSTANTS.AUTHORIZATION_HEADER]: `${JWT_CONSTANTS.BEARER_PREFIX}${token}`
    });
  }

  // Métodos helper simplificados (sin ResponseHandlerService)
  loginUsuario(credentials: { username: string; password: string }): Observable<Usuario> {
    return new Observable(subscriber => {
      this.login(credentials).subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data) {
            this.handleAuthentication({
              accessToken: response.p_data.token,
              refreshToken: response.p_data.refreshToken,
              user: response.p_data.usuario
            });
            subscriber.next(response.p_data.usuario);
            subscriber.complete();
          } else {
            subscriber.error(new Error(response.p_menserror || 'Error al iniciar sesión'));
          }
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return new Observable(subscriber => {
      this.register(usuario).subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data?.usuario) {
            subscriber.next(response.p_data.usuario);
            subscriber.complete();
          } else {
            subscriber.error(new Error(response.p_menserror || 'Error al registrar usuario'));
          }
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  // Métodos privados
  private handleAuthentication(response: any): void {
    const token = response.token || response.jwttoken || response.accessToken || response.access_token || response.jwt;
    const refreshToken = response.refreshToken || response.refresh_token;

    if (!token) {
      throw new Error('No se encontró token en la respuesta del servidor');
    }

    localStorage.setItem(JWT_CONSTANTS.ACCESS_TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(JWT_CONSTANTS.REFRESH_TOKEN_KEY, refreshToken);
    }

    const user = this.decodeToken(token);
    if (user) {
      // Asegurarse de que el username esté disponible
      if (user.sub && !user.username) {
        user.username = user.sub;
      }
      this.currentUserSubject.next(user);
    }
  }

  private loadUserFromToken(): void {
    const token = this.getAccessToken();
    if (token) {
      try {
        const user = this.decodeToken(token);
        if (user && !this.jwtHelper.isTokenExpired(token)) {
          // Asegurarse de que el username esté disponible
          if (user.sub && !user.username) {
            user.username = user.sub;
          }
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

    private decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token);

      // Mapear el campo 'sub' a 'username' si no existe
      if (decoded && decoded.sub && !decoded.username) {
        decoded.username = decoded.sub;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }
}
