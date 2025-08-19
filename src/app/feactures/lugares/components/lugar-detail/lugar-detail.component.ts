import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { LugarService } from '../../../../core/services/lugar.service';
import { Lugar } from '../../../../core/models/Interfaces/lugar/lugar';
import { CategoriaLugar } from '../../../../core/models/enums/categoria-lugar.enum';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-lugar-detail',
  templateUrl: './lugar-detail.component.html',
  styleUrls: ['./lugar-detail.component.css'],
  standalone: false,

})
export class LugarDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() lugarId?: string | number;
  @Output() lugarActualizado = new EventEmitter<Lugar>();

  private destroy$ = new Subject<void>();

  lugar: Lugar | null = null;
  loading = false;
  error = false;
  errorMessage = '';

  // Propiedades para el mapa
  mapLat: number = 0;
  mapLng: number = 0;
  mapZoom: number = 15;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lugarService: LugarService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadLugar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lugarId'] && !changes['lugarId'].firstChange) {
      this.loadLugar();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLugar(): void {
    const id = this.lugarId || this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = true;
      this.errorMessage = 'ID de lugar no válido';
      return;
    }

    this.loading = true;
    this.error = false;

    this.lugarService.getLugarById(Number(id)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (lugar: Lugar) => {
        this.lugar = lugar;
        this.initializeMapCoordinates();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar lugar:', error);
        this.error = true;
        this.errorMessage = 'No se pudo cargar el lugar';
        this.loading = false;
      }
    });
  }

  private initializeMapCoordinates(): void {
    if (this.lugar?.latitud && this.lugar?.longitud) {
      this.mapLat = this.lugar.latitud;
      this.mapLng = this.lugar.longitud;
    }
  }

  // Métodos de navegación
  editarLugar(): void {
    if (this.lugar?.id) {
      this.router.navigate(['/app/lugares/editar', this.lugar.id]);
    }
  }

  volverALista(): void {
    this.router.navigate(['/app/lugares/mapa']);
  }

  volverAFavoritos(): void {
    this.router.navigate(['/app/lugares/favoritos']);
  }

  // Métodos de gestión de favoritos
  toggleFavorito(): void {
    if (this.lugar?.id) {
      const lugarActualizado = { ...this.lugar, esFavorito: !this.lugar.esFavorito };

      this.lugarService.updateLugar(this.lugar.id, lugarActualizado).subscribe({
        next: () => {
          this.lugar = lugarActualizado;
          this.lugarActualizado.emit(this.lugar);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: this.lugar.esFavorito ? 'Lugar agregado a favoritos' : 'Lugar removido de favoritos'
          });
        },
        error: (error) => {
          console.error('Error al actualizar lugar:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el lugar'
          });
        }
      });
    }
  }

  eliminarLugar(): void {
    if (this.lugar?.id) {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que quieres eliminar "${this.lugar.nombre}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.lugarService.eliminar(this.lugar!.id!).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Lugar eliminado correctamente'
              });
              this.volverALista();
            },
            error: (error) => {
              console.error('Error al eliminar lugar:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el lugar'
              });
            }
          });
        }
      });
    }
  }

  // Métodos de utilidad
  getIconClass(categoria?: CategoriaLugar): string {
    switch (categoria) {
      case CategoriaLugar.RESTAURANTE:
        return 'pi-utensils';
      case CategoriaLugar.PARQUE:
        return 'pi-tree';
      case CategoriaLugar.CINE:
        return 'pi-video';
      case CategoriaLugar.ENTRETENIMIENTO:
        return 'pi-gamepad';
      case CategoriaLugar.CASA:
        return 'pi-home';
      default:
        return 'pi-map-marker';
    }
  }

  getPrecioColor(precio: string): string {
    switch (precio) {
      case 'GRATIS':
        return 'success';
      case 'ECONOMICO':
        return 'info';
      case 'MODERADO':
        return 'warning';
      case 'COSTOSO':
        return 'danger';
      case 'PREMIUM':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getEstadoCssClass(estado?: string): string {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      case 'pendiente':
        return 'warning';
      default:
        return 'info';
    }
  }
  // Método para abrir en Google Maps
  abrirEnGoogleMaps(): void {
    if (this.lugar?.latitud && this.lugar?.longitud) {
      const url = `https://www.google.com/maps?q=${this.lugar.latitud},${this.lugar.longitud}`;
      window.open(url, '_blank');
    }
  }

  // Método para compartir lugar
  compartirLugar(): void {
    if (navigator.share && this.lugar) {
      navigator.share({
        title: this.lugar.nombre,
        text: `Mira este lugar: ${this.lugar.nombre}`,
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Enlace copiado al portapapeles'
        });
      });
    }
  }
}
