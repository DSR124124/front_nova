import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false
})
export class ContactComponent {
  contactForm: FormGroup;
  contactInfo = [
    {
      icon: 'pi pi-envelope',
      title: 'Email',
      value: 'hola@nova-app.com',
      link: 'mailto:hola@nova-app.com'
    },
    {
      icon: 'pi pi-phone',
      title: 'Teléfono',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: 'pi pi-map-marker',
      title: 'Ubicación',
      value: 'San Francisco, CA',
      link: '#'
    },
    {
      icon: 'pi pi-clock',
      title: 'Horario',
      value: 'Lun - Vie: 9AM - 6PM',
      link: '#'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // Aquí se enviaría el formulario al backend
      this.messageService.add({
        severity: 'success',
        summary: 'Mensaje Enviado',
        detail: 'Gracias por contactarnos. Te responderemos pronto.'
      });
      this.contactForm.reset();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos correctamente.'
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
