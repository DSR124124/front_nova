import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
  standalone: false
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'María & Carlos',
      location: 'Madrid, España',
      avatar: 'assets/images/avatar1.jpg',
      rating: 5,
      text: 'Nova ha transformado completamente nuestra relación. Ahora nunca olvidamos nuestras fechas especiales y siempre tenemos planes emocionantes para hacer juntos.',
      feature: 'Gestión de Citas'
    },
    {
      name: 'Ana & David',
      location: 'Barcelona, España',
      avatar: 'assets/images/avatar2.jpg',
      rating: 5,
      text: 'El chat en tiempo real nos mantiene conectados todo el día. Es como tener a mi pareja siempre cerca, sin importar dónde estemos.',
      feature: 'Chat en Tiempo Real'
    },
    {
      name: 'Sofía & Miguel',
      location: 'Valencia, España',
      avatar: 'assets/images/avatar3.jpg',
      rating: 5,
      text: 'Los lugares favoritos nos han ayudado a descubrir rincones mágicos en nuestra ciudad. Cada fin de semana es una nueva aventura.',
      feature: 'Lugares Favoritos'
    },
    {
      name: 'Laura & Javier',
      location: 'Sevilla, España',
      avatar: 'assets/images/avatar4.jpg',
      rating: 5,
      text: 'El sistema de regalos es genial. Ahora siempre sé qué regalarle a mi pareja y nunca me quedo sin ideas.',
      feature: 'Sistema de Regalos'
    },
    {
      name: 'Carmen & Roberto',
      location: 'Málaga, España',
      avatar: 'assets/images/avatar5.jpg',
      rating: 5,
      text: 'Las notificaciones inteligentes nos recuerdan fechas importantes. Es como tener un asistente personal para nuestra relación.',
      feature: 'Recordatorios Inteligentes'
    },
    {
      name: 'Isabel & Fernando',
      location: 'Bilbao, España',
      avatar: 'assets/images/avatar6.jpg',
      rating: 5,
      text: 'La galería multimedia nos permite guardar todos nuestros recuerdos en un solo lugar. Es nuestro álbum digital de amor.',
      feature: 'Multimedia Compartida'
    }
  ];

  currentTestimonial = 0;

  nextTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  previousTestimonial(): void {
    this.currentTestimonial = this.currentTestimonial === 0
      ? this.testimonials.length - 1
      : this.currentTestimonial - 1;
  }

  goToTestimonial(index: number): void {
    this.currentTestimonial = index;
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
