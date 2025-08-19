import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventoService } from '../../../../core/services/evento.service';
import { LugarService } from '../../../../core/services/lugar.service';
import { Evento } from '../../../../core/models/Interfaces/evento/evento';
import { Lugar } from '../../../../core/models/Interfaces/lugar/lugar';

@Component({
  selector: 'app-evento-detail',
  standalone: false,
  templateUrl: './evento-detail.component.html',
  styleUrl: './evento-detail.component.css'
})
export class EventoDetailComponent implements OnInit, OnDestroy {
  evento: Evento | null = null;
  lugar: Lugar | null = null;
  eventoId: number = 0;
  loading = true;
  error = '';

  // Información adicional del evento
  diasRestantes: number = 0;
  esEventoPasado: boolean = false;
  esEventoHoy: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private lugarService: LugarService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.eventoId = +params['id'];
        if (this.eventoId) {
          this.cargarEvento();
        } else {
          this.error = 'ID de evento no válido';
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarEvento() {
    this.loading = true;
    this.eventoService.listarPorId(this.eventoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (evento) => {
          this.evento = evento;
          this.calcularInformacionEvento();
          if (evento.lugarId) {
            this.cargarLugar(evento.lugarId);
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar evento:', error);
          this.error = 'No se pudo cargar el evento';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el evento'
          });
          this.loading = false;
        }
      });
  }

  private cargarLugar(lugarId: number) {
    this.lugarService.getLugarById(lugarId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugar: any) => {
          this.lugar = lugar;
        },
        error: (error: any) => {
          console.error('Error al cargar lugar:', error);
        }
      });
  }

  private calcularInformacionEvento() {
    if (!this.evento?.fecha) return;

    const fechaEvento = new Date(this.evento.fecha);
    const hoy = new Date();
    const diffTime = fechaEvento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    this.diasRestantes = diffDays;
    this.esEventoPasado = diffDays < 0;
    this.esEventoHoy = diffDays === 0;
  }

  // Acciones
  editarEvento() {
    if (this.evento?.id) {
      this.router.navigate(['/app/eventos/editar', this.evento.id]);
    }
  }

  eliminarEvento() {
    if (!this.evento) return;

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el evento "${this.evento.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (this.evento?.id) {
          this.eventoService.eliminar(this.evento.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Evento eliminado correctamente'
                });
                this.router.navigate(['/app/eventos']);
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

  volverALista() {
    this.router.navigate(['/app/eventos']);
  }

  // Utilidades
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTipoIcono(tipo?: string): string {
    if (!tipo) return 'pi pi-circle';

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

    return iconos[tipo] || 'pi pi-circle';
  }

  getTipoColor(tipo?: string): string {
    if (!tipo) return 'info';

    const colores: { [key: string]: string } = {
      'ANIVERSARIO': 'danger',
      'CUMPLEAÑOS': 'warning',
      'SAN_VALENTIN': 'danger',
      'NAVIDAD': 'success',
      'AÑO_NUEVO': 'info',
      'OTRO': 'secondary'
    };

    return colores[tipo] || 'info';
  }

  getEstadoEvento(): { texto: string; severity: 'success' | 'info' | 'danger' | 'warning' } {
    if (this.esEventoHoy) {
      return { texto: '¡Hoy es el evento!', severity: 'success' };
    } else if (this.esEventoPasado) {
      return { texto: 'Evento pasado', severity: 'danger' };
    } else if (this.diasRestantes <= 7) {
      return { texto: `¡Faltan solo ${this.diasRestantes} días!`, severity: 'warning' };
    } else {
      return { texto: `Faltan ${this.diasRestantes} días`, severity: 'info' };
    }
  }

  getDiasRestantesTexto(): string {
    if (this.esEventoHoy) return '¡Hoy!';
    if (this.esEventoPasado) return 'Ya pasó';
    if (this.diasRestantes === 1) return 'Mañana';
    if (this.diasRestantes <= 7) return `${this.diasRestantes} días`;
    if (this.diasRestantes <= 30) return `${this.diasRestantes} días`;
    if (this.diasRestantes <= 365) return `${Math.floor(this.diasRestantes / 30)} meses`;
    return `${Math.floor(this.diasRestantes / 365)} años`;
  }

  // Métodos para CSS classes
  getTipoCssClass(tipo?: string): string {
    if (!tipo) return 'tipo-otro';
    return `tipo-${tipo.toLowerCase().replace('_', '-')}`;
  }

  getEstadoCssClass(): string {
    if (this.esEventoHoy) return 'estado-hoy';
    if (this.esEventoPasado) return 'estado-pasado';
    return 'estado-futuro';
  }

  getEstadoIcono(): string {
    if (this.esEventoHoy) return 'pi pi-calendar-times';
    if (this.esEventoPasado) return 'pi pi-check-circle';
    return 'pi pi-clock';
  }

  getEstadoTexto(): string {
    if (this.esEventoHoy) return '¡Hoy!';
    if (this.esEventoPasado) return 'Pasado';
    return 'Próximo';
  }

}
