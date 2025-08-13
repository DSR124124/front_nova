import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Multimedia, TipoMultimedia } from '../../../../core/models/multimedia';

interface UploadFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

@Component({
  selector: 'app-media-upload',
  standalone: false,
  templateUrl: './media-upload.component.html',
  styleUrl: './media-upload.component.css'
})
export class MediaUploadComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Formulario
  uploadForm: FormGroup;

  // Archivos
  selectedFiles: UploadFile[] = [];
  dragOver = false;

  // Estados
  uploading = false;
  uploadProgress = 0;

  // Opciones
  maxFileSize = 100 * 1024 * 1024; // 100MB
  allowedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  // Tipos de multimedia disponibles
  mediaTypes: { label: string; value: TipoMultimedia }[] = [
    { label: 'Foto', value: 'FOTO' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Audio', value: 'AUDIO' },
    { label: 'Documento', value: 'DOCUMENTO' }
  ];

  // Citas disponibles (mock data)
  availableCitas = [
    { id: 1, titulo: 'Vacaciones Familiares', fecha: '2024-01-15' },
    { id: 2, titulo: 'Cumpleaños de María', fecha: '2024-01-10' },
    { id: 3, titulo: 'Sesión de Meditación', fecha: '2024-01-08' },
    { id: 4, titulo: 'Reunión de Trabajo', fecha: '2024-01-05' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.uploadForm = this.fb.group({
      citaId: ['', Validators.required],
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.maxLength(500)]],
      tags: [[]],
      isPublic: [false],
      isFavorite: [false]
    });
  }

  ngOnInit(): void {
    // Inicializar con valores por defecto
    this.uploadForm.patchValue({
      tipo: 'FOTO',
      isPublic: false,
      isFavorite: false
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Manejo de archivos
  onFileSelect(event: any): void {
    const files: FileList = event.target.files;
    this.addFiles(Array.from(files));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;

    const files: FileList | undefined = event.dataTransfer?.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  private addFiles(files: File[]): void {
    files.forEach(file => {
      if (this.validateFile(file)) {
        const uploadFile: UploadFile = {
          file,
          progress: 0,
          status: 'pending'
        };

        // Generar preview para imágenes
        if (file.type.startsWith('image/')) {
          this.generatePreview(file).then(preview => {
            uploadFile.preview = preview;
          });
        }

        this.selectedFiles.push(uploadFile);
      }
    });
  }

  private validateFile(file: File): boolean {
    // Validar tamaño
    if (file.size > this.maxFileSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo muy grande',
        detail: `${file.name} excede el tamaño máximo de ${this.formatFileSize(this.maxFileSize)}`
      });
      return false;
    }

    // Validar tipo
    const isValidType = this.allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      this.messageService.add({
        severity: 'error',
        summary: 'Tipo de archivo no permitido',
        detail: `${file.name} no es un tipo de archivo válido`
      });
      return false;
    }

    return true;
  }

  private async generatePreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // Eliminar archivo
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // Subir archivos
  async uploadFiles(): Promise<void> {
    if (this.uploadForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Sin archivos',
        detail: 'Selecciona al menos un archivo para subir'
      });
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    try {
      const formData = this.uploadForm.value;

      for (let i = 0; i < this.selectedFiles.length; i++) {
        const uploadFile = this.selectedFiles[i];
        uploadFile.status = 'uploading';

        // Simular subida con progreso
        await this.simulateUpload(uploadFile, i);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Subida completada',
        detail: `${this.selectedFiles.length} archivo(s) subido(s) exitosamente`
      });

      // Limpiar formulario y archivos
      this.resetForm();

    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en la subida',
        detail: 'Ocurrió un error durante la subida de archivos'
      });
    } finally {
      this.uploading = false;
      this.uploadProgress = 0;
    }
  }

  private async simulateUpload(uploadFile: UploadFile, index: number): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          uploadFile.status = 'success';
          uploadFile.progress = 100;
          resolve();
        } else {
          uploadFile.progress = progress;
          this.uploadProgress = (this.selectedFiles.reduce((sum, f) => sum + f.progress, 0) / this.selectedFiles.length);
        }
      }, 200);
    });
  }

  // Resetear formulario
  resetForm(): void {
    this.uploadForm.reset({
      tipo: 'FOTO',
      isPublic: false,
      isFavorite: false
    });
    this.selectedFiles = [];
    this.uploadProgress = 0;
  }

  // Utilidades
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(type: string): string {
    if (type.startsWith('image/')) return 'pi pi-image';
    if (type.startsWith('video/')) return 'pi pi-video';
    if (type.startsWith('audio/')) return 'pi pi-volume-up';
    return 'pi pi-file';
  }

  getFileTypeLabel(type: string): string {
    if (type.startsWith('image/')) return 'Imagen';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    return 'Documento';
  }

  // Getters para el template
  get citaId() { return this.uploadForm.get('citaId'); }
  get tipo() { return this.uploadForm.get('tipo'); }
  get descripcion() { return this.uploadForm.get('descripcion'); }
}
