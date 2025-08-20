import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CodigoRelacionService } from '../../../../core/services/codigo-relacion.service';
import { Usuario } from '../../../../core/models/Interfaces/Usuario/Usuario';
import { MessageService } from 'primeng/api';
import { CambioPasswordDTO } from '../../../../core/models/Interfaces/Auth/auth.interface';
import { Role, RoleLabels } from '../../../../core/models/enums/role.enum';
import { CodigoRelacionResponseDTO, ValidacionCodigoResponseDTO } from '../../../../core/models/Interfaces/Codigos-Relacion/codigo-relacion';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
  standalone: false
})
export class PerfilUsuarioComponent implements OnInit {
  usuario: Usuario | null = null;
  pareja: any | null = null; // Add missing pareja property
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

  // Gestión de códigos de relación
  generandoCodigo = false;
  codigoGenerado: string | null = null;
  mostrandoCodigo = false;

  // Opciones para el formulario
  generos = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'O' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private codigoRelacionService: CodigoRelacionService,
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

    if (currentUser && currentUser.username) {
      // Usar el método helper que extrae solo los datos por username
      this.usuarioService.obtenerUsuarioPorUsername(currentUser.username).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          this.loading = false;
        },
        error: (err) => {
          this.error = `Error al cargar el perfil: ${err.message || 'Error desconocido'}`;
          this.loading = false;

          // Mostrar mensaje de error al usuario
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Cargar Perfil',
            detail: this.error,
            life: 8000
          });
        }
      });
    } else if (currentUser && currentUser.idUsuario) {
      // Fallback: usar ID si no hay username disponible
      this.usuarioService.obtenerUsuarioPorId(currentUser.idUsuario).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          this.loading = false;
        },
        error: (err) => {
          this.error = `Error al cargar el perfil: ${err.message || 'Error desconocido'}`;
          this.loading = false;

          // Mostrar mensaje de error al usuario
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Cargar Perfil',
            detail: this.error,
            life: 8000
          });
        }
      });
    } else {
      this.error = 'Usuario no autenticado';
      this.loading = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Error de Autenticación',
        detail: 'No se pudo obtener la información del usuario autenticado.',
        life: 5000
      });
    }
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
    return 'Sin pareja';
  }

  tienePareja(): boolean {
    return false;
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
    // Usar el enum y los labels predefinidos
    return RoleLabels[this.usuario.role as Role] || 'Desconocido';
  }

  getEdad(): number {
    if (!this.usuario?.fechaNacimiento) return 0;
    const fechaNac = new Date(this.usuario.fechaNacimiento);
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
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        username: this.usuario.username,
        correo: this.usuario.correo,
        fechaNacimiento: this.usuario.fechaNacimiento ? new Date(this.usuario.fechaNacimiento) : null,
        genero: this.usuario.genero
      });
      this.editMode = true;
    }
  }

  cancelarEdicion() {
    this.editMode = false;
    this.editForm.reset();
  }

  guardarCambios() {
    if (this.editForm.valid && this.usuario) {
      this.saving = true;

      const datosActualizados: Usuario = {
        ...this.usuario,
        ...this.editForm.value,
        fechaNacimiento: this.editForm.value.fechaNacimiento ?
          this.editForm.value.fechaNacimiento.toISOString().split('T')[0] : undefined
      };

      // Usar el método helper que extrae solo los datos
      this.usuarioService.modificarUsuario(datosActualizados).subscribe({
        next: (usuarioActualizado) => {
          this.usuario = usuarioActualizado;
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
      const passwordData: CambioPasswordDTO = {
        idUsuario: this.usuario.idUsuario,
        passwordActual: this.passwordForm.value.currentPassword,
        passwordNueva: this.passwordForm.value.newPassword
      };

      // Llamar al servicio de usuario para cambiar la contraseña
      this.usuarioService.cambiarPasswordUsuario(passwordData).subscribe({
        next: (idUsuario: number) => {
          this.changingPassword = false;
          this.hidePasswordDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contraseña cambiada correctamente'
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

  // ===== MÉTODOS PARA CÓDIGOS DE RELACIÓN =====

  /**
   * Generar un nuevo código de relación para el usuario
   */
  generarCodigoRelacion() {
    if (this.usuario?.username) {
      this.generandoCodigo = true;

            this.codigoRelacionService.generarCodigo(this.usuario.username).subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.codigoGenerado = response.p_data.codigo;
            this.mostrandoCodigo = true;
            this.generandoCodigo = false;

            // Actualizar el usuario local con el nuevo código
            if (this.usuario) {
              this.usuario.codigoRelacion = response.p_data.codigo;
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Código de relación generado correctamente'
            });
          } else {
            this.generandoCodigo = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.p_mensavis || 'Error al generar el código'
            });
          }
        },
        error: (err: any) => {
          this.generandoCodigo = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al generar el código de relación'
          });
        }
      });
    }
  }

  /**
   * Ocultar el código generado
   */
  ocultarCodigo() {
    this.mostrandoCodigo = false;
    this.codigoGenerado = null;
  }

  /**
   * Copiar código al portapapeles
   */
  copiarCodigo() {
    if (this.codigoGenerado) {
      navigator.clipboard.writeText(this.codigoGenerado).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado',
          detail: 'Código copiado al portapapeles'
        });
      }).catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo copiar el código'
        });
      });
    }
  }

  /**
   * Formatear código para mostrar (con guiones cada 4 caracteres)
   */
  formatearCodigo(codigo: string): string {
    if (!codigo) return '';
    return codigo.replace(/(.{4})/g, '$1-').replace(/-$/, '');
  }

}
