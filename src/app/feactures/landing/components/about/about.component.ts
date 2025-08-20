import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  aboutData = {
    mission: {
      title: 'Nuestra Misión',
      description: 'Crear la plataforma más completa e intuitiva para que las parejas puedan gestionar su relación de manera inteligente, fortaleciendo los lazos afectivos a través de la tecnología.',
      icon: 'pi pi-heart-fill',
      color: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
    },
    vision: {
      title: 'Nuestra Visión',
      description: 'Ser la aplicación líder mundial en gestión de relaciones de pareja, ayudando a millones de parejas a crear momentos inolvidables y mantener viva la magia del amor.',
      icon: 'pi pi-star-fill',
      color: 'linear-gradient(135deg, #feca57, #ff9ff3)'
    },
    values: [
      {
        title: 'Innovación',
        description: 'Siempre buscamos nuevas formas de mejorar la experiencia de las parejas',
        icon: 'pi pi-lightbulb',
        color: 'linear-gradient(135deg, #48dbfb, #0abde3)'
      },
      {
        title: 'Privacidad',
        description: 'La seguridad y privacidad de tu relación es nuestra máxima prioridad',
        icon: 'pi pi-shield',
        color: 'linear-gradient(135deg, #1dd1a1, #10ac84)'
      },
      {
        title: 'Comunidad',
        description: 'Construimos una comunidad de parejas que se apoyan mutuamente',
        icon: 'pi pi-users',
        color: 'linear-gradient(135deg, #ff9ff3, #f368e0)'
      },

    ],
    stats: [
      { number: 2020, label: 'Año de Fundación', icon: 'pi pi-calendar', suffix: '' },
      { number: 50, label: 'Países', icon: 'pi pi-globe', suffix: '+' },
      { number: 100, label: 'Usuarios Felices', icon: 'pi pi-heart', suffix: 'K+' },
      { number: 24, label: 'Soporte', icon: 'pi pi-clock', suffix: '/7' }
    ],
    timeline: [
      {
        year: '2020',
        title: 'Fundación',
        description: 'Nova nace con la visión de revolucionar las relaciones de pareja',
        icon: 'pi pi-rocket'
      },
      {
        year: '2021',
        title: 'Primer Lanzamiento',
        description: 'Lanzamos nuestra primera versión con funcionalidades básicas',
        icon: 'pi pi-star'
      },
      {
        year: '2022',
        title: 'Expansión Global',
        description: 'Llegamos a más de 25 países y 50K usuarios',
        icon: 'pi pi-globe'
      },
      {
        year: '2023',
        title: 'Innovación Continua',
        description: 'Nuevas características y mejoras basadas en feedback de usuarios',
        icon: 'pi pi-lightbulb'
      },
      {
        year: '2024',
        title: 'Líder del Mercado',
        description: 'Nos convertimos en la plataforma preferida para parejas',
        icon: 'pi pi-trophy'
      }
    ]
  };

  animatedStats: any[] = [];
  isVisible = false;
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.animatedStats = this.aboutData.stats.map(stat => ({
      ...stat,
      animatedNumber: 0,
      isAnimated: false
    }));
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            if (entry.target.classList.contains('stats-section')) {
              this.animateStats();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.animateElements.forEach(element => {
      this.observer.observe(element.nativeElement);
    });
  }

  private animateStats() {
    this.animatedStats.forEach((stat, index) => {
      setTimeout(() => {
        this.animateNumber(stat);
      }, index * 200);
    });
  }

  private animateNumber(stat: any) {
    if (stat.isAnimated) return;

    stat.isAnimated = true;
    const target = stat.number;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.animatedNumber = Math.floor(current);
    }, 16);
  }

  onCardHover(event: any, type: string) {
    const card = event.currentTarget;
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
  }

  onCardLeave(event: any) {
    const card = event.currentTarget;
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '';
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
