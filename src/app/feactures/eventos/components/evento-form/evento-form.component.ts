import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { EventoService } from '../../../../core/services/evento.service';
import { LugarService } from '../../../../core/services/lugar.service';
import { Evento } from '../../../../core/models/evento';
import { Lugar } from '../../../../core/models/lugar';

@Component({
  selector: 'app-evento-form',
  standalone: false,
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.css'
})
export class EventoFormComponent implements OnInit, AfterViewInit, OnDestroy {
  eventoForm: FormGroup;
  lugares: Lugar[] = [];
  loading = false;
  editMode = false;
  eventoId: number = 0;

  // Opciones para el tipo de evento
  tipoOptions = [
    { label: 'Aniversario', value: 'ANIVERSARIO', icon: 'pi pi-heart' },
    { label: 'Cumpleaños', value: 'CUMPLEAÑOS', icon: 'pi pi-gift' },
    { label: 'San Valentín', value: 'SAN_VALENTIN', icon: 'pi pi-heart-fill' },
    { label: 'Fecha Especial', value: 'FECHA_ESPECIAL', icon: 'pi pi-star' },
    { label: 'Cita Romántica', value: 'CITA_ROMANTICA', icon: 'pi pi-calendar-plus' },
    { label: 'Viaje', value: 'VIAJE', icon: 'pi pi-map' },
    { label: 'Celebración', value: 'CELEBRACION', icon: 'pi pi-sparkles' },
    { label: 'Otro', value: 'OTRO', icon: 'pi pi-circle' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private lugarService: LugarService,
    private messageService: MessageService
  ) {
    this.eventoForm = this.createForm();
  }

  ngOnInit() {
    this.cargarLugares();
    this.checkEditMode();
  }

  ngAfterViewInit() {
    // Asegurar que el DOM esté completamente cargado para PrimeNG Calendar
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fecha: ['', Validators.required],
      tipo: ['OTRO'],
      lugarId: [''],
      parejaId: [1] // Temporal, debería venir del servicio de autenticación
    });
  }

  private cargarLugares() {
    this.lugarService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          this.lugares = lugares;
        },
        error: (error) => {
          console.error('Error al cargar lugares:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los lugares'
          });
        }
      });
  }

  private checkEditMode() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.eventoId = +params['id'];
        if (this.eventoId) {
          this.editMode = true;
          this.cargarEvento();
        }
      });
  }

  private cargarEvento() {
    this.loading = true;
    this.eventoService.listarPorId(this.eventoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (evento) => {
          // Convertir la fecha ISO a formato datetime-local
          const fechaEvento = new Date(evento.fecha);
          const fechaLocal = new Date(fechaEvento.getTime() - fechaEvento.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);

          this.eventoForm.patchValue({
            titulo: evento.titulo,
            descripcion: evento.descripcion || '',
            fecha: fechaLocal,
            tipo: evento.tipo || 'OTRO',
            lugarId: evento.lugarId || '',
            parejaId: evento.parejaId
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar evento:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el evento'
          });
          this.loading = false;
        }
      });
  }

  onSubmit() {
    if (this.eventoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const eventoData: Evento = this.eventoForm.value;

    // Convertir la fecha datetime-local a ISO string
    if (eventoData.fecha) {
      eventoData.fecha = new Date(eventoData.fecha).toISOString();
    }

    if (this.editMode) {
      eventoData.id = this.eventoId;
      this.eventoService.modificar(eventoData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evento actualizado correctamente'
            });
            this.router.navigate(['/app/eventos']);
          },
          error: (error) => {
            console.error('Error al actualizar evento:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el evento'
            });
            this.loading = false;
          }
        });
    } else {
      this.eventoService.registrar(eventoData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evento creado correctamente'
            });
            this.router.navigate(['/app/eventos']);
          },
          error: (error) => {
            console.error('Error al crear evento:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el evento'
            });
            this.loading = false;
          }
        });
    }
  }

  onCancel() {
    this.router.navigate(['/eventos']);
  }

  // Utilidades para validación
  private markFormGroupTouched() {
    Object.keys(this.eventoForm.controls).forEach(key => {
      const control = this.eventoForm.get(key);
      control?.markAsTouched();
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.eventoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.eventoForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        const labels: { [key: string]: string } = {
          'titulo': 'El título',
          'fecha': 'La fecha'
        };
        return `${labels[fieldName] || fieldName} es requerido`;
      }
      if (field.errors['minlength']) {
        return `El título debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  // Método para obtener fecha mínima en formato datetime-local
  getMinDateTime(): string {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);
    return localDateTime;
  }

  // Método para cancelar y volver a la lista
  cancelar(): void {
    this.router.navigate(['/app/eventos']);
  }
}
