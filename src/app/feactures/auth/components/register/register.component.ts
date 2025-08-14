import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario';
// Role enum removido - ahora usamos string directamente

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  maxDate = new Date(); // Fecha actual como límite máximo
  minDate = new Date(1900, 0, 1); // Fecha mínima (1900)
  defaultDate = new Date(1990, 0, 1); // Fecha por defecto
  generos = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'O' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      fotoPerfil: [''],
      acceptTerms: [false, [this.termsValidator]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Inicialización del componente
  }

  termsValidator(control: any) {
    return control.value === true ? null : { required: true };
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

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formData = this.registerForm.value;

      // Remover confirmPassword y acceptTerms del objeto a enviar
      const { confirmPassword, acceptTerms, ...userData } = formData;

      // Crear el objeto Usuario con los campos correctos
      const usuario: Usuario = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.correo,
        username: userData.username,
        password: userData.password,
        fechaNacimiento: userData.fechaNacimiento ? new Date(userData.fechaNacimiento) : undefined,
        genero: userData.genero,
        fotoPerfil: userData.fotoPerfil || undefined,
        enabled: true,
        role: 'USER' // Por defecto asignamos USER (coincide con ROLES.USER)
      };

      this.authService.register(usuario).subscribe({
        next: (response) => {
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: '¡Registro Exitoso!',
            detail: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
            life: 5000
          });

          // Redirigir al login después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error de registro:', error);

          let errorMessage = 'Error al crear la cuenta';
          if (error.status === 409) {
            errorMessage = 'El email o usuario ya está registrado';
          } else if (error.status === 400) {
            errorMessage = 'Datos de registro inválidos';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu internet';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error de Registro',
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
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors?.['email']) {
        return 'Ingresa un email válido';
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
      if (field.errors?.['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
      if (fieldName === 'acceptTerms' && field.errors?.['required']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.registerForm.patchValue({
          fotoPerfil: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  private formatDateToISO(date: string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
