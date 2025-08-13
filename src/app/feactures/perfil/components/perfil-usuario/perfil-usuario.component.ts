import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ParejaService } from '../../../../core/services/pareja.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario';
import { Pareja } from '../../../../core/models/pareja';

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

  constructor(
    private usuarioService: UsuarioService,
    private parejaService: ParejaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.isAuthenticated = this.authService.isLoggedIn();

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
    switch (this.usuario.role) {
      case 'ADMIN': return 'Administrador';
      case 'USER': return 'Usuario';
      default: return 'Desconocido';
    }
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
}
