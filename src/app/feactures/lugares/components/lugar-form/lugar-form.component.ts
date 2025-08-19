import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LugarService } from '../../../../core/services/lugar.service';
import { Lugar, CategoriaLugar } from '../../../../core/models/Interfaces/lugar/lugar';

@Component({
  selector: 'app-lugar-form',
  standalone: false,
  templateUrl: './lugar-form.component.html',
  styleUrl: './lugar-form.component.css'
})
export class LugarFormComponent implements OnInit {
  lugarForm: FormGroup;
  editMode = false;
  lugarId: number | null = null;
  loading = false;
  submitted = false;

  // Opciones para los campos
  categoriaOptions = [
    { label: 'Restaurante', value: CategoriaLugar.RESTAURANTE, icon: 'pi pi-utensils' },
    { label: 'Parque', value: CategoriaLugar.PARQUE, icon: 'pi pi-tree' },
    { label: 'Cine', value: CategoriaLugar.CINE, icon: 'pi pi-video' },
    { label: 'Entretenimiento', value: CategoriaLugar.ENTRETENIMIENTO, icon: 'pi pi-gamepad' },
    { label: 'Casa', value: CategoriaLugar.CASA, icon: 'pi pi-home' },
    { label: 'Otro', value: CategoriaLugar.OTRO, icon: 'pi pi-map-marker' }
  ];

  precioOptions = [
    { label: 'Económico', value: 'ECONOMICO' },
    { label: 'Moderado', value: 'MODERADO' },
    { label: 'Alto', value: 'ALTO' },
    { label: 'Premium', value: 'PREMIUM' }
  ];

  constructor(
    private fb: FormBuilder,
    private lugarService: LugarService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.lugarForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      categoria: ['', Validators.required],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      precio: ['', Validators.required],
      horario: ['', [Validators.maxLength(100)]],
      telefono: ['', [Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/)]],
      email: ['', [Validators.email]],
      sitioWeb: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      latitud: [null, [Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.min(-180), Validators.max(180)]],
      servicios: [[]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.lugarId = +params['id'];
        this.cargarLugar(this.lugarId);
      }
    });
  }

  cargarLugar(id: number): void {
    this.loading = true;
    this.lugarService.getLugarById(id).subscribe({
      next: (lugar) => {
        this.lugarForm.patchValue({
          nombre: lugar.nombre,
          descripcion: lugar.descripcion || '',
          direccion: lugar.direccion || '',
          categoria: lugar.categoria || '',
          rating: lugar.rating || 0,
          precio: lugar.precio || '',
          horario: lugar.horario || '',
          telefono: lugar.telefono || '',
          email: lugar.email || '',
          sitioWeb: lugar.sitioWeb || '',
          latitud: lugar.latitud || null,
          longitud: lugar.longitud || null,
          servicios: lugar.servicios || []
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el lugar'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.lugarForm.valid) {
      this.loading = true;
      const lugarData: Lugar = this.lugarForm.value;

      if (this.lugarForm.get('latitud')?.value && this.lugarForm.get('longitud')?.value) {
        lugarData.coordenadas = {
          lat: this.lugarForm.get('latitud')?.value,
          lng: this.lugarForm.get('longitud')?.value
        };
      }

      if (this.editMode && this.lugarId) {
        this.lugarService.updateLugar(this.lugarId, lugarData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Lugar actualizado correctamente'
            });
            this.router.navigate(['/app/lugares/listar']);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el lugar'
            });
            this.loading = false;
          }
        });
      } else {
        this.lugarService.createLugar(lugarData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Lugar creado correctamente'
            });
            this.router.navigate(['/app/lugares/listar']);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el lugar'
            });
            this.loading = false;
          }
        });
      }
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.lugarForm.get(fieldName);
    if (field && field.errors && this.submitted) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
      if (field.errors['email']) return 'Formato de email inválido';
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  cancelar(): void {
    this.router.navigate(['/app/lugares/listar']);
  }

  // Método para obtener coordenadas automáticamente (opcional)
  obtenerCoordenadas(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lugarForm.patchValue({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          });
          this.messageService.add({
            severity: 'info',
            summary: 'Coordenadas',
            detail: 'Coordenadas obtenidas automáticamente'
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Ubicación',
            detail: 'No se pudieron obtener las coordenadas automáticamente'
          });
        }
      );
    }
  }
}
