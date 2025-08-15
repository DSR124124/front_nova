import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario';
import { UploadedFile } from '../../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);

  generos = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'Otro', value: 'otro' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Componente inicializado
  }

  // Inicialización del formulario
  private initForm(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      fotoPerfil: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validación de contraseñas
  passwordMatchValidator(form: FormGroup): any {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.registerForm.valid) {
      if (!this.validateUniqueEmail()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Validación',
          detail: 'El correo electrónico ya está registrado. Por favor, usa otro correo.',
          life: 5000
        });
        return;
      }

      this.loading = true;
      const formData = this.registerForm.value;
      const { confirmPassword, acceptTerms, ...userData } = formData;

      const usuario: Usuario = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.correo,
        username: userData.username,
        password: userData.password,
        fechaNacimiento: this.formatDateToISO(userData.fechaNacimiento),
        genero: this.mapGeneroToBackend(userData.genero),
        enabled: true,
        role: { id: 1, rol: 'USER' }
      };

      this.authService.register(usuario).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess('¡Registro Exitoso!', 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.');
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
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

  // Validación de campos
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return 'Este campo es requerido';
      if (field.errors?.['email']) return 'Ingresa un email válido';
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
      if (field.errors?.['passwordMismatch']) return 'Las contraseñas no coinciden';
      if (field.errors?.['emailExists']) return 'Este correo ya está registrado';
      if (fieldName === 'acceptTerms' && field.errors?.['required']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    return '';
  }

  // Manejo de archivos
  onFilesSelected(files: File[]): void {
    if (files && files.length > 0) {
      this.registerForm.patchValue({ fotoPerfil: files[0].name });
    }
  }

  // Navegación
  onBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Métodos privados
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  private formatDateToISO(date: string): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  private mapGeneroToBackend(genero: string): string {
    const generoMap: { [key: string]: string } = {
      'masculino': 'M',
      'femenino': 'F',
      'otro': 'O'
    };
    return generoMap[genero] || 'O';
  }

  private validateUniqueEmail(): boolean {
    const email = this.registerForm.get('correo')?.value;
    if (email) {
      const existingEmails = ['246810diegosr@gmail.com', 'diego.nuevo@gmail.com'];
      if (existingEmails.includes(email)) {
        this.registerForm.get('correo')?.setErrors({ emailExists: true });
        return false;
      }
    }
    return true;
  }

  private showSuccess(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 5000
    });
  }
}
