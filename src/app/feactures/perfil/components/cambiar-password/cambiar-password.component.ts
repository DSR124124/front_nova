import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cambiar-password',
  standalone: false,
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.css'
})
export class CambiarPasswordComponent implements OnInit {
  cambiarPasswordForm: FormGroup;
  loading = false;

  // Control de visibilidad de contraseñas
  mostrarPasswordActual = false;
  mostrarPasswordNueva = false;
  mostrarPasswordConfirmar = false;

  // Indicadores de fortaleza de contraseña
  fortalezaPassword = {
    score: 0,
    mensaje: '',
    color: 'danger'
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.cambiarPasswordForm = this.createForm();
  }

  ngOnInit(): void {
    // Suscribirse a cambios en la nueva contraseña para evaluar fortaleza
    this.cambiarPasswordForm.get('passwordNueva')?.valueChanges.subscribe(value => {
      if (value) {
        this.evaluarFortalezaPassword(value);
      } else {
        this.fortalezaPassword = { score: 0, mensaje: '', color: 'danger' };
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(6)]],
      passwordNueva: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      passwordConfirmar: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para la fortaleza de la contraseña
  private passwordStrengthValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) return null;

    const password = control.value;
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const conditions = [hasMinLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar];
    const metConditions = conditions.filter(condition => condition).length;

    if (metConditions < 3) {
      return { weakPassword: true };
    }

    return null;
  }

  // Validador para verificar que las contraseñas coincidan
  private passwordMatchValidator(form: AbstractControl): {[key: string]: any} | null {
    const passwordNueva = form.get('passwordNueva');
    const passwordConfirmar = form.get('passwordConfirmar');

    if (!passwordNueva || !passwordConfirmar) return null;

    if (passwordNueva.value !== passwordConfirmar.value) {
      passwordConfirmar.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Limpiar error si las contraseñas coinciden
      if (passwordConfirmar.errors?.['passwordMismatch']) {
        delete passwordConfirmar.errors['passwordMismatch'];
        if (Object.keys(passwordConfirmar.errors).length === 0) {
          passwordConfirmar.setErrors(null);
        }
      }
    }

    return null;
  }

  private evaluarFortalezaPassword(password: string): void {
    if (!password) {
      this.fortalezaPassword = { score: 0, mensaje: '', color: 'danger' };
      return;
    }

    let score = 0;
    let mensaje = '';
    let color = 'danger';

    // Criterios de evaluación
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calcular puntuación
    if (hasMinLength) score += 20;
    if (hasUpperCase) score += 20;
    if (hasLowerCase) score += 20;
    if (hasNumbers) score += 20;
    if (hasSpecialChar) score += 20;

    // Bonificaciones por longitud
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Determinar mensaje y color
    if (score < 40) {
      mensaje = 'Muy débil';
      color = 'danger';
    } else if (score < 60) {
      mensaje = 'Débil';
      color = 'warning';
    } else if (score < 80) {
      mensaje = 'Moderada';
      color = 'info';
    } else if (score < 100) {
      mensaje = 'Fuerte';
      color = 'success';
    } else {
      mensaje = 'Muy fuerte';
      color = 'success';
    }

    this.fortalezaPassword = { score, mensaje, color };
  }

  cambiarPassword(): void {
    if (this.cambiarPasswordForm.valid) {
      this.loading = true;

      const formData = this.cambiarPasswordForm.value;

      // Simulamos el cambio de contraseña
      setTimeout(() => {
        // Aquí iría la llamada al servicio para cambiar la contraseña
        console.log('Cambiando contraseña...', {
          passwordActual: formData.passwordActual,
          passwordNueva: formData.passwordNueva
        });

        // Simulamos diferentes respuestas
        const success = Math.random() > 0.3; // 70% de éxito

        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contraseña cambiada correctamente'
          });

          // Limpiar formulario
          this.cambiarPasswordForm.reset();
          this.fortalezaPassword = { score: 0, mensaje: '', color: 'danger' };

        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'La contraseña actual no es correcta'
          });
        }

        this.loading = false;
      }, 1500);

    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor, revisa todos los campos'
      });

      this.marcarCamposComoTocados();
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.cambiarPasswordForm.controls).forEach(key => {
      this.cambiarPasswordForm.get(key)?.markAsTouched();
    });
  }

  // Métodos para alternar visibilidad de contraseñas
  togglePasswordActual(): void {
    this.mostrarPasswordActual = !this.mostrarPasswordActual;
  }

  togglePasswordNueva(): void {
    this.mostrarPasswordNueva = !this.mostrarPasswordNueva;
  }

  togglePasswordConfirmar(): void {
    this.mostrarPasswordConfirmar = !this.mostrarPasswordConfirmar;
  }

  // Getters para facilitar el acceso a los controles del formulario
  get passwordActual() { return this.cambiarPasswordForm.get('passwordActual'); }
  get passwordNueva() { return this.cambiarPasswordForm.get('passwordNueva'); }
  get passwordConfirmar() { return this.cambiarPasswordForm.get('passwordConfirmar'); }

  // Método para obtener mensajes de error
  getErrorMessage(controlName: string): string {
    const control = this.cambiarPasswordForm.get(controlName);

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `Mínimo ${requiredLength} caracteres`;
      }
      if (control.errors['weakPassword']) {
        return 'La contraseña debe tener al menos 8 caracteres y cumplir 3 de estos criterios: mayúsculas, minúsculas, números, símbolos';
      }
      if (control.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }

    return '';
  }

  cancelar(): void {
    this.cambiarPasswordForm.reset();
    this.fortalezaPassword = { score: 0, mensaje: '', color: 'danger' };

    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Se canceló el cambio de contraseña'
    });
  }
}
