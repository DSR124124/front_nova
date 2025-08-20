import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: false
})
export class HeroComponent {
  constructor(private router: Router) {}

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  onWatchDemo(): void {
    // Scroll to demo section
    document.querySelector('.demo-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
