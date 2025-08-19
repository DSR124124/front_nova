import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { CitaService } from '../../../../core/services/cita.service';
import { LugarService } from '../../../../core/services/lugar.service';
import { Cita } from '../../../../core/models/Interfaces/cita/cita';
import { EstadoCita } from '../../../../core/models/enums/estado-cita.enum';
import { Lugar } from '../../../../core/models/Interfaces/lugar/lugar';
import { CategoriaLugar } from '../../../../core/models/enums/categoria-lugar.enum';

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
    console.log('🔧 CitaFormComponent constructor ejecutado');
    this.citaForm = this.createForm();
  }

  ngOnInit() {
    console.log('🚀 CitaFormComponent ngOnInit ejecutado');
    this.cargarLugares();
    this.checkEditMode();
  }

  ngOnDestroy() {
    console.log('💀 CitaFormComponent ngOnDestroy ejecutado');
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para obtener fecha mínima para el input datetime-local
  getMinDateTime(): string {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  private createForm(): FormGroup {
    console.log('📝 Creando formulario de cita');
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fecha: ['', Validators.required],
      lugarId: ['', Validators.required],
      parejaId: [1] // Temporal, debería venir del servicio de autenticación
    });
  }

  private checkEditMode() {
    console.log('🔍 Verificando modo de edición');
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        console.log('📋 Parámetros de ruta:', params);
        if (params['id']) {
          this.isEditMode = true;
          this.citaId = +params['id'];
          console.log('✏️ Modo edición activado para cita ID:', this.citaId);
          this.cargarCita();
        } else {
          console.log('➕ Modo creación activado');
        }
      });
  }

  private cargarLugares() {
    console.log('🏢 Cargando lugares...');
    this.lugarService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          console.log('✅ Lugares cargados exitosamente:', lugares);
          this.lugares = lugares;
        },
        error: (error) => {
          console.error('❌ Error al cargar lugares:', error);
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

    console.log('📋 Cargando cita con ID:', this.citaId);
    this.loading = true;
    this.citaService.listarPorId(this.citaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cita) => {
          console.log('✅ Cita cargada exitosamente:', cita);
          // Convertir la fecha ISO a formato datetime-local
          const fechaCita = new Date(cita.fecha);
          const fechaLocal = new Date(fechaCita.getTime() - fechaCita.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);

          this.citaForm.patchValue({
            titulo: cita.titulo,
            descripcion: cita.descripcion,
            fecha: fechaLocal,
            lugarId: cita.lugarId,
            parejaId: cita.parejaId
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar cita:', error);
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
    console.log('📤 Enviando formulario...');
    if (this.citaForm.invalid) {
      console.log('❌ Formulario inválido, marcando campos como tocados');
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.citaForm.value;
    console.log('📋 Valores del formulario:', formValue);

    // Formatear fecha para el backend
    const cita: Cita = {
      ...formValue,
      fecha: this.formatDateForBackend(formValue.fecha),
      estado: EstadoCita.PLANIFICADA
    };

    if (this.isEditMode && this.citaId) {
      console.log('✏️ Actualizando cita existente');
      this.actualizarCita(cita);
    } else {
      console.log('➕ Creando nueva cita');
      this.crearCita(cita);
    }
  }

  private crearCita(cita: Cita) {
    console.log('🆕 Creando cita:', cita);
    this.citaService.registrar(cita)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Cita creada exitosamente');
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita creada correctamente'
          });
          this.router.navigate(['/app/citas']);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al crear cita:', error);
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
    console.log('🔄 Actualizando cita:', cita);
    this.citaService.modificar(cita)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Cita actualizada exitosamente');
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita actualizada correctamente'
          });
          this.router.navigate(['/app/citas']);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al actualizar cita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la cita'
          });
          this.loading = false;
        }
      });
  }

  private formatDateForBackend(date: string | Date): string {
    if (!date) return '';
    // Si viene como string del datetime-local, convertir a Date y luego a ISO
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return date.toISOString();
  }

  private markFormGroupTouched() {
    Object.keys(this.citaForm.controls).forEach(key => {
      const control = this.citaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    console.log('❌ Cancelando formulario, navegando a citas');
    this.router.navigate(['/app/citas']);
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
