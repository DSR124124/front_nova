import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as bcrypt from 'bcryptjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from '../models/usuario';

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

  // Login
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password
    }).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  // Registro
  register(usuario: Usuario): Observable<void> {
    if (usuario.password) {
      usuario.password = bcrypt.hashSync(usuario.password, 12);
    }

    return this.http.post<void>(API_ENDPOINTS.REGISTER, usuario, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
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

    return this.http.post<any>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken: refreshToken
    }).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  // Recuperación de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.VALIDATE_RESET_TOKEN, { token });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      password: password
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
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
}
