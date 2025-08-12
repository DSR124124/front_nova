import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../core/models/evento';

@Component({
  selector: 'app-evento-timeline',
  standalone: false,
  templateUrl: './evento-timeline.component.html',
  styleUrl: './evento-timeline.component.css'
})
export class EventoTimelineComponent implements OnInit, OnDestroy {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  loading = false;
  
  // Filtros
  searchTerm = '';
  selectedTipo = '';
  selectedPeriodo = '';
  
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
  
  periodoOptions = [
    { label: 'Todos los períodos', value: '' },
    { label: 'Este mes', value: 'ESTE_MES' },
    { label: 'Próximo mes', value: 'PROXIMO_MES' },
    { label: 'Este año', value: 'ESTE_AÑO' },
    { label: 'Pasado', value: 'PASADO' }
  ];
  
  // Vista de timeline
  viewMode: 'chronological' | 'grouped' = 'chronological';
  groupBy: 'month' | 'year' | 'type' = 'month';
  
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
    
    // Filtro por período
    if (this.selectedPeriodo) {
      resultado = resultado.filter(evento => {
        return this.cumplePeriodo(evento.fecha, this.selectedPeriodo);
      });
    }
    
    this.eventosFiltrados = resultado;
  }

  private cumplePeriodo(fecha: string, periodo: string): boolean {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const esteMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
    const esteAño = new Date(hoy.getFullYear(), 0, 1);

    switch (periodo) {
      case 'ESTE_MES':
        return fechaEvento >= esteMes && fechaEvento < proximoMes;
      case 'PROXIMO_MES':
        return fechaEvento >= proximoMes && fechaEvento < new Date(hoy.getFullYear(), hoy.getMonth() + 2, 1);
      case 'ESTE_AÑO':
        return fechaEvento >= esteAño && fechaEvento < new Date(hoy.getFullYear() + 1, 0, 1);
      case 'PASADO':
        return fechaEvento < hoy;
      default:
        return true;
    }
  }

  // Métodos de filtrado
  onSearchChange() {
    this.aplicarFiltros();
  }

  onTipoChange() {
    this.aplicarFiltros();
  }

  onPeriodoChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.selectedTipo = '';
    this.selectedPeriodo = '';
    this.aplicarFiltros();
  }

  // Cambio de vista
  cambiarVista(mode: 'chronological' | 'grouped') {
    this.viewMode = mode;
  }

  cambiarAgrupacion(groupBy: 'month' | 'year' | 'type') {
    this.groupBy = groupBy;
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

  formatearMes(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  formatearAño(fecha: string): string {
    return new Date(fecha).getFullYear().toString();
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

  getDiasRestantes(fecha: string): number {
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDiasRestantesTexto(fecha: string): string {
    const dias = this.getDiasRestantes(fecha);
    if (dias < 0) return 'Hace ' + Math.abs(dias) + ' días';
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Mañana';
    if (dias <= 7) return 'En ' + dias + ' días';
    if (dias <= 30) return 'En ' + dias + ' días';
    return 'En ' + dias + ' días';
  }

  // Agrupación de eventos
  getEventosAgrupados(): any[] {
    if (this.viewMode === 'chronological') {
      return this.getEventosCronologicos();
    } else {
      return this.getEventosAgrupadosPor();
    }
  }

  private getEventosCronologicos(): any[] {
    const eventosOrdenados = [...this.eventosFiltrados].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    return eventosOrdenados.map(evento => ({
      evento,
      fecha: new Date(evento.fecha),
      esPasado: new Date(evento.fecha) < new Date()
    }));
  }

  private getEventosAgrupadosPor(): any[] {
    const grupos: { [key: string]: Evento[] } = {};

    this.eventosFiltrados.forEach(evento => {
      let clave = '';
      
      switch (this.groupBy) {
        case 'month':
          clave = this.formatearMes(evento.fecha);
          break;
        case 'year':
          clave = this.formatearAño(evento.fecha);
          break;
        case 'type':
          clave = evento.tipo || 'OTRO';
          break;
      }

      if (!grupos[clave]) {
        grupos[clave] = [];
      }
      grupos[clave].push(evento);
    });

    return Object.keys(grupos).map(clave => ({
      clave,
      eventos: grupos[clave].sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      )
    }));
  }

  // Acciones
  verDetalle(evento: Evento) {
    this.router.navigate(['/eventos', evento.id]);
  }

  editarEvento(evento: Evento) {
    this.router.navigate(['/eventos/editar', evento.id]);
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
