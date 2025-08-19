import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, map, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as bcrypt from 'bcryptjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { JWT_CONSTANTS } from '../constants/jwt.constants';
import { Usuario } from '../models/usuario';
import { DecodedToken } from '../models/auth.interface';
import { MensajeErrorDTO } from '../models/mensaje-error';
import { ResponseHandlerService } from './response-handler.service';
// Interfaces locales para el auth service
interface CambiarPasswordRequest {
  idUsuario: number;
  passwordActual: string;
  passwordNueva: string;
  passwordConfirmacion: string;
}

interface CambiarPasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

interface CambiarPasswordError {
  error: string;
  message: string;
  errors?: {
    passwordActual?: string;
    passwordNueva?: string;
    passwordConfirmacion?: string;
  };
  timestamp: string;
  status: number;
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
    private router: Router,
    private responseHandler: ResponseHandlerService
  ) {
    this.loadUserFromToken();
  }

  // Login - devuelve respuesta completa del backend
  login(credentials: { username: string; password: string }): Observable<MensajeErrorDTO<{token: string, refreshToken: string, usuario: Usuario}>> {
    return this.http.post<MensajeErrorDTO<{token: string, refreshToken: string, usuario: Usuario}>>(API_ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password
    });
  }

  // Método helper para login que maneja autenticación automáticamente
  loginUsuario(credentials: { username: string; password: string }): Observable<Usuario> {
    return this.login(credentials).pipe(
      map(response => {
        const data = this.responseHandler.extractData(response);
        this.handleAuthentication({
          accessToken: data.token,
          refreshToken: data.refreshToken,
          user: data.usuario
        });
        return data.usuario;
      }),
      catchError(error => this.responseHandler.handleError({ p_exito: false, p_menserror: error.message, p_mensavis: '', p_data: {} }))
    );
  }

  // Registro - devuelve respuesta completa del backend
  register(usuario: Usuario): Observable<MensajeErrorDTO<{usuario: Usuario}>> {
    // No hasheamos la contraseña aquí, el backend se encarga de eso
    return this.http.post<MensajeErrorDTO<{usuario: Usuario}>>(API_ENDPOINTS.REGISTER, usuario, {
      headers: new HttpHeaders({ 'Content-Type': JWT_CONSTANTS.CONTENT_TYPE })
    });
  }

  // Método helper para registro que extrae solo los datos
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.register(usuario).pipe(
      map(response => this.responseHandler.extractData(response).usuario),
      catchError(error => this.responseHandler.handleError({ p_exito: false, p_menserror: error.message, p_mensavis: '', p_data: {} }))
    );
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
    return this.currentUserSubject.value;
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
  refreshToken(): Observable<MensajeErrorDTO<{token: string, refreshToken: string}>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<MensajeErrorDTO<{token: string, refreshToken: string}>>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken: refreshToken
    });
  }

  // Método helper para refresh token
  renovarToken(): Observable<string> {
    return this.refreshToken().pipe(
      map(response => {
        const data = this.responseHandler.extractData(response);
        this.handleAuthentication({
          accessToken: data.token,
          refreshToken: data.refreshToken
        });
        return data.token;
      }),
      catchError(error => this.responseHandler.handleError({ p_exito: false, p_menserror: error.message, p_mensavis: '', p_data: {} }))
    );
  }

  // Recuperación de contraseña - devuelve respuesta completa del backend
  forgotPassword(email: string): Observable<MensajeErrorDTO<{message: string}>> {
    return this.http.post<MensajeErrorDTO<{message: string}>>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  validateResetToken(token: string): Observable<MensajeErrorDTO<{valid: boolean}>> {
    return this.http.post<MensajeErrorDTO<{valid: boolean}>>(API_ENDPOINTS.VALIDATE_RESET_TOKEN, { token });
  }

  resetPassword(token: string, password: string): Observable<MensajeErrorDTO<{message: string}>> {
    return this.http.post<MensajeErrorDTO<{message: string}>>(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      password: password
    });
  }

  // Métodos helper para recuperación de contraseña
  enviarEmailRecuperacion(email: string): Observable<string> {
    return this.forgotPassword(email).pipe(
      map(response => this.responseHandler.extractData(response).message),
      catchError(error => this.responseHandler.handleError({ p_exito: false, p_menserror: error.message, p_mensavis: '', p_data: {} }))
    );
  }

  validarTokenReset(token: string): Observable<boolean> {
    return this.validateResetToken(token).pipe(
      map(response => this.responseHandler.extractData(response).valid),
      catchError(error => this.responseHandler.handleError({ p_exito: false, p_menserror: error.message, p_mensavis: '', p_data: {} }))
    );
  }

  resetearPassword(token: string, password: string): Observable<string> {
    return this.resetPassword(token, password).pipe(
      map(response => this.responseHandler.extractData(response).message),
      catchError(error => this.responseHandler.handleError({ p_exito: false, p_menserror: error.message, p_mensavis: '', p_data: {} }))
    );
  }

  // Cambiar contraseña del usuario autenticado
  changePassword(passwordData: CambiarPasswordRequest): Observable<CambiarPasswordResponse | CambiarPasswordError> {
    return this.http.put<CambiarPasswordResponse | CambiarPasswordError>(API_ENDPOINTS.CHANGE_PASSWORD, passwordData, {
      headers: this.getAuthHeaders()
    });
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
      'Content-Type': JWT_CONSTANTS.CONTENT_TYPE,
      [JWT_CONSTANTS.AUTHORIZATION_HEADER]: `${JWT_CONSTANTS.BEARER_PREFIX}${token}`
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
}
