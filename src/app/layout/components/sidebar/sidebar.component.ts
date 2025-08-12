import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;
  @Output() sidebarToggle = new EventEmitter<void>();
  
  isMobile = false;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/app/dashboard'
    },
    {
      label: 'Citas',
      icon: 'pi pi-calendar',
      routerLink: '/app/citas',
      items: [
        {
          label: 'Lista de Citas',
          icon: 'pi pi-list',
          routerLink: '/app/citas/listar'
        },
        {
          label: 'Calendario',
          icon: 'pi pi-calendar',
          routerLink: '/app/citas/calendario'
        },
        {
          label: 'Nueva Cita',
          icon: 'pi pi-plus',
          routerLink: '/app/citas/nueva'
        }
      ]
    },
    {
      label: 'Eventos',
      icon: 'pi pi-calendar-plus',
      routerLink: '/app/eventos'
    },
    {
      label: 'Lugares',
      icon: 'pi pi-map-marker',
      routerLink: '/app/lugares'
    },
    {
      label: 'Chat',
      icon: 'pi pi-comments',
      routerLink: '/app/chat',
      badge: '3'
    },
    {
      label: 'Regalos',
      icon: 'pi pi-gift',
      routerLink: '/app/regalos'
    },
    {
      label: 'Recordatorios',
      icon: 'pi pi-bell',
      routerLink: '/app/recordatorios',
      badge: '2'
    },
    {
      label: 'Notas',
      icon: 'pi pi-file-edit',
      routerLink: '/app/notas'
    },
    {
      label: 'Multimedia',
      icon: 'pi pi-images',
      routerLink: '/app/multimedia'
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: '/app/perfil'
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
      this.sidebarToggle.emit();
    }
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.sidebarToggle.emit();
  }
}
