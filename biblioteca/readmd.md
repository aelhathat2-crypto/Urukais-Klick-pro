# 📚 Biblioteca Digital - Sistema de Gestión Completo

## 🎯 Descripción

Aplicación web completa de biblioteca digital desarrollada con HTML5, CSS3 y JavaScript vanilla. Sistema integral de gestión que permite administrar libros, usuarios y préstamos con una interfaz moderna y responsiva.

## ✨ Características Principales

### 📖 Gestión de Libros
- **Catálogo completo**: Agregar, editar y eliminar libros
- **Búsqueda en tiempo real**: Por título, autor o ISBN
- **Filtros avanzados**: Por categoría y disponibilidad
- **Información detallada**: Título, autor, ISBN, año, categoría, descripción, ubicación
- **Estado de disponibilidad**: Visualización clara de libros disponibles/prestados

### 👥 Gestión de Usuarios
- **Registro de usuarios**: Formulario completo con validaciones
- **Información completa**: Nombre, identificación, email, teléfono, dirección
- **Búsqueda de usuarios**: Por nombre, email o identificación
- **Contador de préstamos**: Visualización de préstamos activos por usuario
- **Validaciones**: Email válido, identificación única

### 🔄 Sistema de Préstamos
- **Registro de préstamos**: Asociación libro-usuario con fechas
- **Gestión de devoluciones**: Registro de devoluciones con fecha real
- **Control de vencimientos**: Identificación automática de préstamos vencidos
- **Extensión de plazos**: Opción para extender días de préstamo
- **Historial completo**: Registro de todos los préstamos (activos y devueltos)
- **Validaciones**: Verificar disponibilidad de libro y existencia de usuario

### 🎨 Interfaz y Experiencia de Usuario
- **Diseño moderno**: Paleta de colores contemporánea y tipografía legible
- **Totalmente responsivo**: Adaptado para móviles, tablets y desktop
- **Navegación intuitiva**: Sistema de pestañas para cambio de secciones
- **Animaciones suaves**: Transiciones y efectos hover profesionales
- **Notificaciones**: Sistema de feedback visual para todas las acciones

### 💾 Persistencia de Datos
- **Almacenamiento local**: Todos los datos se guardan en localStorage
- **Datos de ejemplo**: La aplicación incluye libros de muestra al primer uso
- **Persistencia entre sesiones**: Los datos se mantienen al cerrar y abrir la aplicación

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript Vanilla**: Funcionalidad completa sin dependencias externas
- **LocalStorage**: Persistencia de datos en el navegador
- **Diseño Responsivo**: Mobile-first approach

## 📁 Estructura de Archivos

```
biblioteca-digital/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos CSS3 modernos y responsivos
├── script.js           # Lógica JavaScript completa
└── README.md           # Este archivo de documentación
```

## 🚀 Instrucciones de Uso

### 1. Inicialización
- Abrir `index.html` en cualquier navegador web moderno
- La aplicación cargará automáticamente con datos de ejemplo
- Se mostrarán estadísticas en el header y navegación por pestañas

### 2. Gestión de Libros
- **Agregar libro**: Clic en "Agregar Libro" → Completar formulario → Guardar
- **Editar libro**: Clic en "Editar" en cualquier tarjeta de libro
- **Eliminar libro**: Clic en "Eliminar" (solo si no está prestado)
- **Buscar libros**: Usar la barra de búsqueda en tiempo real
- **Filtrar**: Usar los selectores de categoría y disponibilidad

### 3. Gestión de Usuarios
- **Registrar usuario**: Clic en "Registrar Usuario" → Completar formulario
- **Editar usuario**: Clic en "Editar" en cualquier tarjeta de usuario
- **Buscar usuarios**: Usar la barra de búsqueda por nombre, email o ID

### 4. Sistema de Préstamos
- **Nuevo préstamo**: Clic en "Nuevo Préstamo" → Seleccionar usuario y libro
- **Registrar devolución**: Clic en "Devolver" en un préstamo activo
- **Extender préstamo**: Clic en "Extender" → Ingresar días adicionales
- **Ver historial**: Clic en "Ver Historial Completo"

## 🔧 Funcionalidades Avanzadas

### Validaciones Automáticas
- Verificación de email válido al registrar usuarios
- Control de identificación única para usuarios
- Validación de disponibilidad de libros para préstamos
- Prevención de eliminación de libros/usuarios con préstamos activos

### Cálculos Automáticos
- **Días restantes**: Cálculo automático de días hasta vencimiento
- **Préstamos vencidos**: Identificación automática con alertas visuales
- **Estadísticas en tiempo real**: Contadores actualizados automáticamente

### Sistema de Notificaciones
- **Tipos**: Éxito, error, advertencia, información
- **Auto-cierre**: Las notificaciones se cierran automáticamente
- **Feedback visual**: Confirmación de todas las acciones importantes

## 📱 Diseño Responsivo

- **Desktop**: Diseño completo con grid de 3-4 columnas
- **Tablet**: Adaptación a 2-3 columnas con navegación optimizada
- **Mobile**: Layout de una columna con navegación vertical
- **Breakpoints**: 768px y 480px para adaptación óptima

## 🎨 Paleta de Colores

- **Primario**: #2563eb (Azul moderno)
- **Secundario**: #64748b (Gris profesional)
- **Éxito**: #22c55e (Verde)
- **Advertencia**: #f59e0b (Naranja)
- **Error**: #ef4444 (Rojo)
- **Acento**: #10b981 (Verde agua)

## 🔒 Persistencia y Seguridad

- **LocalStorage**: Todos los datos se guardan localmente
- **Validación de entrada**: Sanitización de datos de entrada
- **Prevención XSS**: Escape automático de contenido HTML
- **Datos de ejemplo**: Carga automática al primer uso

## 📊 Datos de Ejemplo Incluidos

La aplicación incluye 5 libros de ejemplo de diferentes categorías:
1. "Cien Años de Soledad" - Gabriel García Márquez
2. "El Quijote" - Miguel de Cervantes
3. "1984" - George Orwell
4. "Sapiens" - Yuval Noah Harari
5. "El Universo en una Cáscara de Nuez" - Stephen Hawking

Y 2 usuarios de ejemplo para demostrar la funcionalidad.

## 🆕 Próximas Mejoras

- Exportación de datos a CSV/JSON
- Impresión de recibos de préstamo
- Sistema de multas por retraso
- Búsqueda avanzada con múltiples criterios
- Modo oscuro/claro
- Integración con APIs de libros (Google Books, etc.)

## 👨‍💻 Desarrollado por

**MiniMax Agent** - Sistema de gestión de biblioteca digital desarrollado con tecnologías web modernas.

---

*Desarrollado con HTML5, CSS3 y JavaScript Vanilla - Sin dependencias externas*