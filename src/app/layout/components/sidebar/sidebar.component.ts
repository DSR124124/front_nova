import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  activeRoute = '';

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      badge: null
    },
    {
      label: 'Citas',
      icon: 'pi pi-calendar',
      route: '/citas',
      badge: null
    },
    {
      label: 'Eventos',
      icon: 'pi pi-calendar-plus',
      route: '/eventos',
      badge: null
    },
    {
      label: 'Lugares',
      icon: 'pi pi-map-marker',
      route: '/lugares',
      badge: null
    },
    {
      label: 'Chat',
      icon: 'pi pi-comments',
      route: '/chat',
      badge: '3'
    },
    {
      label: 'Regalos',
      icon: 'pi pi-gift',
      route: '/regalos',
      badge: null
    },
    {
      label: 'Recordatorios',
      icon: 'pi pi-bell',
      route: '/recordatorios',
      badge: '2'
    },
    {
      label: 'Notas',
      icon: 'pi pi-file-edit',
      route: '/notas',
      badge: null
    },
    {
      label: 'Multimedia',
      icon: 'pi pi-images',
      route: '/multimedia',
      badge: null
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      route: '/perfil',
      badge: null
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
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }
}
