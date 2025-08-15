import { Component, Input, Output, EventEmitter, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  preview?: string;
}

@Component({
  selector: 'app-image-upload',
  standalone: false,
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() multiple: boolean = false;          // Permitir múltiples archivos
  @Input() maxFileSize: number = 5000000;      // 5MB por defecto
  @Input() accept: string = 'image/*';         // Tipos de archivo aceptados
  @Input() disabled: boolean = false;          // Deshabilitado
  @Input() showPreview: boolean = true;        // Mostrar vista previa
  @Input() previewWidth: number = 150;         // Ancho de vista previa
  @Input() dragDropText: string = 'Arrastra y suelta archivos aquí';
  @Input() chooseLabel: string = 'Seleccionar';
  @Input() uploadLabel: string = 'Subir';
  @Input() cancelLabel: string = 'Cancelar';
  @Input() removeLabel: string = 'Eliminar';
  @Input() maxFiles: number = 10;              // Máximo número de archivos
  @Input() showUploadButton: boolean = false;  // Mostrar botón subir
  @Input() showCancelButton: boolean = false;  // Mostrar botón cancelar
  @Input() auto: boolean = false;              // Subida automática
  @Input() url?: string;                       // URL para subir archivos

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() uploadComplete = new EventEmitter<UploadedFile[]>();
  @Output() uploadError = new EventEmitter<any>();

  files: UploadedFile[] = [];
  uploadedFiles: UploadedFile[] = [];

  // ControlValueAccessor
  private onChange = (value: UploadedFile[] | UploadedFile | null) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    // Componente inicializado
  }

    onSelect(event: any) {
    // Manejar tanto FileList como arrays de File
    let selectedFiles: File[] = [];

    if (event.files) {
      // Si es FileList, convertirlo a array
      if (event.files instanceof FileList) {
        selectedFiles = Array.from(event.files);
      } else if (Array.isArray(event.files)) {
        selectedFiles = event.files;
      }
    } else if (event.currentFiles) {
      // Fallback para currentFiles
      if (event.currentFiles instanceof FileList) {
        selectedFiles = Array.from(event.currentFiles);
      } else if (Array.isArray(event.currentFiles)) {
        selectedFiles = event.currentFiles;
      }
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      console.warn('No se recibieron archivos válidos');
      return;
    }

    if (!this.multiple) {
      this.files = [];
      this.uploadedFiles = [];
    }

    for (let file of selectedFiles) {
      // Validar que el archivo sea válido
      if (!file || !(file instanceof File)) {
        console.warn('Archivo inválido recibido:', file);
        continue;
      }

      // Verificar si el archivo ya existe para evitar duplicados
      const exists = this.files.some(f => f.name === file.name && f.size === file.size);

      if (!exists && this.isValidFile(file)) {
        const uploadedFile: UploadedFile = {
          name: file.name || 'Archivo sin nombre',
          size: file.size || 0,
          type: file.type || 'application/octet-stream'
        };

        // Solo asignar el archivo si existe
        if (file) {
          uploadedFile.file = file;
        }

        if (this.showPreview && file.type && file.type.startsWith('image/')) {
          this.generatePreview(file, uploadedFile);
        }

        this.files.push(uploadedFile);
      }
    }

    // Forzar la detección de cambios
    this.forceChangeDetection();

    this.filesSelected.emit(selectedFiles);
    this.updateValue();
    this.onTouched();
  }

  onRemove(event: any, file: UploadedFile) {
    const index = this.files.findIndex(f => f.name === file.name);
    if (index > -1) {
      this.files.splice(index, 1);
    }

    const uploadedIndex = this.uploadedFiles.findIndex(f => f.name === file.name);
    if (uploadedIndex > -1) {
      this.uploadedFiles.splice(uploadedIndex, 1);
    }

    if (file.file) {
      this.fileRemoved.emit(file.file);
    }

    this.updateValue();
    this.onTouched();
  }

  onUpload(event: any) {
    for (let file of event.files) {
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.objectURL || URL.createObjectURL(file)
      };
      this.uploadedFiles.push(uploadedFile);
    }

    this.uploadComplete.emit(this.uploadedFiles);
    this.updateValue();
  }

  onError(event: any) {
    this.uploadError.emit(event);
  }

  onClear() {
    this.files = [];
    this.uploadedFiles = [];
    this.updateValue();
    this.onTouched();
  }

  removeFile(file: UploadedFile) {
    const index = this.files.findIndex(f => f.name === file.name);
    if (index > -1) {
      this.files.splice(index, 1);
    }

    const uploadedIndex = this.uploadedFiles.findIndex(f => f.name === file.name);
    if (uploadedIndex > -1) {
      this.uploadedFiles.splice(uploadedIndex, 1);
    }

    if (file.file) {
      this.fileRemoved.emit(file.file);
    }

    this.updateValue();
    this.onTouched();
  }

  private isValidFile(file: File): boolean {
    // Validar que el archivo exista y sea válido
    if (!file || !(file instanceof File)) {
      console.warn('Archivo inválido:', file);
      return false;
    }

    // Validar que el nombre del archivo exista
    if (!file.name || file.name.trim() === '') {
      console.warn('El archivo no tiene nombre válido');
      return false;
    }

    // Validar que el tamaño sea un número válido
    if (!file.size || isNaN(file.size) || file.size < 0) {
      console.warn(`El archivo ${file.name} tiene un tamaño inválido:`, file.size);
      return false;
    }

    // Validar tamaño máximo
    if (file.size > this.maxFileSize) {
      console.warn(`El archivo ${file.name} excede el tamaño máximo permitido (${this.formatSize(this.maxFileSize)}). Tamaño actual: ${this.formatSize(file.size)}`);
      return false;
    }

    // Validar número máximo de archivos
    if (this.files.length >= this.maxFiles) {
      console.warn(`Se ha alcanzado el número máximo de archivos (${this.maxFiles}).`);
      return false;
    }

    return true;
  }

  private generatePreview(file: File, uploadedFile: UploadedFile) {
    if (!file || !uploadedFile) {
      console.warn('No se puede generar vista previa: archivo o objeto inválido');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (e.target && e.target.result) {
          uploadedFile.preview = e.target.result;
        } else {
          console.warn('No se pudo generar la vista previa del archivo:', file.name);
        }
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo para vista previa:', error);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error al generar vista previa:', error);
    }
  }

  private updateValue() {
    const value = this.multiple ? this.files : (this.files[0] || null);
    this.onChange(value);
  }

  formatSize(bytes: number): string {
    // Validar que bytes sea un número válido
    if (!bytes || isNaN(bytes) || bytes < 0) {
      return '0 Bytes';
    }

    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Validar que el índice esté dentro del rango
    if (i < 0 || i >= sizes.length) {
      return '0 Bytes';
    }

    const result = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    // Validar que el resultado sea un número válido
    if (isNaN(result)) {
      return '0 Bytes';
    }

    return result + ' ' + sizes[i];
  }

  // ControlValueAccessor implementation
  writeValue(value: UploadedFile[] | UploadedFile | null): void {
    try {
      if (value) {
        if (Array.isArray(value)) {
          // Filtrar solo archivos válidos
          this.files = value.filter(file => file && typeof file === 'object');
        } else {
          // Validar que sea un archivo válido
          if (value && typeof value === 'object') {
            this.files = [value];
          } else {
            this.files = [];
          }
        }
      } else {
        this.files = [];
      }
    } catch (error) {
      console.error('Error al escribir valor en el componente:', error);
      this.files = [];
    }
  }

  // Método de limpieza para prevenir memory leaks
  ngOnDestroy() {
    // Limpiar archivos y URLs de objeto
    this.files.forEach(file => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });

    this.uploadedFiles.forEach(file => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });

    this.files = [];
    this.uploadedFiles = [];
  }

  registerOnChange(fn: (value: UploadedFile[] | UploadedFile | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Método para forzar la detección de cambios
  private forceChangeDetection(): void {
    // Crear una nueva referencia del array para forzar la detección de cambios
    this.files = [...this.files];
  }
}
