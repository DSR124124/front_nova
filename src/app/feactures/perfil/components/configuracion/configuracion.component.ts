import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

interface ConfiguracionPrivacidad {
  perfilPublico: boolean;
  mostrarEmail: boolean;
  mostrarFechaNacimiento: boolean;
  permitirBusqueda: boolean;
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
}

interface ConfiguracionGeneral {
  idioma: string;
  tema: string;
  zona: string;
  formatoFecha: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: false,
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {
  configuracionForm: FormGroup;
  loading = false;

  // Opciones para los selectores
  idiomas = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
    { label: 'Português', value: 'pt' }
  ];

  temas = [
    { label: 'Claro', value: 'light' },
    { label: 'Oscuro', value: 'dark' },
    { label: 'Automático', value: 'auto' }
  ];

  zonas = [
    { label: 'UTC-5 (Bogotá, Lima)', value: 'America/Bogota' },
    { label: 'UTC-3 (Buenos Aires)', value: 'America/Argentina/Buenos_Aires' },
    { label: 'UTC-6 (México)', value: 'America/Mexico_City' },
    { label: 'UTC+0 (Londres)', value: 'Europe/London' }
  ];

  formatosFecha = [
    { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
    { label: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
    { label: 'YYYY-MM-DD', value: 'yyyy-MM-dd' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.configuracionForm = this.createForm();
  }

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Configuración general
      idioma: ['es', Validators.required],
      tema: ['light', Validators.required],
      zona: ['America/Bogota', Validators.required],
      formatoFecha: ['dd/MM/yyyy', Validators.required],

      // Configuración de privacidad
      perfilPublico: [true],
      mostrarEmail: [false],
      mostrarFechaNacimiento: [true],
      permitirBusqueda: [true],

      // Notificaciones
      notificacionesPush: [true],
      notificacionesEmail: [true],
      notificacionesCitas: [true],
      notificacionesEventos: [true],
      notificacionesRegalos: [false],
      notificacionesRecordatorios: [true]
    });
  }

  cargarConfiguracion(): void {
    this.loading = true;

    // Simulamos la carga de configuración
    setTimeout(() => {
      // Aquí iría la llamada al servicio para obtener la configuración
      const configuracionGuardada = this.obtenerConfiguracionLocal();
      if (configuracionGuardada) {
        this.configuracionForm.patchValue(configuracionGuardada);
      }
      this.loading = false;
    }, 500);
  }

  private obtenerConfiguracionLocal(): any {
    // Simulación de configuración guardada
    return {
      idioma: 'es',
      tema: 'light',
      zona: 'America/Bogota',
      formatoFecha: 'dd/MM/yyyy',
      perfilPublico: true,
      mostrarEmail: false,
      mostrarFechaNacimiento: true,
      permitirBusqueda: true,
      notificacionesPush: true,
      notificacionesEmail: true,
      notificacionesCitas: true,
      notificacionesEventos: false,
      notificacionesRegalos: false,
      notificacionesRecordatorios: true
    };
  }

  guardarConfiguracion(): void {
    if (this.configuracionForm.valid) {
      this.loading = true;

      // Simulamos el guardado
      setTimeout(() => {
        const configuracion = this.configuracionForm.value;
        console.log('Configuración a guardar:', configuracion);

        // Aquí iría la llamada al servicio para guardar
        this.guardarConfiguracionLocal(configuracion);

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Configuración guardada correctamente'
        });

        this.loading = false;
      }, 1000);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, revisa los campos requeridos'
      });
    }
  }

  private guardarConfiguracionLocal(configuracion: any): void {
    // Simulación de guardado local
    localStorage.setItem('configuracion_usuario', JSON.stringify(configuracion));
  }

  restaurarDefecto(): void {
    this.configuracionForm.reset({
      idioma: 'es',
      tema: 'light',
      zona: 'America/Bogota',
      formatoFecha: 'dd/MM/yyyy',
      perfilPublico: true,
      mostrarEmail: false,
      mostrarFechaNacimiento: true,
      permitirBusqueda: true,
      notificacionesPush: true,
      notificacionesEmail: true,
      notificacionesCitas: true,
      notificacionesEventos: true,
      notificacionesRegalos: false,
      notificacionesRecordatorios: true
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: 'Configuración restaurada a valores por defecto'
    });
  }

  exportarConfiguracion(): void {
    const configuracion = this.configuracionForm.value;
    const dataStr = JSON.stringify(configuracion, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'configuracion_pareja.json';
    link.click();

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Configuración exportada correctamente'
    });
  }
}
