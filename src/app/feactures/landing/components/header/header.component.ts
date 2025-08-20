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

  scrollToDemo(): void {
    document.querySelector('.demo-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  scrollToTestimonials(): void {
    document.querySelector('.testimonials-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  scrollToAbout(): void {
    document.querySelector('#about')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  scrollToPricing(): void {
    document.querySelector('#pricing')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  scrollToContact(): void {
    document.querySelector('#contact')?.scrollIntoView({
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
      case 'demo':
        this.scrollToDemo();
        break;
      case 'testimonials':
        this.scrollToTestimonials();
        break;
      case 'about':
        this.scrollToAbout();
        break;
      case 'pricing':
        this.scrollToPricing();
        break;
      case 'contact':
        this.scrollToContact();
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
