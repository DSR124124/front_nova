import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LugarService } from '../../../../core/services/lugar.service';
import { Lugar, CategoriaLugar } from '../../../../core/models/lugar';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as L from 'leaflet';

@Component({
  selector: 'app-lugar-map',
  standalone: false,
  templateUrl: './lugar-map.component.html',
  styleUrl: './lugar-map.component.css'
})
export class LugarMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private destroy$ = new Subject<void>();

  lugares: Lugar[] = [];
  lugaresFiltrados: Lugar[] = [];
  lugarSeleccionado: Lugar | null = null;
  loading = false;

  // Propiedades para el modo detalle
  mostrarDetalle: boolean = false;

  constructor(
    private lugarService: LugarService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarLugares();
  }

  ngAfterViewInit(): void {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.inicializarMapa();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    // Coordenadas por defecto (Lima, Perú)
    const defaultLat = -12.0464;
    const defaultLng = -77.0428;
    const defaultZoom = 12;

    this.map = L.map(this.mapContainer.nativeElement).setView([defaultLat, defaultLng], defaultZoom);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    // Intentar obtener ubicación del usuario
    this.obtenerUbicacionUsuario();
  }

  private obtenerUbicacionUsuario(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Centrar mapa en ubicación del usuario
          this.map.setView([userLat, userLng], 13);

          // Agregar marcador de usuario
          const userIcon = L.divIcon({
            className: 'user-marker',
            html: '<i class="pi pi-user" style="color: #007bff; font-size: 20px;"></i>',
            iconSize: [20, 20]
          });

          L.marker([userLat, userLng], { icon: userIcon })
            .addTo(this.map)
            .bindPopup('Tu ubicación actual')
            .openPopup();
        },
        (error) => {
          console.log('No se pudo obtener la ubicación del usuario:', error);
        }
      );
    }
  }

  private cargarLugares(): void {
    this.loading = true;
    this.lugarService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          this.lugares = lugares;
          this.lugaresFiltrados = [...lugares];
          this.agregarMarcadores();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar lugares:', error);
          this.loading = false;
        }
      });
  }

  private agregarMarcadores(): void {
    // Limpiar marcadores existentes
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.lugares.forEach(lugar => {
      if (lugar.latitud && lugar.longitud) {
        const marker = this.crearMarcador(lugar);
        this.markers.push(marker);
        marker.addTo(this.map);
      }
    });
  }

  private crearMarcador(lugar: Lugar): L.Marker {
    const icon = this.obtenerIconoMarcador(lugar.categoria);

    const marker = L.marker([lugar.latitud!, lugar.longitud!], { icon })
      .bindPopup(this.crearPopupContent(lugar));

    return marker;
  }

  private obtenerIconoMarcador(categoria?: CategoriaLugar): L.DivIcon {
    let iconClass = 'pi pi-map-marker';
    let color = '#6c757d';

    switch (categoria) {
      case CategoriaLugar.RESTAURANTE:
        iconClass = 'pi pi-utensils';
        color = '#dc3545';
        break;
      case CategoriaLugar.PARQUE:
        iconClass = 'pi pi-tree';
        color = '#28a745';
        break;
      case CategoriaLugar.CINE:
        iconClass = 'pi pi-video';
        color = '#6f42c1';
        break;
      case CategoriaLugar.ENTRETENIMIENTO:
        iconClass = 'pi pi-gamepad';
        color = '#fd7e14';
        break;
      case CategoriaLugar.CASA:
        iconClass = 'pi pi-home';
        color = '#17a2b8';
        break;
      case CategoriaLugar.OTRO:
        iconClass = 'pi pi-map-marker';
        color = '#6c757d';
        break;
    }

    return L.divIcon({
      className: 'lugar-marker',
      html: `<i class="${iconClass}" style="color: ${color}; font-size: 24px;"></i>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });
  }

  private crearPopupContent(lugar: Lugar): string {
    let content = `
      <div class="lugar-popup">
        <h4 style="margin: 0 0 8px 0; color: #333;">${lugar.nombre}</h4>
    `;

    if (lugar.categoria) {
      content += `<p style="margin: 0 0 8px 0; color: #666;"><i class="pi pi-tag"></i> ${lugar.categoria}</p>`;
    }

    if (lugar.direccion) {
      content += `<p style="margin: 0 0 8px 0; color: #666;"><i class="pi pi-map-marker"></i> ${lugar.direccion}</p>`;
    }

    if (lugar.rating) {
      content += `<p style="margin: 0 0 8px 0; color: #666;"><i class="pi pi-star"></i> ${lugar.rating}/5</p>`;
    }

    if (lugar.precio) {
      content += `<p style="margin: 0 0 8px 0; color: #666;"><i class="pi pi-dollar"></i> ${lugar.precio}</p>`;
    }

    content += `
        <div style="margin-top: 12px;">
          <button onclick="window.open('/app/lugares/detalle/${lugar.id}', '_blank')"
                  style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
            Ver Detalle
          </button>
        </div>
      </div>
    `;

    return content;
  }

  // Métodos para manejar eventos del componente de búsqueda
  onSearchResults(lugares: Lugar[]): void {
    // Aquí se implementaría la lógica para filtrar lugares según los criterios de búsqueda
    // Por ahora, simplemente actualizamos la lista filtrada
    this.lugaresFiltrados = lugares.length > 0 ? lugares : [...this.lugares];
    this.actualizarMarcadores(this.lugaresFiltrados);
  }

  onSearchCleared(): void {
    // Restaurar todos los lugares cuando se limpia la búsqueda
    this.lugaresFiltrados = [...this.lugares];
    this.actualizarMarcadores(this.lugaresFiltrados);
  }

  private actualizarMarcadores(lugares: Lugar[]): void {
    // Limpiar marcadores existentes
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Agregar nuevos marcadores
    lugares.forEach(lugar => {
      if (lugar.latitud && lugar.longitud) {
        const marker = this.crearMarcador(lugar);
        this.markers.push(marker);
        marker.addTo(this.map);
      }
    });

    // Ajustar vista si hay marcadores
    if (this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Métodos de utilidad
  seleccionarLugar(lugar: Lugar): void {
    this.lugarSeleccionado = lugar;
    this.centrarEnLugar(lugar);
  }

  centrarEnLugar(lugar: Lugar): void {
    if (lugar.latitud && lugar.longitud) {
      this.map.setView([lugar.latitud, lugar.longitud], 15);

      // Encontrar y abrir el marcador correspondiente
      const marker = this.markers.find(m => {
        const pos = m.getLatLng();
        return pos.lat === lugar.latitud && pos.lng === lugar.longitud;
      });

      if (marker) {
        marker.openPopup();
      }
    }
  }

  // Métodos de CRUD
  agregarLugar(): void {
    this.router.navigate(['/app/lugares/crear']);
  }

  verDetalle(lugar: Lugar): void {
    this.lugarSeleccionado = lugar;
    this.mostrarDetalle = true;
  }

  editarLugar(lugar: Lugar): void {
    if (lugar.id) {
      this.router.navigate(['/app/lugares/editar', lugar.id]);
    }
  }

  eliminarLugar(lugar: Lugar): void {
    if (lugar.id) {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que quieres eliminar "${lugar.nombre}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.lugarService.eliminar(lugar.id!).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Lugar eliminado correctamente'
              });
              this.cargarLugares();
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

  toggleFavorito(lugar: Lugar): void {
    if (lugar.id) {
      const lugarActualizado = { ...lugar, esFavorito: !lugar.esFavorito };
      this.lugarService.updateLugar(lugar.id, lugarActualizado).subscribe({
        next: () => {
          // Actualizar el lugar en la lista
          const index = this.lugares.findIndex(l => l.id === lugar.id);
          if (index !== -1) {
            this.lugares[index] = lugarActualizado;
          }

          const indexFiltrado = this.lugaresFiltrados.findIndex(l => l.id === lugar.id);
          if (indexFiltrado !== -1) {
            this.lugaresFiltrados[indexFiltrado] = lugarActualizado;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: lugar.esFavorito ? 'Lugar removido de favoritos' : 'Lugar agregado a favoritos'
          });
        },
        error: (error: any) => {
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

  // Método para obtener la clase del icono (para el HTML)
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

  // Método para obtener el color del precio
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

  // Método para trackBy en ngFor
  trackByLugar(index: number, lugar: Lugar): number {
    return lugar.id || index;
  }

  // Métodos para el modo detalle
  volverALista(): void {
    this.mostrarDetalle = false;
    this.lugarSeleccionado = null;
  }

  onLugarActualizado(lugar: Lugar): void {
    // Actualizar el lugar en las listas cuando se modifica desde el detalle
    const index = this.lugares.findIndex(l => l.id === lugar.id);
    if (index !== -1) {
      this.lugares[index] = lugar;
    }

    const indexFiltrado = this.lugaresFiltrados.findIndex(l => l.id === lugar.id);
    if (indexFiltrado !== -1) {
      this.lugaresFiltrados[indexFiltrado] = lugar;
    }

    // Actualizar marcadores en el mapa
    this.actualizarMarcadores(this.lugaresFiltrados);

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Lugar actualizado correctamente'
    });
  }
}
