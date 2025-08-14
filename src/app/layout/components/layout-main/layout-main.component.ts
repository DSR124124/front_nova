import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router) {
    // Suscribirse a los eventos de navegación para debugging
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Silencioso
      });
  }

  ngOnInit() {
    // Silencioso
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
