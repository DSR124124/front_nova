import { Component, OnInit } from '@angular/core';
import { TokenRefreshService } from './core/services/token-refresh.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'FrontNova';

  constructor(
    private tokenRefreshService: TokenRefreshService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // El servicio de refresh de tokens se inicializa automáticamente
    // No es necesario hacer nada más aquí
  }
}
