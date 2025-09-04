import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageInfoService } from '../../../../../core/services/message-info.service';

// Services and Interfaces
  import { CategoriaCita } from '../../../../../core/models/Interfaces/cita/CategoriaCita';

@Component({
  selector: 'app-categoria-cita-forms',
  standalone: false,
  templateUrl: './categoria-cita-forms.component.html',
  styleUrl: './categoria-cita-forms.component.css'
})
export class CategoriaCitaFormsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() categoria: CategoriaCita | null = null;
  @Input() isEditing = false;
  @Input() isViewing = false; // Nuevo input para modo solo lectura
  @Input() visible = false;

  @Output() save = new EventEmitter<CategoriaCita>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  // Form
  categoriaForm: FormGroup;
  loading = false;

  // Icons disponibles
  iconosDisponibles = [
    { label: 'Corazón', value: 'pi-heart' },
    { label: 'Corazón Lleno', value: 'pi-heart-fill' },
    { label: 'Estrella', value: 'pi-star' },
    { label: 'Estrella Lleno', value: 'pi-star-fill' },
    { label: 'Calendario', value: 'pi-calendar' },
    { label: 'Usuario', value: 'pi-user' },
    { label: 'Casa', value: 'pi-home' },
    { label: 'Coche', value: 'pi-car' },
    { label: 'Avión', value: 'pi-send' },
    { label: 'Cámara', value: 'pi-camera' },
    { label: 'Música', value: 'pi-volume-up' },
    { label: 'Comida', value: 'pi-shopping-bag' },
    { label: 'Deportes', value: 'pi-bolt' },
    { label: 'Salud', value: 'pi-heart' },
    { label: 'Educación', value: 'pi-book' },
    { label: 'Trabajo', value: 'pi-briefcase' },
    { label: 'Regalo', value: 'pi-gift' },
    { label: 'Reloj', value: 'pi-clock' },
    { label: 'Ubicación', value: 'pi-map-marker' },
    { label: 'Teléfono', value: 'pi-phone' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private messageInfoService: MessageInfoService
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      color: ['#3b82f6', Validators.required],
      icono: ['pi-heart', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en la categoría y actualizar el formulario
    if (changes['categoria'] && this.categoriaForm) {
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Inicializar formulario
  initializeForm(): void {
    if ((this.isEditing || this.isViewing) && this.categoria) {
      // Modo edición o visualización
      this.categoriaForm.patchValue({
        nombre: this.categoria.nombre,
        descripcion: this.categoria.descripcion,
        color: this.categoria.color,
        icono: this.categoria.icono
      });

      // Si es modo solo lectura, deshabilitar el formulario
      if (this.isViewing) {
        this.categoriaForm.disable();
      } else {
        this.categoriaForm.enable();
      }
    } else {
      // Modo creación
      this.categoriaForm.reset({
        nombre: '',
        descripcion: '',
        color: '#3b82f6',
        icono: 'pi-heart'
      });
      this.categoriaForm.enable();
    }
  }

  // Guardar categoría
  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    this.loading = true;
    const categoriaData = this.categoriaForm.value;

    setTimeout(() => {
      if (this.isEditing && this.categoria) {
        // Actualizar - mantener orden y activo existentes
        const categoriaActualizada: CategoriaCita = {
          ...this.categoria,
          ...categoriaData
        };
        this.save.emit(categoriaActualizada);
      } else {
        // Crear - agregar valores por defecto
        const nuevaCategoria = {
          ...categoriaData,
          orden: 1,
          activo: true
        };
        this.save.emit(nuevaCategoria as any);
      }
      this.loading = false;
    }, 1000);
  }

  // Cancelar
  cancelar(): void {
    this.cancel.emit();
  }

  // Cerrar diálogo
  cerrarDialogo(): void {
    this.visibleChange.emit(false);
  }

  // Marcar campos inválidos
  marcarCamposInvalidos(): void {
    Object.keys(this.categoriaForm.controls).forEach(key => {
      const control = this.categoriaForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  // Verificar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoriaForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtener error de un campo
  getFieldError(fieldName: string): string {
    const field = this.categoriaForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
    }
    return '';
  }

  // Obtener título del diálogo
  getDialogTitle(): string {
    if (this.isViewing) {
      return 'Detalle de Categoría';
    } else if (this.isEditing) {
      return 'Editar Categoría';
    } else {
      return 'Nueva Categoría';
    }
  }

  // Obtener texto del botón
  getButtonText(): string {
    return this.isEditing ? 'Actualizar' : 'Crear';
  }

  // Obtener icono del botón
  getButtonIcon(): string {
    return this.isEditing ? 'pi pi-check' : 'pi pi-plus';
  }
}
