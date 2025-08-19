import { Component, OnInit } from '@angular/core';
import { Pareja, EstadoPareja } from '../../../../core/models/pareja';
import { Usuario } from '../../../../core/models/Usuario/Usuario';
// Role enum removido - ahora usamos string directamente
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Role } from '../../../../core/models/enums/role.enum';

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

  // Estados para mostrar en la UI
  estadosPareja = [
    { label: 'Activa', value: EstadoPareja.ACTIVA, icon: 'pi pi-heart-fill', color: 'success' },
    { label: 'Pausada', value: EstadoPareja.PAUSADA, icon: 'pi pi-pause', color: 'warning' },
    { label: 'Terminada', value: EstadoPareja.TERMINADA, icon: 'pi pi-times', color: 'danger' }
  ];

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

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
    return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
  }
}
