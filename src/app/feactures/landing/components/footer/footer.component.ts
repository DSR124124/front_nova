import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent {
  constructor(private router: Router) {}

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
