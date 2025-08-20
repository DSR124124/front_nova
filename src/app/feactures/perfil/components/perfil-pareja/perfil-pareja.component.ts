import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pareja } from '../../../../core/models/Interfaces/Pareja/pareja';
import { EstadoPareja } from '../../../../core/models/enums/estado-pareja.enum';
import { Usuario } from '../../../../core/models/Interfaces/Usuario/Usuario';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CodigoRelacionService } from '../../../../core/services/codigo-relacion.service';
import { Role } from '../../../../core/models/enums/role.enum';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perfil-pareja',
  standalone: false,
  templateUrl: './perfil-pareja.component.html',
  styleUrl: './perfil-pareja.component.css'
})
export class PerfilParejaComponent implements OnInit {
  pareja: Pareja | null = null;
  usuarioActual: Usuario | null = null;
  companero: Usuario | null = null;
  loading = false;
  error: string | null = null;

  // Formulario para formar pareja
  formPareja: FormGroup;
  validandoCodigo = false;
  codigoValido = false;
  usuarioEncontrado: Usuario | null = null;

  // Estados para mostrar en la UI
  estadosPareja = [
    { label: 'Activa', value: EstadoPareja.ACTIVA, icon: 'pi pi-heart-fill', color: 'success' },
    { label: 'Pausada', value: EstadoPareja.PAUSADA, icon: 'pi pi-pause', color: 'warning' },
    { label: 'Terminada', value: EstadoPareja.TERMINADA, icon: 'pi pi-times', color: 'danger' }
  ];

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private codigoRelacionService: CodigoRelacionService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.formPareja = this.fb.group({
      codigoRelacion: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosPareja();
  }

  cargarDatosPareja(): void {
    this.loading = true;
    this.error = null;

    try {
      this.usuarioActual = this.authService.getUser();

      if (this.usuarioActual?.codigoRelacion) {
        // Aquí iría la llamada al servicio para obtener los datos de la pareja
        // Por ahora simulamos datos
        this.simularDatosPareja();
      }
    } catch (error) {
      this.error = 'Error al cargar los datos de la pareja';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  private simularDatosPareja(): void {
    // Simulación de datos mientras no tengamos el servicio completo
    this.pareja = {
      id: 1,
      usuario1Id: this.usuarioActual!.idUsuario!,
      usuario2Id: 2,
      fechaCreacion: '2024-01-15',
      estadoRelacion: EstadoPareja.ACTIVA,
      usuario1Nombre: this.usuarioActual!.nombre + ' ' + this.usuarioActual!.apellido,
      usuario2Nombre: 'María González'
    };

    this.companero = {
      idUsuario: 2,
      nombre: 'María',
      apellido: 'González',
      correo: 'maria@email.com',
      username: 'maria_g',
      password: '',
      enabled: true,
      fotoPerfil: null, // Sin foto por defecto
      fechaNacimiento: '1995-03-20',
      genero: 'F',
      role: Role.USER, // Usar el enum en lugar de objeto hardcodeado
      codigoRelacion: 'ABC123',
      disponibleParaPareja: false // Ya tiene pareja
    };
  }

  getEstadoInfo() {
    return this.estadosPareja.find(e => e.value === this.pareja?.estadoRelacion) || this.estadosPareja[0];
  }

  calcularTiempoJuntos(): string {
    if (!this.pareja?.fechaCreacion) return 'No disponible';

    const fechaCreacion = new Date(this.pareja.fechaCreacion);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaCreacion.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (años > 0) {
      return `${años} año${años > 1 ? 's' : ''} y ${meses % 12} mes${meses % 12 !== 1 ? 'es' : ''}`;
    } else if (meses > 0) {
      return `${meses} mes${meses > 1 ? 'es' : ''} y ${dias % 30} día${dias % 30 !== 1 ? 's' : ''}`;
    } else {
      return `${dias} día${dias !== 1 ? 's' : ''}`;
    }
  }

  getNombreCompleto(usuario: Usuario | null): string {
    if (!usuario) return 'Usuario no disponible';
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  getIniciales(usuario: Usuario | null): string {
    if (!usuario) return 'N/A';
    return `${usuario.nombre.charAt(0)}${usuario.nombre.charAt(0)}`.toUpperCase();
  }

  // ===== MÉTODOS PARA FORMAR PAREJA =====

  /**
   * Validar código de relación ingresado por el usuario
   */
  validarCodigoRelacion(): void {
    if (this.formPareja.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor ingresa un código válido'
      });
      return;
    }

    const codigo = this.formPareja.get('codigoRelacion')?.value;
    this.validandoCodigo = true;
    this.codigoValido = false;
    this.usuarioEncontrado = null;

    this.codigoRelacionService.validarCodigo(codigo).subscribe({
      next: (response) => {
        if (response.p_exito && response.p_data?.usuario) {
          this.codigoValido = true;
          this.usuarioEncontrado = response.p_data.usuario;

          this.messageService.add({
            severity: 'success',
            summary: 'Código Válido',
            detail: `Usuario encontrado: ${this.usuarioEncontrado.nombre} ${this.usuarioEncontrado.apellido}`
          });
        } else {
          this.codigoValido = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Código Inválido',
            detail: response.p_mensavis || 'El código ingresado no es válido'
          });
        }
      },
      error: (err) => {
        this.codigoValido = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al validar el código. Intenta nuevamente.'
        });
      },
      complete: () => {
        this.validandoCodigo = false;
      }
    });
  }

  /**
   * Formar pareja con el usuario encontrado
   */
  formarPareja(): void {
    if (!this.usuarioEncontrado || !this.usuarioActual) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se puede formar la pareja. Verifica la información.'
      });
      return;
    }

    this.loading = true;

    // Aquí iría la llamada al servicio para crear la pareja
    // Por ahora simulamos la creación
    setTimeout(() => {
      this.pareja = {
        id: Date.now(), // ID temporal
        usuario1Id: this.usuarioActual!.idUsuario!,
        usuario2Id: this.usuarioEncontrado.idUsuario!,
        fechaCreacion: new Date().toISOString().split('T')[0],
        estadoRelacion: EstadoPareja.ACTIVA,
        usuario1Nombre: `${this.usuarioActual!.nombre} ${this.usuarioActual!.apellido}`,
        usuario2Nombre: `${this.usuarioEncontrado.nombre} ${this.usuarioEncontrado.apellido}`
      };

      this.companero = this.usuarioEncontrado;
      this.loading = false;
      this.codigoValido = false;
      this.usuarioEncontrado = null;
      this.formPareja.reset();

      this.messageService.add({
        severity: 'success',
        summary: '¡Pareja Formada!',
        detail: `Ahora estás vinculado con ${this.companero.nombre} ${this.companero.apellido}`
      });
    }, 1000);
  }

  /**
   * Limpiar formulario y estado
   */
  limpiarFormulario(): void {
    this.formPareja.reset();
    this.codigoValido = false;
    this.usuarioEncontrado = null;
  }

  /**
   * Generar código de relación para compartir
   */
  generarMiCodigo(): void {
    if (!this.usuarioActual?.username) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se puede generar el código. Usuario no disponible.'
      });
      return;
    }

    this.loading = true;

    this.codigoRelacionService.generarCodigo(this.usuarioActual.username).subscribe({
      next: (response) => {
        if (response.p_exito && response.p_data?.codigo) {
          this.messageService.add({
            severity: 'success',
            summary: 'Código Generado',
            detail: `Tu código de relación es: ${response.p_data.codigo}`
          });

          // Actualizar el usuario local con el nuevo código
          if (this.usuarioActual) {
            this.usuarioActual.codigoRelacion = response.p_data.codigo;
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.p_mensavis || 'No se pudo generar el código'
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al generar el código. Intenta nuevamente.'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Verificar si el campo del formulario es inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formPareja.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Obtener mensaje de error del campo
   */
  getFieldError(fieldName: string): string {
    const field = this.formPareja.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
