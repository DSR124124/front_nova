import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ParejaService } from '../../../../core/services/pareja.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario';
import { Pareja } from '../../../../core/models/pareja';
import { MessageService } from 'primeng/api';
import { CambiarPasswordRequest, CambiarPasswordError } from '../../../../core/models/cambiar-password.model';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
  standalone: false
})
export class PerfilUsuarioComponent implements OnInit {
  usuario: Usuario | null = null;
  pareja: Pareja | null = null;
  loading = true;
  error = '';
  isAuthenticated = false;

    // Formulario de edición
  editForm: FormGroup;
  editMode = false;
  saving = false;

  // Formulario de cambio de contraseña
  passwordForm: FormGroup;
  passwordDialogVisible = false;
  changingPassword = false;

  // Opciones para el formulario
  generos = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'O' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private parejaService: ParejaService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.isAuthenticated) {
      this.cargarPerfilUsuario();
    } else {
      this.loading = false;
    }
  }

  cargarPerfilUsuario() {
    this.loading = true;
    const currentUser = this.authService.getUser();

    if (currentUser && currentUser.idUsuario) {
      this.usuarioService.listarPorId(currentUser.idUsuario).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          if (usuario.parejaId) {
            this.cargarPareja(usuario.parejaId);
          } else {
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = 'Error al cargar el perfil del usuario';
          this.loading = false;
          console.error('Error cargando usuario:', err);
        }
      });
    } else {
      this.error = 'Usuario no autenticado';
      this.loading = false;
    }
  }

  cargarPareja(parejaId: number) {
    this.parejaService.listarPorId(parejaId).subscribe({
      next: (pareja) => {
        this.pareja = pareja;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar información de la pareja';
        this.loading = false;
        console.error('Error cargando pareja:', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  getNombreCompleto(): string {
    if (!this.usuario) return '';
    return `${this.usuario.nombre} ${this.usuario.apellido}`;
  }

  getEstadoPareja(): string {
    if (!this.pareja) return 'Sin pareja';

    switch (this.pareja.estadoRelacion) {
      case 'activa': return 'Activa';
      case 'pausada': return 'Pausada';
      case 'terminada': return 'Terminada';
      default: return 'Desconocido';
    }
  }

  tienePareja(): boolean {
    return this.pareja !== null && this.pareja.estadoRelacion === 'activa';
  }

  getGeneroTexto(): string {
    if (!this.usuario?.genero) return '';
    switch (this.usuario.genero) {
      case 'M': return 'Masculino';
      case 'F': return 'Femenino';
      default: return 'Otro';
    }
  }

  getRoleTexto(): string {
    if (!this.usuario?.role) return '';
    switch (this.usuario.role.rol) { // Acceder a la propiedad 'rol' del objeto
      case 'ADMIN': return 'Administrador';
      case 'USER': return 'Usuario';
      default: return 'Desconocido';
    }
  }

  getEdad(): number {
    if (!this.usuario?.fechaNacimiento) return 0;
    const fechaNac = new Date(this.usuario.fechaNacimiento); // fechaNacimiento ya es string
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  }

  // Métodos para editar perfil
  activarEdicion() {
    if (this.usuario) {
      this.editForm.patchValue({
        nombre: this.usuario.nombre || '',
        apellido: this.usuario.apellido || '',
        username: this.usuario.username || '',
        correo: this.usuario.correo || '',
        fechaNacimiento: this.usuario.fechaNacimiento ? new Date(this.usuario.fechaNacimiento) : null,
        genero: this.usuario.genero || ''
      });
      this.editMode = true;
    }
  }

  cancelarEdicion() {
    this.editMode = false;
    this.editForm.reset();
  }

  guardarPerfil() {
    if (this.editForm.valid && this.usuario) {
      this.saving = true;

      const datosActualizados = {
        ...this.usuario,
        ...this.editForm.value,
        fechaNacimiento: this.editForm.value.fechaNacimiento ?
          this.editForm.value.fechaNacimiento.toISOString().split('T')[0] : null
      };

      this.usuarioService.modificar(datosActualizados).subscribe({
        next: () => {
          // Recargar el usuario actualizado
          this.cargarPerfilUsuario();
          this.editMode = false;
          this.saving = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Perfil actualizado correctamente'
          });
        },
        error: (err: any) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el perfil'
          });
          console.error('Error actualizando usuario:', err);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
    }
    return '';
  }

  // ===== MÉTODOS PARA CAMBIO DE CONTRASEÑA =====

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword === confirmPassword) {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    } else {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
  }

  // Mostrar diálogo de cambio de contraseña
  showPasswordDialog() {
    this.passwordForm.reset();
    this.passwordDialogVisible = true;
  }

  // Ocultar diálogo de cambio de contraseña
  hidePasswordDialog() {
    this.passwordDialogVisible = false;
    this.passwordForm.reset();
  }

        // Cambiar contraseña
  cambiarContrasena() {
    if (this.passwordForm.valid && this.usuario && this.usuario.idUsuario) {
      this.changingPassword = true;

      // Enviar contraseñas en texto plano - el backend se encarga de la encriptación
      const passwordData: CambiarPasswordRequest = {
        idUsuario: this.usuario.idUsuario,
        passwordActual: this.passwordForm.value.currentPassword,        // Texto plano
        passwordNueva: this.passwordForm.value.newPassword,            // Texto plano
        passwordConfirmacion: this.passwordForm.value.confirmPassword  // Texto plano
      };

      // Llamar al servicio real para cambiar la contraseña
      this.authService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.changingPassword = false;
          this.hidePasswordDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.message || 'Contraseña cambiada correctamente'
          });
        },
        error: (err: any) => {
          this.changingPassword = false;

          // Manejar errores específicos del backend
          let errorMessage = 'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.';

          if (err.error && err.error.errors) {
            const backendErrors = err.error.errors;
            if (backendErrors.passwordActual) {
              errorMessage = backendErrors.passwordActual;
            } else if (backendErrors.passwordNueva) {
              errorMessage = backendErrors.passwordNueva;
            } else if (backendErrors.passwordConfirmacion) {
              errorMessage = backendErrors.passwordConfirmacion;
            }
          } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
          console.error('Error cambiando contraseña:', err);
        }
      });
    }
  }

  // Obtener error de campo de contraseña
  getPasswordFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }

  // Verificar si un campo de contraseña es inválido
  isPasswordFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
