import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.LOGIN, credentials);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  register(usuario: Usuario): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.REGISTER, usuario);
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.VALIDATE_RESET_TOKEN, { token });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
  }

  logout() {
    this.removeToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}
