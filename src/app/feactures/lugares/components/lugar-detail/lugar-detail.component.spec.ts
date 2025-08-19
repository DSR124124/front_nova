import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { LugarDetailComponent } from './lugar-detail.component';
import { LugarService } from '../../../../core/services/lugar.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Lugar, CategoriaLugar } from '../../../../core/models/Interfaces/lugar/lugar';

describe('LugarDetailComponent', () => {
  let component: LugarDetailComponent;
  let fixture: ComponentFixture<LugarDetailComponent>;
  let mockLugarService: jasmine.SpyObj<LugarService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  const mockLugar: Lugar = {
    id: 1,
    nombre: 'Restaurante Test',
    descripcion: 'Un restaurante de prueba',
    direccion: 'Calle Test 123',
    latitud: -12.0464,
    longitud: -77.0428,
    categoria: CategoriaLugar.RESTAURANTE,
    precio: 'MODERADO',
    rating: 4,
    horario: '12:00 - 22:00',
    telefono: '+51 123 456 789',
    email: 'test@restaurante.com',
    sitioWeb: 'https://restaurante-test.com',
    esFavorito: true,
    esVerificado: true,
    estado: 'activo',
    fechaCreacion: new Date('2024-01-01'),
    fechaActualizacion: new Date('2024-01-15'),
    servicios: ['WiFi', 'Estacionamiento', 'Terraza']
  };

  beforeEach(async () => {
    const lugarServiceSpy = jasmine.createSpyObj('LugarService', ['getLugarById', 'updateLugar', 'eliminar']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [
        LugarDetailComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: LugarService, useValue: lugarServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    mockLugarService = TestBed.inject(LugarService) as jasmine.SpyObj<LugarService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockConfirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load lugar on init', () => {
    mockLugarService.getLugarById.and.returnValue(of(mockLugar));

    fixture.detectChanges();

    expect(mockLugarService.getLugarById).toHaveBeenCalledWith(1);
    expect(component.lugar).toEqual(mockLugar);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading lugar', () => {
    const error = new Error('Error de prueba');
    mockLugarService.getLugarById.and.returnValue(of(error));

    fixture.detectChanges();

    expect(component.error).toBeTrue();
    expect(component.errorMessage).toBe('No se pudo cargar el lugar');
    expect(component.loading).toBeFalse();
  });

  it('should toggle favorite status', () => {
    component.lugar = mockLugar;
    mockLugarService.updateLugar.and.returnValue(of(void 0));

    component.toggleFavorito();

    expect(mockLugarService.updateLugar).toHaveBeenCalledWith(1, {
      ...mockLugar,
      esFavorito: false
    });
  });

  it('should delete lugar with confirmation', () => {
    component.lugar = mockLugar;
    mockConfirmationService.confirm.and.callFake((options) => {
      options.accept();
    });
    mockLugarService.eliminar.and.returnValue(of(void 0));

    component.eliminarLugar();

    expect(mockConfirmationService.confirm).toHaveBeenCalled();
    expect(mockLugarService.eliminar).toHaveBeenCalledWith(1);
  });

  it('should get correct icon class for categoria', () => {
    expect(component.getIconClass(CategoriaLugar.RESTAURANTE)).toBe('pi-utensils');
    expect(component.getIconClass(CategoriaLugar.PARQUE)).toBe('pi-tree');
    expect(component.getIconClass(CategoriaLugar.CINE)).toBe('pi-video');
    expect(component.getIconClass(CategoriaLugar.ENTRETENIMIENTO)).toBe('pi-gamepad');
    expect(component.getIconClass(CategoriaLugar.CASA)).toBe('pi-home');
    expect(component.getIconClass(undefined)).toBe('pi-map-marker');
  });

  it('should get correct price color', () => {
    expect(component.getPrecioColor('GRATIS')).toBe('success');
    expect(component.getPrecioColor('ECONOMICO')).toBe('info');
    expect(component.getPrecioColor('MODERADO')).toBe('warning');
    expect(component.getPrecioColor('COSTOSO')).toBe('danger');
    expect(component.getPrecioColor('PREMIUM')).toBe('danger');
    expect(component.getPrecioColor('OTRO')).toBe('secondary');
  });

  it('should get correct estado CSS class', () => {
    expect(component.getEstadoCssClass('activo')).toBe('success');
    expect(component.getEstadoCssClass('inactivo')).toBe('danger');
    expect(component.getEstadoCssClass('pendiente')).toBe('warning');
    expect(component.getEstadoCssClass('otro')).toBe('info');
  });

  it('should open Google Maps with correct coordinates', () => {
    component.lugar = mockLugar;
    spyOn(window, 'open');

    component.abrirEnGoogleMaps();

    expect(window.open).toHaveBeenCalledWith(
      'https://www.google.com/maps?q=-12.0464,-77.0428',
      '_blank'
    );
  });

  it('should share lugar when Web Share API is available', () => {
    component.lugar = mockLugar;
    const mockShare = jasmine.createSpy('share').and.returnValue(Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true
    });

    component.compartirLugar();

    expect(mockShare).toHaveBeenCalledWith({
      title: 'Restaurante Test',
      text: 'Mira este lugar: Restaurante Test',
      url: window.location.href
    });
  });

  it('should copy link to clipboard when Web Share API is not available', () => {
    component.lugar = mockLugar;
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true
    });
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.compartirLugar();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
  });
});
