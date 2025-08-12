import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cita-main',
  templateUrl: './cita-main.component.html',
  styleUrls: ['./cita-main.component.css'],
  standalone: false
})
export class CitaMainComponent implements OnInit {
  currentRoute = '';
  menuItems = [
    { label: 'Lista', icon: 'pi pi-list', route: '/citas/listar' },
    { label: 'Calendario', icon: 'pi pi-calendar', route: '/citas/calendario' },
    { label: 'Nueva Cita', icon: 'pi pi-plus', route: '/citas/nueva' },
    { label: 'Filtros', icon: 'pi pi-filter', route: '/citas/filtros' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
      });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
