import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {
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
}
