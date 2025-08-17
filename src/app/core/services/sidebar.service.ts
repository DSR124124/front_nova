import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SidebarItem {
  label: string;
  icon: string;
  routerLink?: string;
  items?: SidebarSubItem[];
  badge?: string;
}

export interface SidebarSubItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/user/dashboard'
    },
    {
      label: 'Citas',
      icon: 'pi pi-calendar',
      routerLink: '',
      items: [
        { label: 'Lista de Citas', icon: 'pi pi-list', routerLink: '/user/citas/listar' },
        { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/user/citas/calendario' },
        { label: 'Nueva Cita', icon: 'pi pi-plus', routerLink: '/user/citas/nueva' }
      ]
    },
    {
      label: 'Eventos',
      icon: 'pi pi-star',
      routerLink: '',
      items: [
        { label: 'Lista de Eventos', icon: 'pi pi-list', routerLink: '/user/eventos/listar' },
        { label: 'Crear Evento', icon: 'pi pi-plus', routerLink: '/user/eventos/crear' },
        { label: 'Línea de Tiempo', icon: 'pi pi-clock', routerLink: '/user/eventos/timeline' }
      ]
    },
    {
      label: 'Lugares',
      icon: 'pi pi-map-marker',
      routerLink: '',
      items: [
        { label: 'Crear Lugar', icon: 'pi pi-plus', routerLink: '/user/lugares/crear' },
        { label: 'Mapa', icon: 'pi pi-map', routerLink: '/user/lugares/mapa' },
        { label: 'Favoritos', icon: 'pi pi-heart', routerLink: '/user/lugares/favoritos' }
      ]
    },
    {
      label: 'Chat',
      icon: 'pi pi-comments',
      routerLink: '/user/chat'
    },
    {
      label: 'Regalos',
      icon: 'pi pi-gift',
      routerLink: '',
      items: [
        { label: 'Lista de Deseos', icon: 'pi pi-heart', routerLink: '/user/regalos/deseos' },
        { label: 'Historial', icon: 'pi pi-history', routerLink: '/user/regalos/historial' },
        { label: 'Estadísticas', icon: 'pi pi-chart-bar', routerLink: '/user/regalos/estadisticas' }
      ]
    },
    {
      label: 'Recordatorios',
      icon: 'pi pi-bell',
      routerLink: '',
      items: [
        { label: 'Lista de Recordatorios', icon: 'pi pi-list', routerLink: '/user/recordatorios/lista' },
        { label: 'Crear Recordatorio', icon: 'pi pi-plus', routerLink: '/user/recordatorios/nuevo' },
        { label: 'Calendario', icon: 'pi pi-calendar', routerLink: '/user/recordatorios/calendario' },
      ]
    },
    {
      label: 'Notas',
      icon: 'pi pi-file',
      routerLink: '',
      items: [
        { label: 'Mis Notas', icon: 'pi pi-list', routerLink: '/user/notas/listar' },
        { label: 'Nueva Nota', icon: 'pi pi-plus', routerLink: '/user/notas/crear' },
        { label: 'Buscar Notas', icon: 'pi pi-search', routerLink: '/user/notas/buscar' }
      ]
    },
    {
      label: 'Multimedia',
      icon: 'pi pi-images',
      routerLink: '',
      items: [
        { label: 'Galería', icon: 'pi pi-images', routerLink: '/user/multimedia/galeria' },
        { label: 'Subir Archivos', icon: 'pi pi-upload', routerLink: '/user/multimedia/subir' },
      ]
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: '',
      items: [
        { label: 'Mi Perfil', icon: 'pi pi-user', routerLink: '/user/perfil/usuario' },
        { label: 'Perfil de Pareja', icon: 'pi pi-users', routerLink: '/user/perfil/pareja' },
        { label: 'Configuración', icon: 'pi pi-cog', routerLink: '/user/perfil/configuracion' },
        { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', routerLink: '' }
      ]
    }
  ];

  constructor() { }

  /**
   * Obtiene todos los elementos del menú del sidebar
   */
  getMenuItems(): Observable<SidebarItem[]> {
    return of([...this.menuItems]);
  }

  /**
   * Obtiene un elemento específico del menú por su ruta
   */
  getMenuItemByRoute(route: string): SidebarItem | undefined {
    // Normalizar la ruta para comparar correctamente
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;

    return this.menuItems.find(item =>
      item.routerLink === normalizedRoute ||
      item.items?.some(subItem => subItem.routerLink === normalizedRoute)
    );
  }

  /**
   * Obtiene elementos del menú por categoría (con o sin submenús)
   */
  getMenuItemsByCategory(hasSubmenu: boolean): SidebarItem[] {
    return this.menuItems.filter(item =>
      hasSubmenu ? (item.items && item.items.length > 0) : (!item.items || item.items.length === 0)
    );
  }

  /**
   * Busca elementos del menú por texto
   */
  searchMenuItems(searchTerm: string): SidebarItem[] {
    const term = searchTerm.toLowerCase();
    return this.menuItems.filter(item =>
      item.label.toLowerCase().includes(term) ||
      item.items?.some(subItem => subItem.label.toLowerCase().includes(term))
    );
  }

  /**
   * Agrega un nuevo elemento al menú
   */
  addMenuItem(menuItem: SidebarItem): void {
    this.menuItems.push(menuItem);
  }

  /**
   * Actualiza un elemento existente del menú
   */
  updateMenuItem(route: string, updatedItem: SidebarItem): void {
    const index = this.menuItems.findIndex(item => item.routerLink === route);
    if (index !== -1) {
      this.menuItems[index] = updatedItem;
    }
  }

  /**
   * Elimina un elemento del menú
   */
  removeMenuItem(route: string): void {
    const index = this.menuItems.findIndex(item => item.routerLink === route);
    if (index !== -1) {
      this.menuItems.splice(index, 1);
    }
  }

  /**
   * Obtiene elementos del menú con badges
   */
  getMenuItemsWithBadges(): SidebarItem[] {
    return this.menuItems.filter(item => item.badge);
  }

  /**
   * Actualiza el badge de un elemento del menú
   */
  updateMenuItemBadge(route: string, badge: string): void {
    const item = this.menuItems.find(item => item.routerLink === route);
    if (item) {
      item.badge = badge;
    }
  }
}
