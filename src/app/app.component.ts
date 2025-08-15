import { Component, OnInit } from '@angular/core';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Component initialization logic can go here
  }
}
