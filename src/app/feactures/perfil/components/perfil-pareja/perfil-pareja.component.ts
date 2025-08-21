import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ParejaService } from '../../../../core/services/pareja.service';
import { CodigoRelacionService } from '../../../../core/services/codigo-relacion.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';

// Interfaces para el componente
interface EstadoPareja {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface UsuarioSimplificado {
  id: number;
  nombre: string;
  username: string;
  fotoPerfil?: string;
}

interface ParejaInfo {
  id: number;
  fechaCreacion: string;
  estadoRelacion: string;
}

@Component({
  selector: 'app-perfil-pareja',
  standalone: false,
  templateUrl: './perfil-pareja.component.html',
  styleUrl: './perfil-pareja.component.css'
})
export class PerfilParejaComponent implements OnInit, OnDestroy {
  // Estados del componente
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  // Datos de la pareja
  pareja: ParejaInfo | null = null;
  usuarioActual: UsuarioSimplificado | null = null;
  companero: UsuarioSimplificado | null = null;

  // Estado de disponibilidad
  disponibleParaPareja = true;
  codigoRelacion: string | null = null;

  // Formulario para unir códigos
  formUnirCodigos: FormGroup;
  validandoCodigos = false;
  codigosValidos = false;

  // Estados para mostrar en la UI
  estadosPareja: EstadoPareja[] = [
    { label: 'Activa', value: 'ACTIVA', icon: 'pi pi-heart-fill', color: 'success' },
    { label: 'Pausada', value: 'PAUSADA', icon: 'pi pi-pause', color: 'warning' },
    { label: 'Terminada', value: 'TERMINADA', icon: 'pi pi-times', color: 'danger' }
  ];

  constructor(
    private parejaService: ParejaService,
    private codigoRelacionService: CodigoRelacionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.formUnirCodigos = this.fb.group({
      codigo1: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      codigo2: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosPareja();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar datos iniciales de la pareja
   */
  cargarDatosPareja(): void {
    this.loading = true;
    this.error = null;

    try {
      const usuario = this.authService.getUser();
      if (!usuario?.idUsuario) {
        this.error = 'Usuario no autenticado';
        this.loading = false;
        return;
      }

      this.usuarioActual = {
        id: usuario.idUsuario,
        nombre: usuario.nombre,
        username: usuario.username,
        fotoPerfil: usuario.fotoPerfil
      };

      // Verificar disponibilidad para crear pareja
      this.verificarDisponibilidadPareja(usuario.idUsuario);

      // Cargar información de la relación si existe
      this.cargarInfoRelacion(usuario.idUsuario);

    } catch (error) {
      this.error = 'Error al cargar los datos de la pareja';
      console.error('Error:', error);
      this.loading = false;
    }
  }

  /**
   * Verificar si el usuario puede crear una pareja
   */
  private verificarDisponibilidadPareja(idUsuario: number): void {
    this.parejaService.puedeCrearPareja(idUsuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.disponibleParaPareja = response.p_data.disponibleParaPareja;
            this.codigoRelacion = response.p_data.codigoRelacion;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: response.p_mensavis || 'No se pudo verificar la disponibilidad'
            });
          }
        },
        error: (error) => {
          console.error('Error al verificar disponibilidad:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al verificar disponibilidad para pareja'
          });
        }
      });
  }

  /**
   * Cargar información de la relación existente
   */
  private cargarInfoRelacion(idUsuario: number): void {
    this.parejaService.obtenerInfoRelacion(idUsuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.pareja = {
              id: response.p_data.pareja.id,
              fechaCreacion: new Date().toISOString().split('T')[0], // Por defecto
              estadoRelacion: 'ACTIVA' // Por defecto
            };

            // Determinar quién es el compañero
            const usuario1 = response.p_data.usuario1;
            const usuario2 = response.p_data.usuario2;

            if (usuario1.id === idUsuario) {
              this.companero = usuario2;
            } else {
              this.companero = usuario1;
            }

            this.disponibleParaPareja = false; // Ya tiene pareja
          }
        },
        error: (error) => {
          // Si no hay relación, el usuario está disponible
          console.log('Usuario sin relación:', error);
          this.disponibleParaPareja = true;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  /**
   * Unir dos códigos de relación para formar una pareja
   */
  unirCodigos(): void {
    if (this.formUnirCodigos.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor ingresa ambos códigos válidos'
      });
      return;
    }

    const { codigo1, codigo2 } = this.formUnirCodigos.value;
    this.validandoCodigos = true;
    this.codigosValidos = false;

    this.parejaService.unirCodigos(codigo1, codigo2)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.codigosValidos = true;
            this.messageService.add({
              severity: 'success',
              summary: '¡Pareja Creada!',
              detail: response.p_mensavis || 'Los códigos se unieron exitosamente'
            });

            // Recargar datos de la pareja
            this.cargarDatosPareja();

            // Limpiar formulario
            this.formUnirCodigos.reset();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.p_mensavis || 'No se pudieron unir los códigos'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al unir los códigos. Intenta nuevamente.'
          });
        },
        complete: () => {
          this.validandoCodigos = false;
        }
      });
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

    this.codigoRelacionService.generarCodigo(this.usuarioActual.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito && response.p_data?.codigo) {
            this.codigoRelacion = response.p_data.codigo;
            this.messageService.add({
              severity: 'success',
              summary: 'Código Generado',
              detail: `Tu código de relación es: ${response.p_data.codigo}`
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.p_mensavis || 'No se pudo generar el código'
            });
          }
        },
        error: (error) => {
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
   * Limpiar formulario
   */
  limpiarFormulario(): void {
    this.formUnirCodigos.reset();
    this.codigosValidos = false;
  }

  /**
   * Verificar estado de disponibilidad manualmente
   */
  verificarEstadoManual(): void {
    if (!this.usuarioActual?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario no disponible para verificar estado'
      });
      return;
    }

    this.loading = true;
    this.verificarDisponibilidadPareja(this.usuarioActual.id);
  }

  /**
   * Reconfigurar pareja con nuevos códigos
   */
  reconfigurarPareja(): void {
    if (this.formUnirCodigos.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor ingresa ambos códigos válidos para reconfigurar'
      });
      return;
    }

    const { codigo1, codigo2 } = this.formUnirCodigos.value;
    this.validandoCodigos = true;

    this.parejaService.unirCodigos(codigo1, codigo2)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.p_exito) {
            this.messageService.add({
              severity: 'success',
              summary: '¡Relación Reconfigurada!',
              detail: response.p_mensavis || 'La relación se ha reconfigurado exitosamente'
            });

            // Recargar datos de la pareja
            this.cargarDatosPareja();

            // Limpiar formulario
            this.formUnirCodigos.reset();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error en Reconfiguración',
              detail: response.p_mensavis || 'No se pudo reconfigurar la relación'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al reconfigurar la relación. Intenta nuevamente.'
          });
        },
        complete: () => {
          this.validandoCodigos = false;
        }
      });
  }

  /**
   * Obtener información del estado de la pareja
   */
  getEstadoInfo(): EstadoPareja {
    return this.estadosPareja.find(e => e.value === this.pareja?.estadoRelacion) || this.estadosPareja[0];
  }

  /**
   * Calcular tiempo juntos
   */
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

  /**
   * Obtener nombre completo del usuario
   */
  getNombreCompleto(usuario: UsuarioSimplificado | null): string {
    if (!usuario) return 'Usuario no disponible';
    return usuario.nombre || usuario.username;
  }

  /**
   * Obtener iniciales del usuario
   */
  getIniciales(usuario: UsuarioSimplificado | null): string {
    if (!usuario) return 'N/A';
    const nombre = usuario.nombre || usuario.username;
    return nombre.charAt(0).toUpperCase();
  }

  /**
   * Verificar si el campo del formulario es inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formUnirCodigos.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Obtener mensaje de error del campo
   */
  getFieldError(fieldName: string): string {
    const field = this.formUnirCodigos.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
