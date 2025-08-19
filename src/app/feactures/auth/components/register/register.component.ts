import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/Interfaces/Usuario/Usuario';
import { RegisterRequest } from '../../../../core/models/Interfaces/Auth/auth.interface';
import { UploadedFile } from '../../../../shared/components/image-upload/image-upload.component';
import { Role } from '../../../../core/models/enums/role.enum';

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

      // Hashear la contraseña antes de enviarla
      const hashedPassword = bcrypt.hashSync(userData.password, 12);

      const usuario: Usuario = {
        idUsuario: 0, // Se asignará desde el backend
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.correo,
        username: userData.username,
        password: hashedPassword, // Usar la contraseña hasheada
        enabled: true,
        fotoPerfil: null, // Por defecto sin foto
        fechaNacimiento: this.formatDateToISO(userData.fechaNacimiento),
        genero: this.mapGeneroToBackend(userData.genero),
        role: Role.USER, // Usar el enum Role correctamente
        codigoRelacion: null, // Por defecto sin código de relación
        disponibleParaPareja: true // Por defecto disponible para formar pareja
      };



      this.authService.registrarUsuario(usuario).subscribe({
        next: (usuarioRegistrado: Usuario) => {
          this.loading = false;
          // Mostrar mensaje de éxito del backend
          this.messageService.add({
            severity: 'success',
            summary: '¡Registro Exitoso!',
            detail: 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.',
            life: 5000
          });
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
                error: (error) => {
          this.loading = false;
          // Mostrar mensaje de error del backend si está disponible
          let errorMessage = 'Error al registrar usuario';
          let errorSummary = 'Error de Registro';

          if (error && error.p_menserror) {
            errorMessage = error.p_menserror;
          } else if (error && error.message) {
            errorMessage = error.message;
          }

          // Si es error 400, dar más contexto
          if (error && error.status === 400) {
            errorSummary = 'Error de Validación';
            errorMessage = 'Los datos enviados no son válidos. Por favor, verifica que todos los campos estén completos y sean correctos.';
          }
          // Si es error 500, dar más contexto
          else if (error && error.status === 500) {
            errorSummary = 'Error del Servidor';
            errorMessage = 'Error interno del servidor. Por favor, verifica que todos los campos sean correctos o contacta al administrador.';
          }

          this.messageService.add({
            severity: 'error',
            summary: errorSummary,
            detail: errorMessage,
            life: 8000
          });
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
