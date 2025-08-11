import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  activeRoute = '';
  currentExpandedItemIndex: number[] = [];

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
      badge: undefined
    },
    {
      label: 'Citas',
      icon: 'pi pi-calendar',
      routerLink: '/citas',
      badge: undefined
    },
    {
      label: 'Eventos',
      icon: 'pi pi-calendar-plus',
      routerLink: '/eventos',
      badge: undefined
    },
    {
      label: 'Lugares',
      icon: 'pi pi-map-marker',
      routerLink: '/lugares',
      badge: undefined
    },
    {
      label: 'Chat',
      icon: 'pi pi-comments',
      routerLink: '/chat',
      badge: '3'
    },
    {
      label: 'Regalos',
      icon: 'pi pi-gift',
      routerLink: '/regalos',
      badge: undefined
    },
    {
      label: 'Recordatorios',
      icon: 'pi pi-bell',
      routerLink: '/recordatorios',
      badge: '2'
    },
    {
      label: 'Notas',
      icon: 'pi pi-file-edit',
      routerLink: '/notas',
      badge: undefined
    },
    {
      label: 'Multimedia',
      icon: 'pi pi-images',
      routerLink: '/multimedia',
      badge: undefined
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: '/perfil',
      badge: undefined
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.setActiveRoute();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveRoute();
      });
  }

  setActiveRoute() {
    const currentUrl = this.router.url;
    this.activeRoute = currentUrl;

    // Encontrar el índice del elemento activo
    const activeIndex = this.menuItems.findIndex(item =>
      item.routerLink && currentUrl.startsWith(item.routerLink)
    );

    if (activeIndex !== -1) {
      this.currentExpandedItemIndex = [activeIndex];
    }
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  handleExpandChange(event: { index: number; expanded: boolean }) {
    if (event.expanded) {
      // Solo permitir un elemento expandido a la vez
      this.currentExpandedItemIndex = [event.index];
    } else {
      this.currentExpandedItemIndex = this.currentExpandedItemIndex.filter(i => i !== event.index);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }
}
