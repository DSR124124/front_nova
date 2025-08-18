import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  onHome(): void {
    this.router.navigate(['/']);
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  scrollToFeatures(): void {
    document.querySelector('.features-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onMobileMenuClick(action: string): void {
    this.isMobileMenuOpen = false; // Cerrar menú al hacer clic
    
    switch (action) {
      case 'home':
        this.onHome();
        break;
      case 'features':
        this.scrollToFeatures();
        break;
      case 'about':
        // TODO: Implementar navegación a sección Acerca de
        break;
      case 'contact':
        // TODO: Implementar navegación a sección Contacto
        break;
      case 'login':
        this.onLogin();
        break;
      case 'register':
        this.onRegister();
        break;
    }
  }
}
