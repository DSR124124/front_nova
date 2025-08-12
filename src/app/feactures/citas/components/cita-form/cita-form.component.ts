import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { CitaService } from '../../../../core/services/cita.service';
import { LugarService } from '../../../../core/services/lugar.service';
import { Cita, EstadoCita } from '../../../../core/models/cita';
import { Lugar, CategoriaLugar } from '../../../../core/models/lugar';

@Component({
  selector: 'app-cita-form',
  standalone: false,
  templateUrl: './cita-form.component.html',
  styleUrl: './cita-form.component.css'
})
export class CitaFormComponent implements OnInit, OnDestroy {
  citaForm: FormGroup;
  lugares: Lugar[] = [];
  categorias = Object.values(CategoriaLugar);
  isEditMode = false;
  citaId: number | null = null;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private lugarService: LugarService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.citaForm = this.createForm();
  }

  ngOnInit() {
    this.cargarLugares();
    this.checkEditMode();
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
      lugarId: ['', Validators.required],
      parejaId: [1] // Temporal, debería venir del servicio de autenticación
    });
  }

  private checkEditMode() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.citaId = +params['id'];
          this.cargarCita();
        }
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

  private cargarCita() {
    if (!this.citaId) return;

    this.loading = true;
    this.citaService.listarPorId(this.citaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cita) => {
          this.citaForm.patchValue({
            titulo: cita.titulo,
            descripcion: cita.descripcion,
            fecha: new Date(cita.fecha),
            lugarId: cita.lugarId,
            parejaId: cita.parejaId
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar cita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la cita'
          });
          this.loading = false;
        }
      });
  }

  onSubmit() {
    if (this.citaForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.citaForm.value;

    // Formatear fecha para el backend
    const cita: Cita = {
      ...formValue,
      fecha: this.formatDateForBackend(formValue.fecha),
      estado: EstadoCita.PLANIFICADA
    };

    if (this.isEditMode && this.citaId) {
      cita.id = this.citaId;
      this.actualizarCita(cita);
    } else {
      this.crearCita(cita);
    }
  }

  private crearCita(cita: Cita) {
    this.citaService.registrar(cita)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita creada correctamente'
          });
          this.router.navigate(['/citas']);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al crear cita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la cita'
          });
          this.loading = false;
        }
      });
  }

  private actualizarCita(cita: Cita) {
    this.citaService.modificar(cita)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita actualizada correctamente'
          });
          this.router.navigate(['/citas']);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al actualizar cita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la cita'
          });
          this.loading = false;
        }
      });
  }

  private formatDateForBackend(date: Date): string {
    if (!date) return '';
    return date.toISOString();
  }

  private markFormGroupTouched() {
    Object.keys(this.citaForm.controls).forEach(key => {
      const control = this.citaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.router.navigate(['/citas']);
  }

  // Métodos de validación para el template
  hasFieldError(fieldName: string): boolean {
    const field = this.citaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.citaForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
