import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Services and Interfaces
  import { CategoriaCita } from '../../../../../core/models/Interfaces/cita/CategoriaCita';

@Component({
  selector: 'app-categoria-cita-forms',
  standalone: false,
  templateUrl: './categoria-cita-forms.component.html',
  styleUrl: './categoria-cita-forms.component.css'
})
export class CategoriaCitaFormsComponent implements OnInit, OnDestroy {

  @Input() categoria: CategoriaCita | null = null;
  @Input() isEditing = false;
  @Input() visible = false;

  @Output() save = new EventEmitter<CategoriaCita>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  // Form
  categoriaForm: FormGroup;

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
    { label: 'Avión', value: 'pi-plane' },
    { label: 'Cámara', value: 'pi-camera' },
    { label: 'Música', value: 'pi-music' },
    { label: 'Comida', value: 'pi-utensils' },
    { label: 'Deportes', value: 'pi-bolt' },
    { label: 'Salud', value: 'pi-heartbeat' },
    { label: 'Educación', value: 'pi-book' },
    { label: 'Trabajo', value: 'pi-briefcase' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      color: ['#007bff', Validators.required],
      icono: ['pi-heart', Validators.required],
      orden: [1, [Validators.required, Validators.min(1)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Inicializar formulario
  initializeForm(): void {
    if (this.isEditing && this.categoria) {
      // Modo edición
      this.categoriaForm.patchValue({
        nombre: this.categoria.nombre,
        descripcion: this.categoria.descripcion,
        color: this.categoria.color,
        icono: this.categoria.icono,
        orden: this.categoria.orden,
        activo: this.categoria.activo
      });
    } else {
      // Modo creación
      this.categoriaForm.reset({
        nombre: '',
        descripcion: '',
        color: '#007bff',
        icono: 'pi-heart',
        orden: 1,
        activo: true
      });
    }
  }

  // Guardar categoría
  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    const categoriaData = this.categoriaForm.value;

    if (this.isEditing && this.categoria) {
      // Actualizar
      const categoriaActualizada: CategoriaCita = {
        ...this.categoria,
        ...categoriaData
      };
      this.save.emit(categoriaActualizada);
    } else {
      // Crear - Solo enviar los campos del formulario
      this.save.emit(categoriaData as any);
    }
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
    return this.isEditing ? 'Editar Categoría' : 'Nueva Categoría';
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
