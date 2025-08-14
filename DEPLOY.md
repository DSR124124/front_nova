# 🚀 Guía de Despliegue en GitHub Pages

## 📋 Prerrequisitos

1. **Cuenta de GitHub** activa
2. **Repositorio** creado en GitHub
3. **Node.js 18+** instalado localmente
4. **Git** configurado en tu máquina

## 🔧 Configuración Inicial

### 1. Crear el repositorio en GitHub

```bash
# Crear un nuevo repositorio en GitHub llamado "front_nova"
# URL: https://github.com/tu-usuario/front_nova
```

### 2. Configurar el repositorio local

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar el origen remoto
git remote add origin https://github.com/tu-usuario/front_nova.git

# Crear y cambiar a la rama main
git checkout -b main

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Front Nova application"

# Subir a GitHub
git push -u origin main
```

## 🚀 Despliegue Automático

### Opción 1: GitHub Actions (Recomendado)

El proyecto ya está configurado con GitHub Actions. Solo necesitas:

1. **Hacer push** a la rama `main`
2. **GitHub Actions** se ejecutará automáticamente
3. **La aplicación se desplegará** en `https://tu-usuario.github.io/front_nova/`

### Opción 2: Despliegue Manual

```bash
# Construir para GitHub Pages
npm run build:github

# Desplegar usando angular-cli-ghpages
npm run deploy
```

## ⚙️ Configuración de GitHub Pages

### 1. Ir a Settings del repositorio

- Navega a tu repositorio en GitHub
- Haz clic en **Settings** (pestaña)
- Desplázate hacia abajo hasta **Pages**

### 2. Configurar Source

- **Source**: Selecciona **Deploy from a branch**
- **Branch**: Selecciona **gh-pages** (se creará automáticamente)
- **Folder**: Deja `/ (root)`
- Haz clic en **Save**

### 3. Verificar el despliegue

- Espera unos minutos para que se complete el despliegue
- La URL será: `https://tu-usuario.github.io/front_nova/`

## 🔄 Actualizaciones

### Para actualizar la aplicación:

```bash
# Hacer cambios en tu código
# ...

# Agregar cambios
git add .

# Commit
git commit -m "Update: descripción de los cambios"

# Push a main (despliega automáticamente)
git push origin main
```

## 🐛 Solución de Problemas

### Error: Build falló

```bash
# Verificar que no hay errores de compilación
npm run build

# Si hay errores de presupuesto, usar la configuración de GitHub
npm run build:github
```

### Error: No se encuentra la página

1. **Verificar** que GitHub Pages está habilitado
2. **Esperar** 5-10 minutos para el despliegue
3. **Verificar** que la rama gh-pages existe
4. **Revisar** los logs de GitHub Actions

### Error: Rutas no funcionan

1. **Verificar** que el `baseHref` está configurado correctamente
2. **Usar** `npm run build:github` en lugar de `npm run build`
3. **Verificar** que las rutas en el código usan rutas relativas

## 📱 Configuración del Backend

### 1. Actualizar environment.prod.ts

```typescript
export const environment = {
  production: true,
  base: 'https://tu-backend-real.com' // URL de tu backend en producción
};
```

### 2. Reconstruir y desplegar

```bash
npm run build:github
npm run deploy
```

## 🔒 Variables de Entorno

### Para configuraciones sensibles:

1. **Crear** archivo `.env` (no subir a git)
2. **Agregar** variables necesarias
3. **Usar** en el código según sea necesario

## 📊 Monitoreo

### Verificar el estado del despliegue:

1. **GitHub Actions**: Ver logs de despliegue
2. **GitHub Pages**: Ver estado en Settings > Pages
3. **URL de la aplicación**: Verificar que funciona

## 🎯 Próximos Pasos

- [ ] Configurar dominio personalizado (opcional)
- [ ] Implementar CI/CD más avanzado
- [ ] Agregar tests automatizados
- [ ] Configurar monitoreo de performance

## 📞 Soporte

Si tienes problemas con el despliegue:

1. **Revisar** los logs de GitHub Actions
2. **Verificar** la configuración de GitHub Pages
3. **Consultar** la documentación de Angular CLI
4. **Crear** un issue en el repositorio

---

🚀 **¡Tu aplicación Front Nova estará disponible en GitHub Pages!**
