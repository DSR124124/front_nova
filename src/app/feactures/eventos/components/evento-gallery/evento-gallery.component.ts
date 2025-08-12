import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../core/models/evento';

@Component({
  selector: 'app-evento-gallery',
  standalone: false,
  templateUrl: './evento-gallery.component.html',
  styleUrl: './evento-gallery.component.css'
})
export class EventoGalleryComponent implements OnInit, OnDestroy {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  loading = false;

  // Filtros
  searchTerm = '';
  selectedTipo = '';
  selectedYear = '';

  // Opciones de filtro
  tipoOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Aniversario', value: 'ANIVERSARIO' },
    { label: 'Cumpleaños', value: 'CUMPLEAÑOS' },
    { label: 'San Valentín', value: 'SAN_VALENTIN' },
    { label: 'Navidad', value: 'NAVIDAD' },
    { label: 'Año Nuevo', value: 'AÑO_NUEVO' },
    { label: 'Otro', value: 'OTRO' }
  ];

  yearOptions = [
    { label: 'Todos los años', value: '' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' }
  ];

  // Vista de galería
  viewMode: 'grid' | 'list' = 'grid';
  itemsPerPage = 12;
  currentPage = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private eventoService: EventoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarEventos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarEventos() {
    this.loading = true;
    this.eventoService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (eventos) => {
          this.eventos = eventos;
          this.aplicarFiltros();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los eventos'
          });
          this.loading = false;
        }
      });
  }

  private aplicarFiltros() {
    let resultado = this.eventos;

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(evento =>
        evento.titulo.toLowerCase().includes(term) ||
        evento.descripcion?.toLowerCase().includes(term) ||
        evento.lugarNombre?.toLowerCase().includes(term)
      );
    }

    // Filtro por tipo
    if (this.selectedTipo) {
      resultado = resultado.filter(evento => evento.tipo === this.selectedTipo);
    }

    // Filtro por año
    if (this.selectedYear) {
      resultado = resultado.filter(evento => {
        const eventoYear = new Date(evento.fecha).getFullYear().toString();
        return eventoYear === this.selectedYear;
      });
    }

    this.eventosFiltrados = resultado;
    this.currentPage = 1;
  }

  // Métodos de filtrado
  onSearchChange() {
    this.aplicarFiltros();
  }

  onTipoChange() {
    this.aplicarFiltros();
  }

  onYearChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.selectedTipo = '';
    this.selectedYear = '';
    this.aplicarFiltros();
  }

  // Cambio de vista
  cambiarVista(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  // Paginación
  get eventosPaginados(): Evento[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.eventosFiltrados.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.eventosFiltrados.length / this.itemsPerPage);
  }

  cambiarPagina(page: number) {
    this.currentPage = page;
  }

  // Utilidades
  getTipoIcono(tipo?: string): string {
    const iconos: { [key: string]: string } = {
      'ANIVERSARIO': 'pi pi-heart-fill',
      'CUMPLEAÑOS': 'pi pi-birthday-cake',
      'SAN_VALENTIN': 'pi pi-heart',
      'NAVIDAD': 'pi pi-star-fill',
      'AÑO_NUEVO': 'pi pi-calendar-plus',
      'OTRO': 'pi pi-calendar'
    };

    return iconos[tipo || ''] || 'pi pi-calendar';
  }

  getTipoColor(tipo?: string): string {
    const colores: { [key: string]: string } = {
      'ANIVERSARIO': 'danger',
      'CUMPLEAÑOS': 'warning',
      'SAN_VALENTIN': 'danger',
      'NAVIDAD': 'success',
      'AÑO_NUEVO': 'info',
      'OTRO': 'secondary'
    };

    return colores[tipo || ''] || 'info';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoEvento(fecha: string): { texto: string; severity: 'success' | 'info' | 'danger' | 'warning' } {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { texto: 'Pasado', severity: 'danger' };
    } else if (diffDays === 0) {
      return { texto: 'Hoy', severity: 'success' };
    } else if (diffDays <= 7) {
      return { texto: 'Próximo', severity: 'warning' };
    } else {
      return { texto: 'Futuro', severity: 'info' };
    }
  }

  // Acciones
  verDetalle(evento: Evento) {
    // Navegación al detalle del evento
    console.log('Ver detalle:', evento);
  }

  editarEvento(evento: Evento) {
    // Navegación a editar evento
    console.log('Editar evento:', evento);
  }

  eliminarEvento(evento: Evento) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el evento "${evento.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (evento.id) {
          this.eventoService.eliminar(evento.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Evento eliminado correctamente'
                });
                this.cargarEventos();
              },
              error: (error) => {
                console.error('Error al eliminar evento:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo eliminar el evento'
                });
              }
            });
        }
      }
    });
  }
}
