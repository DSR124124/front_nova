import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.css'],
  standalone: false
})
export class CtaComponent {
  constructor(private router: Router) {}

  onGetStarted(): void {
    this.router.navigate(['/auth/register']);
  }

  onLearnMore(): void {
    // Scroll to features section
    document.querySelector('.features-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}
