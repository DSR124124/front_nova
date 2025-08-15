import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  token: string = '';
  tokenValid = false;
  passwordReset = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Obtener el token de reset de la URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.validateToken();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Token Inválido',
          detail: 'No se encontró un token válido para resetear la contraseña',
          life: 5000
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  validateToken(): void {
    this.loading = true;

    this.authService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.loading = false;
        this.tokenValid = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Token Válido',
          detail: 'Puedes proceder a cambiar tu contraseña',
          life: 3000
        });
      },
      error: () => {
        this.loading = false;
        this.tokenValid = false;
        // ErrorInterceptor ya maneja los errores HTTP automáticamente
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.tokenValid) {
      this.loading = true;
      const { password } = this.resetForm.value;

      this.authService.resetPassword(this.token, password).subscribe({
        next: (response) => {
          this.loading = false;
          this.passwordReset = true;

          this.messageService.add({
            severity: 'success',
            summary: '¡Contraseña Cambiada!',
            detail: 'Tu contraseña ha sido actualizada correctamente',
            life: 5000
          });

          // Redirigir al login después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: () => {
          this.loading = false;
          // ErrorInterceptor ya maneja los errores HTTP automáticamente
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetForm.controls).forEach(key => {
      const control = this.resetForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
      if (field.errors?.['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  requestNewToken(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
