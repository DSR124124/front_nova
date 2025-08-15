import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario';
import { UploadedFile } from '../../../../shared/components/image-upload/image-upload.component';
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
      // Validar que el correo sea único antes de enviar
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

      // Remover confirmPassword y acceptTerms del objeto a enviar
      const { confirmPassword, acceptTerms, ...userData } = formData;

      // Encriptar la contraseña antes de enviarla
      const hashedPassword = this.simpleHash(userData.password);

      // Crear el objeto Usuario con los campos correctos para el backend
      const usuario: Usuario = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.correo,
        username: userData.username,
        password: hashedPassword, // Enviar la contraseña encriptada
        fechaNacimiento: userData.fechaNacimiento ? this.formatDateToISO(userData.fechaNacimiento) : undefined,
        genero: this.mapGeneroToBackend(userData.genero),
        fotoPerfil: userData.fotoPerfil || undefined,
        enabled: true,
        role: { id: 1, rol: 'USER' } // Enviar como objeto con id y rol
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

          let errorMessage = 'Error al crear la cuenta';

          // Obtener el mensaje específico del backend si está disponible
          if (error.error?.details) {
            errorMessage = error.error.details;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 409) {
            errorMessage = 'El email o usuario ya está registrado';
          } else if (error.status === 400) {
            errorMessage = 'Datos de registro inválidos';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu internet';
          } else if (error.status === 500) {
            errorMessage = 'Error del servidor. Intenta más tarde o contacta soporte';
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
      if (field.errors?.['emailExists']) {
        return 'Este correo ya está registrado';
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

  onImageUpload(files: UploadedFile[] | UploadedFile | null): void {
    if (files) {
      if (Array.isArray(files) && files.length > 0) {
        // Si es múltiple, tomamos el primer archivo
        const file = files[0];
        if (file.file) {
          this.convertFileToBase64(file.file);
        }
      } else if (!Array.isArray(files) && files.file) {
        // Si es un solo archivo
        this.convertFileToBase64(files.file);
      }
    } else {
      // No hay archivos, limpiar el campo
      this.registerForm.patchValue({
        fotoPerfil: ''
      });
    }
  }

  onFilesSelected(files: File[]): void {
    if (files && files.length > 0) {
      // Enviar solo el nombre del archivo, no el contenido base64
      const fileName = files[0].name;
      this.registerForm.patchValue({
        fotoPerfil: fileName
      });
    }
  }

  private convertFileToBase64(file: File): void {
    // Este método ya no se usa, pero lo mantenemos por compatibilidad
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Solo guardamos el nombre del archivo, no el contenido base64
      this.registerForm.patchValue({
        fotoPerfil: file.name
      });
    };
    reader.readAsDataURL(file);
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

  private mapGeneroToBackend(genero: string): string {
    switch (genero) {
      case 'masculino':
        return 'M';
      case 'femenino':
        return 'F';
      case 'otro':
        return 'O';
      default:
        return 'O'; // Valor por defecto
    }
  }

  // Verificar si el correo ya existe
  checkEmailExists(email: string): void {
    if (email && this.registerForm.get('correo')?.valid) {
      // Aquí podrías hacer una llamada al backend para verificar si el correo existe
      // Por ahora, solo mostramos un mensaje informativo
    }
  }

  // Validar correo único
  validateUniqueEmail(): boolean {
    const email = this.registerForm.get('correo')?.value;
    if (email) {
      // Lista de correos que ya existen (esto debería venir del backend)
      const existingEmails = [
        '246810diegosr@gmail.com',
        'diego.nuevo@gmail.com'
        // Agregar más correos existentes según sea necesario
      ];

      if (existingEmails.includes(email)) {
        this.registerForm.get('correo')?.setErrors({ emailExists: true });
        return false;
      }
    }
    return true;
  }

  private simpleHash(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = password.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash.toString();
  }
}
