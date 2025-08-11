import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  footerLinks = [
    { label: 'Acerca de', route: '/about' },
    { label: 'Privacidad', route: '/privacy' },
    { label: 'Términos', route: '/terms' },
    { label: 'Soporte', route: '/support' }
  ];

  socialLinks = [
    { icon: 'pi pi-facebook', url: '#', label: 'Facebook' },
    { icon: 'pi pi-twitter', url: '#', label: 'Twitter' },
    { icon: 'pi pi-instagram', url: '#', label: 'Instagram' },
    { icon: 'pi pi-linkedin', url: '#', label: 'LinkedIn' }
  ];
}
