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

  onGetStarted(): void {
    this.router.navigate(['/auth/register']);
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
