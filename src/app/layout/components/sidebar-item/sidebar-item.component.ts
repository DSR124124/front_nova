import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarItem, SidebarSubItem } from '../../../core/services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
  standalone: false
})
export class SidebarItemComponent implements OnInit, OnDestroy {
  @Input() item!: SidebarItem;
  @Input() sidebarCollapsed: boolean = false;
  @Output() itemClick = new EventEmitter<SidebarItem>();
  @Output() logoutRequested = new EventEmitter<void>();

  expanded = false;
  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    private authService: AuthService
  ) {
    // Suscribirse a los eventos de navegación para actualizar el estado activo
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Forzar la detección de cambios
        this.updateActiveState();
      });
  }

  ngOnInit() {
    this.updateActiveState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(): boolean {
    if (!this.item.routerLink) return false;
    // Solo considerar activo si la ruta coincide exactamente
    const currentUrl = this.router.url;
    const itemRoute = this.item.routerLink;

    // Si es la ruta exacta, está activo
    if (currentUrl === itemRoute) return true;

    // Para items padre con subitems, nunca están activos por sí mismos
    if (this.hasSubmenu()) return false;

    return false;
  }

  hasSubmenu(): boolean {
    return !!(this.item.items && this.item.items.length > 0);
  }

  isSubmenuActive(): boolean {
    if (!this.hasSubmenu()) return false;

    // Verificar si algún subitem está activo
    const hasActiveSubItem = this.item.items!.some(subItem => this.isSubItemActive(subItem));

    // Si hay un subitem activo, expandir automáticamente
    if (hasActiveSubItem && !this.expanded) {
      this.expanded = true;
    }

    return hasActiveSubItem;
  }

  toggleSubmenu(): void {
    if (this.hasSubmenu()) {
      this.expanded = !this.expanded;
    }
  }

  navigateTo(route: string): void {
    if (!route) return;

    // Solo cerrar el submenú si estamos navegando a una ruta diferente
    const currentUrl = this.router.url;
    if (this.expanded && currentUrl !== route) {
      // Mantener el submenú abierto si navegamos a un subitem del mismo menú
      const isSameMenu = this.item.items?.some(subItem => subItem.routerLink === route);
      if (!isSameMenu) {
        this.expanded = false;
      }
    }

    const routeArray = route.split('/').filter(segment => segment.length > 0);
    this.router.navigate(routeArray).then(success => {
      if (success) {
        // Actualizar el estado activo después de la navegación
        this.updateActiveState();
      }
    });
  }

  onSubItemClick(subItem: SidebarSubItem): void {
    // Si es "Cerrar Sesión", emitir evento en lugar de navegar
    if (subItem.label === 'Cerrar Sesión') {
      this.logoutRequested.emit();
      return;
    }

    // Para otros subitems, navegar normalmente
    this.navigateTo(subItem.routerLink);
  }

  private updateActiveState(): void {
    // Forzar la detección de cambios
    setTimeout(() => {
      // Esto fuerza a Angular a detectar cambios en las propiedades computadas
      this.isSubmenuActive();
    }, 0);
  }

  // Método para obtener la clase CSS del item
  getItemClass(): string {
    let classes = 'sidebar-item';

    if (this.hasSubmenu()) {
      classes += ' has-submenu';
    }

    if (this.isSubmenuActive()) {
      classes += ' submenu-active';
    }

    return classes;
  }

  // Método para obtener la clase CSS del submenú
  getSubmenuClass(): string {
    let classes = 'submenu';

    if (this.expanded) {
      classes += ' expanded';
    }

    return classes;
  }

  // Método para verificar si un subitem está activo
  isSubItemActive(subItem: SidebarSubItem): boolean {
    if (!subItem.routerLink) return false;
    const currentUrl = this.router.url;
    const subItemRoute = subItem.routerLink;

    // Verificar si la URL actual coincide exactamente con la ruta del subitem
    if (currentUrl === subItemRoute) return true;

    // Verificar si la URL actual es una subruta del subitem (pero no la misma)
    if (currentUrl.startsWith(subItemRoute + '/')) return true;

    return false;
  }
}
