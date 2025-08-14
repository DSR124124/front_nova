# 🚀 Front Nova - Aplicación de Gestión de Parejas

## 📋 Descripción

Front Nova es una aplicación web moderna desarrollada en Angular para la gestión integral de parejas, incluyendo citas, eventos, lugares, chat, regalos, recordatorios y más.

## ✨ Características Principales

- 🔐 **Autenticación JWT** con roles de usuario
- 📅 **Gestión de Citas** con calendario integrado
- ⭐ **Eventos y Lugares** con mapa interactivo
- 💬 **Chat en tiempo real** entre parejas
- 🎁 **Sistema de Regalos** con lista de deseos
- 🔔 **Recordatorios** y notificaciones
- 📝 **Notas personales** y multimedia
- 👥 **Perfiles de usuario** y pareja
- 📱 **Diseño responsive** para todos los dispositivos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 17
- **UI Components**: PrimeNG
- **Estilos**: CSS Variables + Responsive Design
- **Autenticación**: JWT + Guards
- **Routing**: Angular Router con Lazy Loading
- **Estado**: RxJS + BehaviorSubject

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm 9+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/front_nova.git

# Navegar al directorio
cd front_nova

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/           # Servicios, guards, interceptors
│   ├── feactures/      # Módulos de funcionalidad
│   ├── layout/         # Componentes de layout
│   ├── shared/         # Componentes compartidos
│   └── prime-ng/       # Configuración PrimeNG
├── assets/             # Imágenes, estilos, fuentes
└── environments/       # Configuraciones por ambiente
```

## 🔧 Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run test` - Ejecutar tests
- `npm run deploy` - Desplegar en GitHub Pages

## 🌐 Despliegue en GitHub Pages

La aplicación está configurada para desplegarse automáticamente en GitHub Pages:

1. **Configuración automática** mediante GitHub Actions
2. **Despliegue automático** en cada push a main
3. **URL**: `https://tu-usuario.github.io/front_nova/`

## 📱 Funcionalidades por Módulo

### 🏠 Dashboard
- Vista general de actividades
- Estadísticas de la pareja
- Eventos próximos

### 📅 Citas
- Crear y gestionar citas
- Calendario visual
- Filtros y búsqueda

### ⭐ Eventos
- Crear eventos especiales
- Galería de fotos
- Línea de tiempo

### 🗺️ Lugares
- Mapa interactivo
- Lugares favoritos
- Crear nuevos lugares

### 💬 Chat
- Mensajería en tiempo real
- Selector de emojis
- Historial de conversaciones

### 🎁 Regalos
- Lista de deseos
- Historial de regalos
- Estadísticas

### 🔔 Recordatorios
- Crear recordatorios
- Calendario de recordatorios
- Notificaciones

### 📝 Notas
- Notas personales
- Búsqueda y filtros
- Organización por categorías

### 🖼️ Multimedia
- Galería de fotos
- Subir archivos
- Visualizador de medios

### 👤 Perfil
- Perfil de usuario
- Perfil de pareja
- Configuraciones
- Cambio de contraseña

## 🔐 Autenticación y Autorización

- **JWT Token** para sesiones seguras
- **Guards** para proteger rutas
- **Roles** de usuario (USER, ADMIN)
- **Interceptors** para manejo automático de tokens

## 🎨 Temas y Estilos

- **Tema Aura** de PrimeNG
- **Variables CSS** para personalización
- **Diseño responsive** para móviles y desktop
- **Iconos PrimeIcons** para interfaz moderna

## 🚀 Roadmap

- [ ] Implementación de refresh tokens
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Tests unitarios y e2e
- [ ] Internacionalización (i18n)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre** - [@tu-twitter](https://twitter.com/tu-twitter)

## 🙏 Agradecimientos

- **PrimeNG** por los componentes de UI
- **Angular Team** por el framework
- **Comunidad Angular** por el soporte

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**
