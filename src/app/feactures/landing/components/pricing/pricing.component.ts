import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
  standalone: false
})
export class PricingComponent {
  pricingPlans = [
    {
      name: 'Gratis',
      price: '0',
      period: 'para siempre',
      description: 'Perfecto para empezar a explorar Nova',
      features: [
        'Hasta 5 citas por mes',
        'Chat básico',
        '1 GB de almacenamiento',
        'Recordatorios básicos',
        'Soporte por email'
      ],
      limitations: [
        'Sin sincronización entre dispositivos',
        'Anuncios incluidos'
      ],
      buttonText: 'Comenzar Gratis',
      buttonStyle: 'pricing-free-btn',
      popular: false
    },
    {
      name: 'Premium',
      price: '9.99',
      period: 'por mes',
      description: 'La opción más popular para parejas comprometidas',
      features: [
        'Citas ilimitadas',
        'Chat avanzado con emojis',
        '10 GB de almacenamiento',
        'Recordatorios inteligentes',
        'Sincronización entre dispositivos',
        'Sin anuncios',
        'Soporte prioritario',
        'Temas personalizados'
      ],
      limitations: [],
      buttonText: 'Comenzar Premium',
      buttonStyle: 'pricing-premium-btn',
      popular: true
    },
    {
      name: 'Pro',
      price: '19.99',
      period: 'por mes',
      description: 'Para parejas que quieren todo incluido',
      features: [
        'Todo lo de Premium',
        'Almacenamiento ilimitado',
        'Análisis de relación',
        'Terapia de pareja online',
        'Eventos exclusivos',
        'Soporte 24/7',
        'API personalizada',
        'White label disponible'
      ],
      limitations: [],
      buttonText: 'Comenzar Pro',
      buttonStyle: 'pricing-pro-btn',
      popular: false
    }
  ];

  constructor(private router: Router) {}

  onSelectPlan(planName: string): void {
    if (planName === 'Gratis') {
      this.router.navigate(['/auth/register']);
    } else {
      // Aquí se redirigiría al proceso de pago
      this.router.navigate(['/auth/register'], {
        queryParams: { plan: planName.toLowerCase() }
      });
    }
  }


}
