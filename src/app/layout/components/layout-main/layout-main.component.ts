import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.css'],
  standalone: false
})
export class LayoutMainComponent implements OnInit {
  sidebarCollapsed = false;
  isMobile = false;

  constructor(private router: Router) {
    // Suscribirse a los eventos de navegación para debugging
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // En móvil, cerrar sidebar después de navegación
        if (this.isMobile && !this.sidebarCollapsed) {
          this.sidebarCollapsed = true;
        }
      });
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    // En móvil, sidebar debe estar colapsado por defecto
    if (this.isMobile && !this.sidebarCollapsed) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
