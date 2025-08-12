import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/app/dashboard',
    label: 'Inicio'
  };

  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateBreadcrumb();
      });

    // Inicializar breadcrumb en la carga inicial
    this.updateBreadcrumb();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBreadcrumb() {
    this.loading = true;

    // Pequeño delay para mostrar el estado de carga
    setTimeout(() => {
      this.items = this.createBreadcrumbs(this.activatedRoute.root);
      this.loading = false;
    }, 100);
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = this.getBreadcrumbLabel(child.snapshot.data, routeURL);
      if (label) {
        breadcrumbs.push({
          label: label,
          routerLink: url,
          icon: this.getBreadcrumbIcon(routeURL)
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getBreadcrumbLabel(data: any, url: string): string {
    // Si hay datos de breadcrumb en la ruta, usarlos
    if (data && data['breadcrumb']) {
      return data['breadcrumb'];
    }

    // Mapeo de rutas a etiquetas
    const routeLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'citas': 'Citas',
      'listar': 'Lista',
      'nueva': 'Nueva Cita',
      'editar': 'Editar Cita',
      'calendario': 'Calendario',
      'filtros': 'Filtros',
      'eventos': 'Eventos',
      'crear': 'Crear',
      'galeria': 'Galería',
      'lugares': 'Lugares',
      'explorar': 'Explorar',
      'favoritos': 'Favoritos',
      'agregar': 'Agregar',
      'chat': 'Chat',
      'regalos': 'Regalos',
      'deseos': 'Lista de Deseos',
      'historial': 'Historial',
      'estadisticas': 'Estadísticas',
      'recordatorios': 'Recordatorios',
      'notificaciones': 'Notificaciones',
      'notas': 'Notas',
      'buscar': 'Buscar',
      'multimedia': 'Multimedia',
      'subir': 'Subir Archivos',
      'perfil': 'Perfil',
      'usuario': 'Mi Perfil',
      'pareja': 'Perfil de Pareja',
      'configuracion': 'Configuración',
      'password': 'Cambiar Contraseña',
      'auth': 'Autenticación',
      'login': 'Iniciar Sesión',
      'register': 'Registro',
      'forgot-password': 'Recuperar Contraseña',
      'reset-password': 'Cambiar Contraseña'
    };

    return routeLabels[url] || this.capitalizeFirst(url);
  }

  private getBreadcrumbIcon(url: string): string {
    // Mapeo de rutas a iconos
    const routeIcons: { [key: string]: string } = {
      'dashboard': 'pi pi-home',
      'citas': 'pi pi-calendar',
      'listar': 'pi pi-list',
      'nueva': 'pi pi-plus',
      'editar': 'pi pi-pencil',
      'calendario': 'pi pi-calendar',
      'filtros': 'pi pi-filter',
      'eventos': 'pi pi-star',
      'crear': 'pi pi-plus',
      'galeria': 'pi pi-images',
      'lugares': 'pi pi-map-marker',
      'explorar': 'pi pi-search',
      'favoritos': 'pi pi-heart',
      'agregar': 'pi pi-plus',
      'chat': 'pi pi-comments',
      'regalos': 'pi pi-gift',
      'deseos': 'pi pi-heart',
      'historial': 'pi pi-history',
      'estadisticas': 'pi pi-chart-bar',
      'recordatorios': 'pi pi-bell',
      'notificaciones': 'pi pi-bell',
      'notas': 'pi pi-file',
      'buscar': 'pi pi-search',
      'multimedia': 'pi pi-images',
      'subir': 'pi pi-upload',
      'perfil': 'pi pi-user',
      'usuario': 'pi pi-user',
      'pareja': 'pi pi-users',
      'configuracion': 'pi pi-cog',
      'password': 'pi pi-key'
    };

    return routeIcons[url] || 'pi pi-circle';
  }

  private capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Método para navegar manualmente
  navigateTo(route: string): void {
    if (route && route !== this.router.url) {
      this.router.navigate([route]);
    }
  }

  // Método para obtener la clase CSS del contenedor
  getContainerClass(): string {
    return `breadcrumb-container ${this.loading ? 'loading' : ''}`;
  }
}
