import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { RecordatorioService } from '../../../../core/services/recordatorio.service';
import { LugarService } from '../../../../core/services/lugar.service';
import { Recordatorio } from '../../../../core/models/Interfaces/recordatorio/recordatorio';
import { TipoRecordatorio } from '../../../../core/models/enums/tipo-recordatorio.enum';
import { FrecuenciaRecordatorio } from '../../../../core/models/enums/frecuencia-recordatorio.enum';
import { EstadoRecordatorio } from '../../../../core/models/enums/estado-recordatorio.enum';
import { Lugar } from '../../../../core/models/Interfaces/lugar/lugar';

@Component({
  selector: 'app-recordatorio-form',
  standalone: false,
  templateUrl: './recordatorio-form.component.html',
  styleUrl: './recordatorio-form.component.css'
})
export class RecordatorioFormComponent implements OnInit, OnDestroy {
  recordatorioForm: FormGroup;
  lugares: Lugar[] = [];
  isEditMode = false;
  recordatorioId: number | null = null;
  loading = false;

  // Opciones para el tipo de recordatorio
  tipoOptions = [
    { label: 'Personal', value: TipoRecordatorio.PERSONAL, icon: 'pi pi-user' },
    { label: 'Pareja', value: TipoRecordatorio.PAREJA, icon: 'pi pi-heart' },
    { label: 'Otro', value: TipoRecordatorio.OTRO, icon: 'pi pi-bell' }
  ];

  // Opciones para la frecuencia
  frecuenciaOptions = [
    { label: 'Sin repetición', value: FrecuenciaRecordatorio.NINGUNA, icon: 'pi pi-times' },
    { label: 'Diaria', value: FrecuenciaRecordatorio.DIARIA, icon: 'pi pi-calendar' },
    { label: 'Semanal', value: FrecuenciaRecordatorio.SEMANAL, icon: 'pi pi-calendar-week' },
    { label: 'Mensual', value: FrecuenciaRecordatorio.MENSUAL, icon: 'pi pi-calendar-month' },
    { label: 'Anual', value: FrecuenciaRecordatorio.ANUAL, icon: 'pi pi-calendar-year' }
  ];

  // Opciones para minutos antes
  minutosAntesOptions = [
    { label: '5 minutos antes', value: 5 },
    { label: '10 minutos antes', value: 10 },
    { label: '15 minutos antes', value: 15 },
    { label: '30 minutos antes', value: 30 },
    { label: '1 hora antes', value: 60 },
    { label: '2 horas antes', value: 120 },
    { label: '1 día antes', value: 1440 }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private recordatorioService: RecordatorioService,
    private lugarService: LugarService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    console.log('🔧 RecordatorioFormComponent constructor ejecutado');
    this.recordatorioForm = this.createForm();
  }

  ngOnInit() {
    console.log('🚀 RecordatorioFormComponent ngOnInit ejecutado');
    this.cargarLugares();
    this.checkEditMode();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMinDateTime(): string {
    return new Date().toISOString().slice(0, 16);
  }

  private createForm(): FormGroup {
    console.log('📝 Creando formulario de recordatorio');
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fechaHora: ['', Validators.required],
      tipo: [TipoRecordatorio.PAREJA, Validators.required],
      esRecurrente: [false],
      frecuencia: [FrecuenciaRecordatorio.NINGUNA],
      minutosAntes: [15],
      lugarId: [''],
      parejaId: [1] // Temporal, debería venir del servicio de autenticación
    });
  }

  private checkEditMode() {
    console.log('🔍 Verificando modo de edición');
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.recordatorioId = +id;
        this.cargarRecordatorio(this.recordatorioId);
      }
    });
  }

  private cargarRecordatorio(id: number) {
    console.log('📥 Cargando recordatorio con ID:', id);
    this.loading = true;
    this.recordatorioService.listarPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recordatorio) => {
          console.log('✅ Recordatorio cargado:', recordatorio);
          this.recordatorioForm.patchValue({
            titulo: recordatorio.titulo,
            descripcion: recordatorio.descripcion,
            fechaHora: this.formatDateTimeForInput(recordatorio.fechaHora),
            tipo: recordatorio.tipo,
            esRecurrente: recordatorio.esRecurrente,
            frecuencia: recordatorio.frecuencia,
            minutosAntes: recordatorio.minutosAntes,
            lugarId: recordatorio.lugarId,
            parejaId: recordatorio.parejaId
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar recordatorio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el recordatorio'
          });
          this.loading = false;
        }
      });
  }

  private formatDateTimeForInput(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);
  }

  private cargarLugares() {
    console.log('🏠 Cargando lugares disponibles');
    this.lugarService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          console.log('✅ Lugares cargados:', lugares.length);
          this.lugares = lugares;
        },
        error: (error) => {
          console.error('❌ Error al cargar lugares:', error);
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'No se pudieron cargar los lugares'
          });
        }
      });
  }

  onSubmit() {
    if (this.recordatorioForm.valid) {
      console.log('📤 Enviando formulario de recordatorio');
      this.loading = true;

      const formValue = this.recordatorioForm.value;
      const recordatorio: Recordatorio = {
        ...formValue,
        estado: EstadoRecordatorio.ACTIVO,
        creadoPorId: 1 // Temporal, debería venir del servicio de autenticación
      };

      if (this.isEditMode && this.recordatorioId) {
        recordatorio.id = this.recordatorioId;
        this.actualizarRecordatorio(recordatorio);
      } else {
        this.crearRecordatorio(recordatorio);
      }
    } else {
      console.log('❌ Formulario inválido');
      this.markFormGroupTouched();
    }
  }

  private crearRecordatorio(recordatorio: Recordatorio) {
    console.log('➕ Creando nuevo recordatorio');
    this.recordatorioService.registrar(recordatorio)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Recordatorio creado exitosamente');
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Recordatorio creado correctamente'
          });
          this.router.navigate(['/app/recordatorios']);
        },
        error: (error) => {
          console.error('❌ Error al crear recordatorio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el recordatorio'
          });
          this.loading = false;
        }
      });
  }

  private actualizarRecordatorio(recordatorio: Recordatorio) {
    console.log('✏️ Actualizando recordatorio');
    this.recordatorioService.modificar(recordatorio)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Recordatorio actualizado exitosamente');
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Recordatorio actualizado correctamente'
          });
          this.router.navigate(['/app/recordatorios']);
        },
        error: (error) => {
          console.error('❌ Error al actualizar recordatorio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el recordatorio'
          });
          this.loading = false;
        }
      });
  }

  onCancel() {
    console.log('❌ Cancelando formulario');
    this.router.navigate(['/app/recordatorios']);
  }

  // Métodos de validación
  hasFieldError(fieldName: string): boolean {
    const field = this.recordatorioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.recordatorioForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private markFormGroupTouched() {
    Object.keys(this.recordatorioForm.controls).forEach(key => {
      const control = this.recordatorioForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos para manejar cambios en el formulario
  onRecurrenteChange() {
    const esRecurrente = this.recordatorioForm.get('esRecurrente')?.value;
    const frecuenciaControl = this.recordatorioForm.get('frecuencia');

    if (esRecurrente) {
      frecuenciaControl?.enable();
    } else {
      frecuenciaControl?.disable();
      frecuenciaControl?.setValue(FrecuenciaRecordatorio.NINGUNA);
    }
  }

  onTipoChange() {
    const tipo = this.recordatorioForm.get('tipo')?.value;
    console.log('🔄 Tipo de recordatorio cambiado a:', tipo);
  }
}
