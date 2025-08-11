import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });

    // Inicializar breadcrumb en la carga inicial
    this.updateBreadcrumb();
  }

  private updateBreadcrumb() {
    this.items = this.createBreadcrumbs(this.activatedRoute.root);
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
          routerLink: url
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
      'eventos': 'Eventos',
      'lugares': 'Lugares',
      'chat': 'Chat',
      'regalos': 'Regalos',
      'recordatorios': 'Recordatorios',
      'notas': 'Notas',
      'multimedia': 'Multimedia',
      'perfil': 'Perfil',
      'auth': 'Autenticación',
      'login': 'Iniciar Sesión',
      'register': 'Registro',
      'forgot-password': 'Recuperar Contraseña',
      'reset-password': 'Cambiar Contraseña'
    };

    return routeLabels[url] || this.capitalizeFirst(url);
  }

  private capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
