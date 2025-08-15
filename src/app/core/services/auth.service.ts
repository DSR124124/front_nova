import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as bcrypt from 'bcryptjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from '../models/usuario';

/**
 * IMPORTANTE:
 * - REGISTRO: Las contraseñas se hashean en el frontend con bcrypt antes de enviarlas al backend
 * - LOGIN: Las contraseñas se envían en texto plano para que el backend las compare con el hash almacenado
 * - Esto es necesario porque bcrypt genera hashes diferentes cada vez (salt aleatorio)
 */

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

export interface DecodedToken {
  sub: string;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  idUsuario?: number;
}

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

  // Login con contraseña en texto plano (el backend la compara con el hash almacenado)
  login(credentials: { username: string; password: string }): Observable<any> {
    // NO hashear la contraseña aquí
    // El backend debe recibir la contraseña en texto plano para compararla
    // con el hash bcrypt almacenado usando bcrypt.compare()

    return this.http.post<any>(API_ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password // Contraseña en texto plano
    }).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(error => this.handleError(error))
    );
  }

  // Registro con contraseña hasheada en frontend
  register(usuario: Usuario): Observable<void> {
    // Hashear la contraseña en el frontend con bcrypt
    if (usuario.password) {
      usuario.password = bcrypt.hashSync(usuario.password, 12);
    }

    return this.http.post<void>(API_ENDPOINTS.REGISTER, usuario, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
    return this.currentUserSubject.value;
  }

  // Obtener token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Refresh token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken }).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Recuperación de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }).pipe(
      catchError(this.handleError)
    );
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.VALIDATE_RESET_TOKEN, { token }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
    // NO hashear la contraseña aquí
    // El backend debe recibir la contraseña en texto plano para hashearla
    // y almacenarla correctamente

    return this.http.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      password: password // Contraseña en texto plano
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Información del usuario desde token
  getUsername(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Métodos bcrypt para hashear contraseñas en el frontend (solo para registro)
  hashPassword(password: string): string {
    // Para hashear contraseñas antes de enviarlas al servidor en el registro
    return bcrypt.hashSync(password, 12);
  }

  verifyPassword(password: string, hash: string): boolean {
    // Para verificar contraseñas hasheadas (uso interno/local)
    return bcrypt.compareSync(password, hash);
  }

  // Métodos privados
  private handleAuthentication(response: any): void {
    const token = response.token || response.jwttoken || response.accessToken || response.access_token || response.jwt;
    const refreshToken = response.refreshToken || response.refresh_token;

    if (!token) {
      throw new Error('No se encontró token en la respuesta del servidor');
    }

    localStorage.setItem('accessToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    const user = this.decodeToken(token);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  private loadUserFromToken(): void {
    const token = this.getAccessToken();
    if (token) {
      try {
        const user = this.decodeToken(token);
        if (user && !this.jwtHelper.isTokenExpired(token)) {
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
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400: errorMessage = 'Datos inválidos'; break;
        case 401: errorMessage = 'No autorizado'; break;
        case 403: errorMessage = 'Acceso prohibido'; break;
        case 404: errorMessage = 'Endpoint no encontrado'; break;
        case 409: errorMessage = 'Usuario o email ya existe'; break;
        case 422: errorMessage = 'Datos de validación incorrectos'; break;
        case 500: errorMessage = 'Error interno del servidor'; break;
        case 0: errorMessage = 'Error de conexión'; break;
        default: errorMessage = error.error?.message || error.statusText || `Error ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
