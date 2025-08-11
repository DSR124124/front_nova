import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: any = null;
  notifications: any[] = [];
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadNotifications();
  }

  loadNotifications() {
    // Simular notificaciones - en producción vendrían del servicio
    this.notifications = [
      { id: 1, message: 'Nueva cita programada para mañana', time: '2 min', read: false },
      { id: 2, message: 'Tu pareja agregó un nuevo lugar favorito', time: '1 hora', read: false },
      { id: 3, message: 'Recordatorio: Aniversario en 3 días', time: '3 horas', read: true }
    ];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
