import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
  standalone: false
})
export class DemoComponent {
  demoFeatures = [
    {
      title: 'Calendario Inteligente',
      description: 'Organiza citas con recordatorios automáticos y sincronización entre parejas',
      image: 'assets/images/demo-calendar.jpg',
      icon: 'pi pi-calendar',
      color: 'var(--primary-color)'
    },
    {
      title: 'Chat en Tiempo Real',
      description: 'Comunicación fluida con emojis, archivos y notificaciones push',
      image: 'assets/images/demo-chat.jpg',
      icon: 'pi pi-comments',
      color: 'var(--info-color)'
    },
    {
      title: 'Galería Compartida',
      description: 'Almacena y organiza todos tus recuerdos especiales en un solo lugar',
      image: 'assets/images/demo-gallery.jpg',
      icon: 'pi pi-images',
      color: 'var(--success-color)'
    },
    {
      title: 'Lugares Favoritos',
      description: 'Descubre y guarda los mejores lugares para crear momentos inolvidables',
      image: 'assets/images/demo-places.jpg',
      icon: 'pi pi-map-marker',
      color: 'var(--warning-color)'
    }
  ];

  currentFeature = 0;

  constructor(private router: Router) {}

  nextFeature(): void {
    this.currentFeature = (this.currentFeature + 1) % this.demoFeatures.length;
  }

  previousFeature(): void {
    this.currentFeature = this.currentFeature === 0
      ? this.demoFeatures.length - 1
      : this.currentFeature - 1;
  }

  goToFeature(index: number): void {
    this.currentFeature = index;
  }

  onTryDemo(): void {
    this.router.navigate(['/auth/register']);
  }

  onLearnMore(): void {
    document.querySelector('.features-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
