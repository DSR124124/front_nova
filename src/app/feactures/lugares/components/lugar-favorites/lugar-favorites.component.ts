import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LugarService } from '../../../../core/services/lugar.service';
import { Lugar, CategoriaLugar } from '../../../../core/models/lugar';

@Component({
  selector: 'app-lugar-favorites',
  standalone: false,
  templateUrl: './lugar-favorites.component.html',
  styleUrl: './lugar-favorites.component.css'
})
export class LugarFavoritesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  lugares: Lugar[] = [];
  lugaresFavoritos: Lugar[] = [];
  lugaresOriginales: Lugar[] = []; // Para restaurar cuando se limpien los filtros
  loading = false;

  constructor(
    private lugarService: LugarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLugares();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarLugares(): void {
    this.loading = true;
    this.lugarService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          this.lugares = lugares;
          this.lugaresFavoritos = lugares.filter(l => l.esFavorito);
          this.lugaresOriginales = [...this.lugaresFavoritos]; // Guardar copia original
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar lugares:', error);
          this.loading = false;
        }
      });
  }

  // Métodos para manejar eventos del componente de búsqueda
  onSearchResults(lugares: Lugar[]): void {
    // Filtrar solo los lugares que están en favoritos
    if (lugares.length > 0) {
      // Filtrar por los resultados de búsqueda que también sean favoritos
      this.lugaresFavoritos = lugares.filter(l => l.esFavorito);
    } else {
      // Si no hay resultados de búsqueda, mostrar todos los favoritos
      this.lugaresFavoritos = this.lugares.filter(l => l.esFavorito);
    }
  }

  onSearchCleared(): void {
    // Restaurar todos los lugares favoritos cuando se limpia la búsqueda
    this.lugaresFavoritos = [...this.lugaresOriginales];
  }

  // Métodos para gestionar favoritos
  toggleFavorito(lugar: Lugar): void {
    lugar.esFavorito = !lugar.esFavorito;

    if (lugar.esFavorito) {
      this.lugaresFavoritos.push(lugar);
    } else {
      this.lugaresFavoritos = this.lugaresFavoritos.filter(l => l.id !== lugar.id);
    }

    // Aquí se llamaría al servicio para actualizar en el backend
    if (lugar.id) {
      this.lugarService.updateLugar(lugar.id, lugar).subscribe({
        next: () => {
          console.log('Favorito actualizado');
          // Actualizar la lista original
          this.lugaresOriginales = [...this.lugaresFavoritos];
        },
        error: (error) => {
          console.error('Error al actualizar favorito:', error);
          // Revertir cambio en caso de error
          lugar.esFavorito = !lugar.esFavorito;
        }
      });
    }
  }

  quitarDeFavoritos(lugar: Lugar): void {
    lugar.esFavorito = false;
    this.lugaresFavoritos = this.lugaresFavoritos.filter(l => l.id !== lugar.id);

    // Actualizar en el backend
    if (lugar.id) {
      this.lugarService.updateLugar(lugar.id, lugar).subscribe({
        next: () => {
          console.log('Lugar removido de favoritos');
          // Actualizar la lista original
          this.lugaresOriginales = [...this.lugaresFavoritos];
        },
        error: (error) => {
          console.error('Error al remover de favoritos:', error);
          // Revertir cambio en caso de error
          lugar.esFavorito = true;
          this.lugaresFavoritos.push(lugar);
        }
      });
    }
  }

  // Navegación
  verDetalle(lugar: Lugar): void {
    if (lugar.id) {
      this.router.navigate(['/app/lugares/detalle', lugar.id]);
    }
  }

  editarLugar(lugar: Lugar): void {
    if (lugar.id) {
      this.router.navigate(['/app/lugares/editar', lugar.id]);
    }
  }

  navegarALugares(): void {
    this.router.navigate(['/app/lugares']);
  }

  trackByLugar(index: number, lugar: Lugar): number {
    return lugar.id || index;
  }

  // Método para obtener la clase del icono
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

  // Método para obtener el color del estado
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
}
