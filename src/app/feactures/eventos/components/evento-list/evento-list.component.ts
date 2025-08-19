import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../core/models/Interfaces/evento/evento';

@Component({
  selector: 'app-evento-list',
  standalone: false,
  templateUrl: './evento-list.component.html',
  styleUrl: './evento-list.component.css'
})
export class EventoListComponent implements OnInit, OnDestroy {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  loading = false;

  // Filtros
  searchTerm = '';
  selectedTipo = '';
  selectedEstado = '';

  // Vista
  viewMode: 'list' | 'gallery' = 'list';

  // Opciones de filtro
  tipoOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Aniversario', value: 'ANIVERSARIO' },
    { label: 'Cumpleaños', value: 'CUMPLEAÑOS' },
    { label: 'San Valentín', value: 'SAN_VALENTIN' },
    { label: 'Fecha Especial', value: 'FECHA_ESPECIAL' },
    { label: 'Cita Romántica', value: 'CITA_ROMANTICA' },
    { label: 'Viaje', value: 'VIAJE' },
    { label: 'Celebración', value: 'CELEBRACION' },
    { label: 'Otro', value: 'OTRO' }
  ];

  estadoOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Pasado', value: 'PASADO' },
    { label: 'Hoy', value: 'HOY' },
    { label: 'Próximo', value: 'PROXIMO' },
    { label: 'Futuro', value: 'FUTURO' }
  ];

  // Paginación
  first = 0;
  rows = 10;

  // Columnas de la tabla
  cols = [
    { field: 'titulo', header: 'Título' },
    { field: 'tipo', header: 'Tipo' },
    { field: 'fecha', header: 'Fecha' },
    { field: 'lugarNombre', header: 'Lugar' },
    { field: 'estado', header: 'Estado' },
    { field: 'acciones', header: 'Acciones' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private eventoService: EventoService,
    private router: Router,
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

    // Filtro por estado
    if (this.selectedEstado) {
      resultado = resultado.filter(evento => {
        const estado = this.getEstadoEvento(evento.fecha);
        return estado === this.selectedEstado;
      });
    }

    this.eventosFiltrados = resultado;
    this.first = 0; // Resetear paginación
  }

  // Métodos de filtrado
  onSearchChange() {
    this.aplicarFiltros();
  }

  onTipoChange() {
    this.aplicarFiltros();
  }

  onEstadoChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.selectedTipo = '';
    this.selectedEstado = '';
    this.aplicarFiltros();
  }

  // Utilidades
  getTipoIcono(tipo?: string): string {
    const iconos: { [key: string]: string } = {
      'ANIVERSARIO': 'pi pi-heart',
      'CUMPLEAÑOS': 'pi pi-gift',
      'SAN_VALENTIN': 'pi pi-heart-fill',
      'FECHA_ESPECIAL': 'pi pi-star',
      'CITA_ROMANTICA': 'pi pi-calendar-plus',
      'VIAJE': 'pi pi-map',
      'CELEBRACION': 'pi pi-sparkles',
      'OTRO': 'pi pi-circle'
    };

    return iconos[tipo || ''] || 'pi pi-calendar';
  }

  getTipoColor(tipo?: string): string {
    const colores: { [key: string]: string } = {
      'ANIVERSARIO': 'danger',
      'CUMPLEAÑOS': 'warning',
      'SAN_VALENTIN': 'danger',
      'FECHA_ESPECIAL': 'info',
      'CITA_ROMANTICA': 'secondary',
      'VIAJE': 'success',
      'CELEBRACION': 'warning',
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

  getEstadoEvento(fecha: string): string {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'PASADO';
    } else if (diffDays === 0) {
      return 'HOY';
    } else if (diffDays <= 7) {
      return 'PROXIMO';
    } else {
      return 'FUTURO';
    }
  }

  getEstadoSeverity(fecha: string): 'success' | 'info' | 'danger' | 'warning' {
    const estado = this.getEstadoEvento(fecha);
    const severities: { [key: string]: 'success' | 'info' | 'danger' | 'warning' } = {
      'PASADO': 'danger',
      'HOY': 'success',
      'PROXIMO': 'warning',
      'FUTURO': 'info'
    };

    return severities[estado] || 'info';
  }

  getEstadoTexto(fecha: string): string {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Pasado';
    if (diffDays === 0) return 'Hoy';
    return 'Próximo';
  }

  // Acciones
  nuevoEvento() {
    this.router.navigate(['/app/eventos/crear']);
  }

  verDetalle(evento: Evento) {
    this.router.navigate(['/app/eventos/detalle', evento.id]);
  }

  editarEvento(evento: Evento) {
    this.router.navigate(['/app/eventos/editar', evento.id]);
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

  // Paginación
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Cambio de vista
  cambiarVista(mode: 'list' | 'gallery') {
    this.viewMode = mode;
  }

  // Métodos para CSS classes y estados (para vista galería)
  getEstadoCssClass(fecha: string): string {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'estado-pasado';
    if (diffDays === 0) return 'estado-hoy';
    return 'estado-futuro';
  }

  getEstadoIcono(fecha: string): string {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'pi pi-check-circle';
    if (diffDays === 0) return 'pi pi-calendar-times';
    return 'pi pi-clock';
  }
}
