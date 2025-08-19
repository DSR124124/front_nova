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
    this.loadSavedCredentials();
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

      this.authService.loginUsuario(credentials).subscribe({
        next: (usuario) => {
          this.loading = false;

          // Guardar credenciales si "Recordarme" está marcado
          this.saveCredentials(credentials);

          // Mostrar mensaje de éxito
          this.messageService.add({
            severity: 'success',
            summary: '¡Bienvenido!',
            detail: `Has iniciado sesión correctamente, ${usuario.nombre}`,
            life: 3000
          });

          // Redirigir según el rol del usuario
          this.redirectUser();
        },
        error: (error) => {
          this.loading = false;
          this.handleLoginError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private saveCredentials(credentials: any): void {
    if (this.rememberMe) {
      localStorage.setItem('saved_username', credentials.username);
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('saved_username');
      localStorage.removeItem('remember_me');
    }
  }

  private redirectUser(): void {
    setTimeout(() => {
      const userRole = this.authService.getRole();
      let targetRoute = '/user/dashboard'; // Ruta por defecto

      if (userRole === 'ADMIN') {
        targetRoute = '/admin';
      }

      this.router.navigate([targetRoute]).then(
        (success) => {
          if (!success) {
            console.error('Error en navegación a:', targetRoute);
          }
        },
        (error) => {
          console.error('Error en navegación:', error);
        }
      );
    }, 1000);
  }

  private handleLoginError(error: any): void {
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

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
