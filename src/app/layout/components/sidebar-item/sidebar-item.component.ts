import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarItem, SidebarSubItem } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
  standalone: false
})
export class SidebarItemComponent implements OnInit, OnDestroy {
  @Input() item!: SidebarItem;
  @Input() sidebarCollapsed: boolean = false;

  expanded = false;
  private destroy$ = new Subject<void>();

  constructor(public router: Router) {
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
    const isActive = this.router.url.startsWith(this.item.routerLink);
    return isActive;
  }

  hasSubmenu(): boolean {
    return !!(this.item.items && this.item.items.length > 0);
  }

  isSubmenuActive(): boolean {
    if (!this.hasSubmenu()) return false;
    const isActive = this.item.items!.some(subItem =>
      subItem.routerLink && this.router.url.startsWith(subItem.routerLink)
    );
    
    // Si hay un subitem activo, expandir automáticamente
    if (isActive && !this.expanded) {
      this.expanded = true;
    }
    
    return isActive;
  }

  toggleSubmenu(): void {
    if (this.hasSubmenu()) {
      this.expanded = !this.expanded;
    }
  }

  navigateTo(route: string): void {
    if (!route) return;
    
    // Cerrar el submenú después de navegar
    if (this.expanded) {
      this.expanded = false;
    }
    
    const routeArray = route.split('/').filter(segment => segment.length > 0);
    this.router.navigate(routeArray).then(success => {
      if (success) {
        // Actualizar el estado activo después de la navegación
        this.updateActiveState();
      }
    });
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
    return this.router.url.startsWith(subItem.routerLink);
  }
}
