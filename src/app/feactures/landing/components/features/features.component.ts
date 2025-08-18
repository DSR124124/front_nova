import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
  standalone: false
})
export class FeaturesComponent {
  features = [
    {
      icon: 'pi pi-calendar',
      title: 'Gestión de Citas',
      description: 'Organiza y planifica tus citas con un calendario inteligente y recordatorios automáticos.',
      color: 'var(--primary-color)'
    },
    {
      icon: 'pi pi-map-marker',
      title: 'Lugares Favoritos',
      description: 'Descubre y guarda los lugares más especiales para crear momentos inolvidables.',
      color: 'var(--success-color)'
    },
    {
      icon: 'pi pi-comments',
      title: 'Chat en Tiempo Real',
      description: 'Mantén la comunicación fluida con tu pareja a través de mensajes instantáneos.',
      color: 'var(--info-color)'
    },
    {
      icon: 'pi pi-gift',
      title: 'Sistema de Regalos',
      description: 'Gestiona listas de deseos y sorprende a tu pareja con regalos perfectos.',
      color: 'var(--warning-color)'
    },
    {
      icon: 'pi pi-image',
      title: 'Multimedia Compartida',
      description: 'Almacena y comparte fotos, videos y recuerdos especiales de tu relación.',
      color: 'var(--danger-color)'
    },
    {
      icon: 'pi pi-bell',
      title: 'Recordatorios Inteligentes',
      description: 'Nunca olvides fechas importantes con notificaciones personalizadas.',
      color: 'var(--primary-600)'
    }
  ];
}
