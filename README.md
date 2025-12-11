📱 WhatsApp Frontend

Proyecto basado en React + Vite para la interfaz web de WhatsApp.

📋 Tabla de Contenidos

🚀 Inicio Rápido

⚙️ Configuración Inicial

📦 Scripts Disponibles

📁 Estructura del Proyecto

🔧 Tecnologías

🌿 Flujo Básico con Git

📥 Sincronizar Cambios

🚀 Inicio Rápido
# Clonar el repositorio
git clone https://github.com/tu-usuario/whatsapp-frontend.git

# Entrar al proyecto
cd whatsapp-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

⚙️ Configuración Inicial
# Verificar instalación
node --version
npm --version


Si no tienes Node.js, descárgalo desde:
https://nodejs.org/

📦 Scripts Disponibles
# Inicia el proyecto en modo desarrollo
npm run dev

# Genera el build optimizado para producción
npm run build

# Muestra una vista previa del build generado
npm run preview

# Revisa el código con ESLint y muestra errores o advertencias
npm run lint

📁 Estructura del Proyecto
src/
 ├── assets/      # Recursos estáticos (imágenes, iconos, etc.)
 ├── components/  # Componentes reutilizables de la UI
 ├── config/      # Configuraciones (endpoints, claves, etc.)
 ├── hooks/       # Custom Hooks
 └── utils/       # Funciones utilitarias
public/           # Archivos públicos accesibles directamente

🔧 Tecnologías

React 19

Vite 7

Axios

Socket.io Client

ESLint

🌿 Flujo Básico con Git
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

📥 Sincronizar Cambios
🔄 Actualizar tu rama con develop

Opción 1: Merge (recomendado para equipos)

git checkout develop
git pull origin develop
git checkout tu-rama
git merge develop


Opción 2: Rebase (commits más limpios)

git checkout tu-rama
git rebase develop

📌 Traer cambios de otras ramas
# Cherry-pick de un commit específico
git cherry-pick abc1234

# Merge de otra rama
git merge origin/otra-rama

🌐 Sincronizar con main (producción)
git checkout main
git pull origin main
git checkout tu-rama
git merge main