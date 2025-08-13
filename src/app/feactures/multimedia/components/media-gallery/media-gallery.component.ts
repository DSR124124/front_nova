import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Multimedia, TipoMultimedia } from '../../../../core/models/multimedia';

// Interfaz extendida para la galería que incluye propiedades adicionales
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
  selector: 'app-media-gallery',
  standalone: false,
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css'
})
export class MediaGalleryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Datos
  mediaItems: MediaItem[] = [];
  filteredItems: MediaItem[] = [];
  loading = false;
  selectedItems: MediaItem[] = [];

  // Filtros
  searchTerm = '';
  selectedType: string = '';
  selectedTags: string[] = [];
  showFavoritesOnly = false;
  showPublicOnly = false;

  // Vista
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'uploadDate';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Paginación
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;

  // Tipos de media disponibles
  mediaTypes = [
    { label: 'Todos', value: '' },
    { label: 'Fotos', value: 'FOTO' },
    { label: 'Videos', value: 'VIDEO' },
    { label: 'Audio', value: 'AUDIO' },
    { label: 'Documentos', value: 'DOCUMENTO' }
  ];

  // Tags disponibles
  availableTags = [
    'Vacaciones', 'Familia', 'Trabajo', 'Eventos', 'Música', 'Películas', 'Fotos', 'Videos'
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadMediaItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMediaItems(): void {
    this.loading = true;
    
    // Simulación de carga de datos
    setTimeout(() => {
      this.mediaItems = this.getMockMediaItems();
      this.applyFilters();
      this.loading = false;
    }, 1000);
  }

  applyFilters(): void {
    let filtered = [...this.mediaItems];

    // Filtro por búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    // Filtro por tipo
    if (this.selectedType) {
      filtered = filtered.filter(item => item.tipo === this.selectedType);
    }

    // Filtro por tags
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(item => 
        this.selectedTags.some(tag => item.tags.includes(tag))
      );
    }

    // Filtro por favoritos
    if (this.showFavoritesOnly) {
      filtered = filtered.filter(item => item.isFavorite);
    }

    // Filtro por público
    if (this.showPublicOnly) {
      filtered = filtered.filter(item => item.isPublic);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (this.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'uploadDate':
        default:
          aValue = a.uploadDate;
          bValue = b.uploadDate;
          break;
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredItems = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleItemSelection(item: MediaItem): void {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    } else {
      this.selectedItems.push(item);
    }
  }

  toggleFavorite(item: MediaItem): void {
    item.isFavorite = !item.isFavorite;
    this.messageService.add({
      severity: 'success',
      summary: item.isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos',
      detail: item.title
    });
  }

  togglePublic(item: MediaItem): void {
    item.isPublic = !item.isPublic;
    this.messageService.add({
      severity: 'success',
      summary: item.isPublic ? 'Marcado como público' : 'Marcado como privado',
      detail: item.title
    });
  }

  deleteItem(item: MediaItem): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar "${item.title}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mediaItems = this.mediaItems.filter(i => i.id !== item.id);
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Elemento multimedia eliminado correctamente'
        });
      }
    });
  }

  downloadItem(item: MediaItem): void {
    // Simulación de descarga
    this.messageService.add({
      severity: 'info',
      summary: 'Descargando',
      detail: `Descargando ${item.title}...`
    });
  }

  shareItem(item: MediaItem): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Compartir',
      detail: `Compartiendo ${item.title}...`
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
  }

  getFileSize(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }

  getFileIcon(type: TipoMultimedia): string {
    switch (type) {
      case 'FOTO': return 'pi pi-image';
      case 'VIDEO': return 'pi pi-video';
      case 'AUDIO': return 'pi pi-volume-up';
      case 'DOCUMENTO': return 'pi pi-file';
      default: return 'pi pi-file';
    }
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

  getTypeSeverity(type: TipoMultimedia): string {
    switch (type) {
      case 'FOTO': return 'success';
      case 'VIDEO': return 'warning';
      case 'AUDIO': return 'info';
      case 'DOCUMENTO': return 'secondary';
      default: return 'info';
    }
  }

  private getMockMediaItems(): MediaItem[] {
    return [
      {
        id: 1,
        citaId: 1,
        autorId: 1,
        url: '/assets/images/beach.jpg',
        tipo: 'FOTO',
        descripcion: 'Fotos de nuestras vacaciones familiares',
        fechaSubida: '2024-01-15T10:00:00',
        autorNombre: 'Juan Pérez',
        citaTitulo: 'Vacaciones Familiares',
        title: 'Vacaciones en la playa',
        thumbnail: '/assets/images/beach-thumb.jpg',
        size: 2048576,
        format: 'JPG',
        uploadDate: new Date('2024-01-15'),
        tags: ['Vacaciones', 'Familia', 'Playa'],
        isFavorite: true,
        isPublic: true
      },
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
      },
      {
        id: 4,
        citaId: 4,
        autorId: 2,
        url: '/assets/documents/report.pdf',
        tipo: 'DOCUMENTO',
        descripcion: 'Reporte mensual de ventas',
        fechaSubida: '2024-01-05T14:00:00',
        autorNombre: 'María García',
        citaTitulo: 'Reunión de Trabajo',
        title: 'Documento de trabajo',
        thumbnail: '/assets/documents/report-thumb.jpg',
        size: 2097152,
        format: 'PDF',
        uploadDate: new Date('2024-01-05'),
        tags: ['Trabajo', 'Reportes', 'Ventas'],
        isFavorite: false,
        isPublic: false
      }
    ];
  }
}
