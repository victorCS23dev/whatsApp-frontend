# 📱 WhatsApp Frontend

> Proyecto basado en React + Vite para la interfaz web de WhatsApp.

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [⚙️ Configuración Inicial](#-configuración-inicial)
- [📦 Scripts Disponibles](#-scripts-disponibles)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Tecnologías](#-tecnologías)
- [🌿 Flujo Básico con Git](#-flujo-básico-con-git)
- [📥 Sincronizar Cambios](#-sincronizar-cambios)

---

## 🚀 Inicio Rápido
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/whatsapp-frontend.git

# Entrar al proyecto
cd whatsapp-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```
✅ **Abre [http://localhost:3000](http://localhost:3000) y ya tienes el proyecto corriendo!**

## ⚙️ Configuración Inicial
```bash
# Verificar instalación
node --version
npm --version


Si no tienes Node.js, descárgalo desde:
https://nodejs.org/
```
## 📦 Scripts Disponibles
```bash
# Inicia el proyecto en modo desarrollo
npm run dev

# Genera el build optimizado para producción
npm run build

# Muestra una vista previa del build generado
npm run preview

# Revisa el código con ESLint y muestra errores o advertencias
npm run lint
```
## 📁 Estructura del Proyecto
```
src/
 ├── assets/      # Recursos estáticos (imágenes, iconos, etc.)
 ├── components/  # Componentes reutilizables de la UI
 ├── config/      # Configuraciones (endpoints, claves, etc.)
 ├── hooks/       # Custom Hooks
 └── utils/       # Funciones utilitarias
public/           # Archivos públicos accesibles directamente
```

## 🔧 Tecnologías

1. React 19
2. Vite 7
3. Axios
4. Socket.io Client
5. ESLint

## 🌿 Flujo Básico con Git
```bash
# Crear una nueva rama para trabajar
git checkout -b "nombre-de-rama"

# Ver cambios realizados
git status

# Agregar todos los archivos modificados
git add .

# Guardar cambios con un mensaje
git commit -m "feat: descripción del cambio"

# Subir tu rama al repositorio remoto
git push -u origin "nombre-de-rama"
```
## 📥 Sincronizar Cambios
```bash
🔄 Actualizar tu rama con develop

Opción 1: Merge (recomendado para equipos)

git checkout develop
git pull origin develop
git checkout tu-rama
git merge develop


Opción 2: Rebase (commits más limpios)

git checkout tu-rama
git rebase develop
```
📌 Traer cambios de otras ramas
```bash
# Cherry-pick de un commit específico
git cherry-pick abc1234

# Merge de otra rama
git merge origin/otra-rama
```
🌐 Sincronizar con main (producción)
```bash
git checkout main
git pull origin main
git checkout tu-rama
git merge main
```