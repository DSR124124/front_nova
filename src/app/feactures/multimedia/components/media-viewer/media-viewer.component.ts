import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Multimedia, TipoMultimedia } from '../../../../core/models/multimedia';

// Interfaz extendida para el visor
interface MediaItem extends Multimedia {
  title: string;
  thumbnail?: string;
  size: number;
  format: string;
  uploadDate: Date;
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
}

@Component({
  selector: 'app-media-viewer',
  standalone: false,
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.css']
})
export class MediaViewerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mediaItem: MediaItem | null = null;
  @Output() closeViewer = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  // Estado del diálogo
  dialogVisible = false;

  // Media actual
  currentMedia: MediaItem | null = null;
  relatedMedia: MediaItem[] = [];

  // Controles de reproducción
  isPlaying = false;
  isMuted = false;
  volume = 1;
  currentTime = 0;
  duration = 0;
  playbackRate = 1;

  // Controles de imagen
  zoomLevel = 1;
  rotation = 0;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // No inicializar aquí, esperar a que se pase mediaItem
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mediaItem'] && changes['mediaItem'].currentValue) {
      this.loadMediaData(changes['mediaItem'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMediaData(media: MediaItem): void {
    this.currentMedia = media;
    this.dialogVisible = true;
    this.loadRelatedMedia();
    this.resetMediaState();
  }

  loadRelatedMedia(): void {
    // Simulación de carga de media relacionado
    setTimeout(() => {
      this.relatedMedia = this.getMockRelatedMedia();
    }, 300);
  }

  // Navegación entre archivos
  navigateToMedia(direction: 'prev' | 'next'): void {
    if (!this.currentMedia || this.relatedMedia.length === 0) return;

    const currentIndex = this.relatedMedia.findIndex(m => m.id === this.currentMedia?.id);
    let newIndex: number;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.relatedMedia.length - 1;
    } else {
      newIndex = currentIndex < this.relatedMedia.length - 1 ? currentIndex + 0 : 0;
    }

    this.currentMedia = this.relatedMedia[newIndex];
    this.resetMediaState();
  }

  navigateToMediaById(mediaId: number): void {
    const media = this.relatedMedia.find(m => m.id === mediaId);
    if (media) {
      this.currentMedia = media;
      this.resetMediaState();
    }
  }

  // Controles de reproducción
  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.messageService.add({
        severity: 'info',
        summary: 'Reproduciendo',
        detail: 'Media en reproducción'
      });
    }
  }

  toggleMuted(): void {
    this.isMuted = !this.isMuted;
  }

  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
  }

  seekTo(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentTime = parseFloat(target.value);
  }

  // Controles de imagen
  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  rotateClockwise(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  rotateCounterClockwise(): void {
    this.rotation = (this.rotation - 90 + 360) % 360;
  }

  // Acciones del media
  toggleFavorite(): void {
    if (this.currentMedia) {
      this.currentMedia.isFavorite = !this.currentMedia.isFavorite;
      this.messageService.add({
        severity: 'success',
        summary: this.currentMedia.isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos',
        detail: this.currentMedia.title
      });
    }
  }

  togglePublic(): void {
    if (this.currentMedia) {
      this.currentMedia.isPublic = !this.currentMedia.isPublic;
      this.messageService.add({
        severity: 'success',
        summary: this.currentMedia.isPublic ? 'Marcado como público' : 'Marcado como privado',
        detail: this.currentMedia.title
      });
    }
  }

  downloadMedia(): void {
    if (this.currentMedia) {
      this.messageService.add({
        severity: 'info',
        summary: 'Descargando',
        detail: `Descargando ${this.currentMedia.title}`
      });
      window.open(this.currentMedia.url, '_blank');
    }
  }

  shareMedia(): void {
    if (this.currentMedia) {
      this.messageService.add({
        severity: 'info',
        summary: 'Compartiendo',
        detail: `Compartiendo ${this.currentMedia.title}`
      });
    }
  }

  deleteMedia(): void {
    if (this.currentMedia) {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que quieres eliminar "${this.currentMedia.title}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Media eliminado correctamente'
          });
          this.close();
        }
      });
    }
  }

  close(): void {
    this.dialogVisible = false;
    this.closeViewer.emit();
  }

  // Eventos de media
  onImageLoad(): void {
    // Imagen cargada
  }

  onVideoLoad(): void {
    this.duration = 120; // Simulación de duración
  }

  onAudioLoad(): void {
    this.duration = 180; // Simulación de duración
  }

  onMediaError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al cargar el media'
    });
  }

  // Métodos de utilidad
  getFileSize(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }

  getTypeLabel(type: TipoMultimedia): string {
    switch (type) {
      case 'FOTO': return 'Foto';
      case 'VIDEO': return 'Video';
      case 'AUDIO': return 'Audio';
      case 'DOCUMENTO': return 'Documento';
      default: return 'Archivo';
    }
  }

  getTypeIcon(type: TipoMultimedia): string {
    switch (type) {
      case 'FOTO': return 'pi pi-image';
      case 'VIDEO': return 'pi pi-video';
      case 'AUDIO': return 'pi pi-volume-up';
      case 'DOCUMENTO': return 'pi pi-file-pdf';
      default: return 'pi pi-file';
    }
  }

  private resetMediaState(): void {
    this.currentTime = 0;
    this.isPlaying = false;
    this.zoomLevel = 1;
    this.rotation = 0;
  }

  // Datos de prueba
  private getMockRelatedMedia(): MediaItem[] {
    return [
      {
        id: 2,
        citaId: 2,
        autorId: 1,
        url: '/assets/videos/birthday.mp4',
        tipo: 'VIDEO',
        descripcion: 'Celebración del cumpleaños de María',
        fechaSubida: '2024-01-10T15:30:00',
        autorNombre: 'Juan Pérez',
        citaTitulo: 'Cumpleaños de María',
        title: 'Video del cumpleaños',
        thumbnail: '/assets/videos/birthday-thumb.jpg',
        size: 52428800,
        format: 'MP4',
        uploadDate: new Date('2024-01-10'),
        tags: ['Familia', 'Eventos', 'Cumpleaños'],
        isFavorite: false,
        isPublic: false
      },
      {
        id: 3,
        citaId: 3,
        autorId: 2,
        url: '/assets/audio/meditation.mp3',
        tipo: 'AUDIO',
        descripcion: 'Playlist para meditación',
        fechaSubida: '2024-01-08T08:00:00',
        autorNombre: 'María García',
        citaTitulo: 'Sesión de Meditación',
        title: 'Música relajante',
        thumbnail: '/assets/audio/meditation-thumb.jpg',
        size: 10485760,
        format: 'MP3',
        uploadDate: new Date('2024-01-08'),
        tags: ['Música', 'Meditación', 'Relajación'],
        isFavorite: true,
        isPublic: true
      }
    ];
  }
}
