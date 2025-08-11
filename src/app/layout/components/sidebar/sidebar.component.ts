import { Component, OnInit, HostListener } from '@angular/core';
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
  isMobile = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Citas',
      icon: 'pi pi-calendar',
      routerLink: '/citas'
    },
    {
      label: 'Eventos',
      icon: 'pi pi-calendar-plus',
      routerLink: '/eventos'
    },
    {
      label: 'Lugares',
      icon: 'pi pi-map-marker',
      routerLink: '/lugares'
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
      routerLink: '/regalos'
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
      routerLink: '/notas'
    },
    {
      label: 'Multimedia',
      icon: 'pi pi-images',
      routerLink: '/multimedia'
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: '/perfil'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.collapsed = true;
    }
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}