import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
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
export class ImageUploadComponent implements ControlValueAccessor {
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

    onSelect(event: any) {
    const selectedFiles: File[] = event.files || event.currentFiles;

    if (!this.multiple) {
      this.files = [];
      this.uploadedFiles = [];
    }

    for (let file of selectedFiles) {
      // Verificar si el archivo ya existe para evitar duplicados
      const exists = this.files.some(f => f.name === file.name && f.size === file.size);

      if (!exists && this.isValidFile(file)) {
        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        };

        if (this.showPreview && file.type.startsWith('image/')) {
          this.generatePreview(file, uploadedFile);
        }

        this.files.push(uploadedFile);
      }
    }

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
    // Validar tamaño
    if (file.size > this.maxFileSize) {
      console.warn(`El archivo ${file.name} excede el tamaño máximo permitido.`);
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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      uploadedFile.preview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  private updateValue() {
    const value = this.multiple ? this.files : (this.files[0] || null);
    this.onChange(value);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ControlValueAccessor implementation
  writeValue(value: UploadedFile[] | UploadedFile | null): void {
    if (value) {
      this.files = Array.isArray(value) ? value : [value];
    } else {
      this.files = [];
    }
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
}
