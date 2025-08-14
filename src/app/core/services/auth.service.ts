import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from '../models/usuario';

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromToken();
  }

  // Método de login principal
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.LOGIN, credentials).pipe(
      tap(response => {
        this.handleAuthentication(response);
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

    // Método de registro
  register(usuario: Usuario): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.REGISTER, usuario).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  // Método de logout
  logout(): void {
    this.removeTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

    // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    return !this.isTokenExpired();
  }

  // Obtener usuario actual
  getUser(): any {
    return this.currentUserSubject.value;
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Establecer token manualmente
  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
    const decoded = this.decodeToken(token);
    if (decoded) {
      this.currentUserSubject.next(decoded);
    }
  }

    // Verificar si el token ha expirado
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return true;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return true;
      }

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Refresh del token - Comentado hasta implementar en el backend
  refreshToken(): Observable<string> {
    // TODO: Implementar cuando tengas el endpoint de refresh token en el backend
    return throwError(() => new Error('Refresh token not implemented yet'));

    /*
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable().pipe(
        switchMap(token => token ? [token] : throwError(() => new Error('No token available')))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.isRefreshing = false;
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken
    }).pipe(
      tap(response => {
        this.handleAuthentication(response);
        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.token);
      }),
      switchMap(response => [response.token]),
      catchError(error => {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => error);
      })
    );
    */
  }

  // Métodos para recuperación de contraseña
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
    return this.http.post(API_ENDPOINTS.RESET_PASSWORD, { token, password }).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos privados
  private handleAuthentication(response: any): void {
    // Buscar el token en diferentes propiedades posibles
    let token = response.token || response.jwttoken || response.accessToken || response.access_token || response.jwt;

    if (!token) {
      throw new Error('No se encontró token en la respuesta del servidor');
    }

    localStorage.setItem('accessToken', token);
    const decoded = this.decodeToken(token);
    if (decoded) {
      this.currentUserSubject.next(decoded);
    }
  }

  private removeTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private loadUserFromToken(): void {
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        if (decoded && !this.isTokenExpired()) {
          this.currentUserSubject.next(decoded);
        } else {
          this.removeTokens();
        }
      } catch (error) {
        this.removeTokens();
      }
    }
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.statusText || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  }

  // Método para obtener headers con token
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user && user.role === role;
  }

  // Método para verificar si el usuario tiene alguno de los roles especificados
  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user && roles.includes(user.role);
  }


}
