import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Cargar credenciales guardadas si existen
    this.loadSavedCredentials();
  }

  // Método para debug de la respuesta del servidor
  private debugResponse(response: any): void {
    // Solo mostrar si hay problemas
  }

      // Método para extraer token de diferentes formatos de respuesta
  private extractToken(response: any): string | null {
    // Intentar diferentes propiedades comunes para el token
    const possibleTokenProps = [
      'token',
      'jwttoken',
      'accessToken',
      'access_token',
      'jwt',
      'authorization',
      'auth_token',
      'bearer'
    ];

    for (const prop of possibleTokenProps) {
      if (response[prop] && typeof response[prop] === 'string') {
        return response[prop];
      }
    }

    // Si no se encuentra en propiedades directas, buscar en objetos anidados
    if (response.data && typeof response.data === 'object') {
      for (const prop of possibleTokenProps) {
        if (response.data[prop] && typeof response.data[prop] === 'string') {
          return response.data[prop];
        }
      }
    }

    // Si no se encuentra en response.data, buscar en response.result
    if (response.result && typeof response.result === 'object') {
      for (const prop of possibleTokenProps) {
        if (response.result[prop] && typeof response.result[prop] === 'string') {
          return response.result[prop];
        }
      }
    }

    return null;
  }

  // Método para limpiar el token (remover "Bearer " si está presente)
  private cleanToken(token: string): string {
    if (token.startsWith('Bearer ')) {
      return token.substring(7);
    }
    return token;
  }

  // Método para validar formato de JWT
  private isValidJWT(token: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      parts.forEach((part, index) => {
        if (index < 2) {
          atob(part.replace(/-/g, '+').replace(/_/g, '/'));
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

      // Método para mostrar información del token decodificado
  private showTokenInfo(token: string): void {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      console.log('🎯 JWT:', {
        usuario: payload.nombre || payload.username || payload.sub,
        rol: payload.role,
        expira: new Date(payload.exp * 1000).toLocaleString()
      });

    } catch (error) {
      // Silencioso
    }
  }

  // Método para analizar y mostrar información de la respuesta del servidor
  private analyzeServerResponse(response: any): void {
    // Silencioso
  }

  private loadSavedCredentials(): void {
    const savedUsername = localStorage.getItem('saved_username');
    const savedRememberMe = localStorage.getItem('remember_me');

    if (savedUsername && savedRememberMe === 'true') {
      this.loginForm.patchValue({ username: savedUsername });
      this.rememberMe = true;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Extraer token usando el método mejorado
          const token = this.extractToken(response);

          if (!token) {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error de Login',
              detail: 'Respuesta del servidor inválida',
              life: 5000
            });
            return;
          }

          this.loading = false;

          // Limpiar y validar token
          const cleanToken = this.cleanToken(token);

          if (!this.isValidJWT(cleanToken)) {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error de Login',
              detail: 'Token recibido no tiene formato válido',
              life: 5000
            });
            return;
          }

          this.authService.setToken(cleanToken);

          // Mostrar información del token
          this.showTokenInfo(cleanToken);

          // Guardar credenciales si "Recordarme" está marcado
          if (this.rememberMe) {
            localStorage.setItem('saved_username', credentials.username);
            localStorage.setItem('remember_me', 'true');
          } else {
            localStorage.removeItem('saved_username');
            localStorage.removeItem('remember_me');
          }

          this.messageService.add({
            severity: 'success',
            summary: '¡Bienvenido!',
            detail: 'Has iniciado sesión correctamente',
            life: 3000
          });

                                        // Redirigir según el rol del usuario
          setTimeout(() => {
            let user = this.authService.getUser();

            // Si no hay usuario, intentar obtenerlo del token almacenado
            if (!user) {
              const token = localStorage.getItem('accessToken');
              if (token) {
                try {
                  const parts = token.split('.');
                  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                  user = payload;
                } catch (error) {
                  // Silencioso
                }
              }
            }

            if (user && user.role === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else if (user && user.role === 'USER') {
              this.router.navigate(['/user']);
            } else {
              this.router.navigate(['/user']);
            }
          }, 1000);
        },
        error: (error) => {
          console.error('❌ Error en login:', error);
          this.loading = false;

          let errorMessage = 'Error al iniciar sesión';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor';
          } else if (error.status >= 500) {
            errorMessage = 'Error del servidor, inténtalo más tarde';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error de Login',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }


}
