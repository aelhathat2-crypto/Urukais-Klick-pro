# Base de Datos Urukais Klick 🐸

## Descripción

Esta es una base de datos MySQL completa diseñada para el sitio web **"Urukais Klick - El Ecosistema Silencioso de Alforja"**. La base de datos almacena toda la información sobre estas criaturas místicas, sus características, ubicaciones geográficas, proyectos web y contenido multimedia.

## 📁 Archivos Incluidos

### 1. `base_datos_urukais_klick.sql`
Script principal que contiene:
- **Creación de la base de datos** con configuración UTF-8
- **10 tablas principales** con relaciones apropiadas
- **Índices optimizados** para búsquedas frecuentes
- **Datos de ejemplo** basados en el contenido del sitio web
- **Vistas útiles** para consultas complejas
- **Procedimientos almacenados** para tareas comunes
- **Triggers** para automatizar algunas operaciones

### 2. `consultas_urukais_klick.sql`
Archivo con consultas útiles que incluye:
- **23+ consultas SQL** para diferentes propósitos
- Consultas de análisis y estadísticas
- Búsquedas específicas
- Consultas de gestión y mantenimiento
- Procedimientos para reportes automatizados

## 🗃️ Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción | Registros Iniciales |
|-------|-------------|-------------------|
| **urukais** | Información de las criaturas principales | 1 |
| **caracteristicas** | Características específicas de los Urukais | 9 |
| **ubicaciones** | Información geográfica del ecosistema | 4 |
| **proyectos** | Aplicaciones y proyectos web | 5 |
| **videos** | Contenido multimedia | 3 |
| **galeria** | Imágenes y contenido de galería | 4 |
| **estadisticas** | Datos científicos y métricas | 6 |
| **usuarios** | Sistema de usuarios | 1 |
| **contacto** | Mensajes de contacto | 0 |
| **noticias** | Sistema de noticias/blog | 0 |
| **configuracion** | Configuraciones del sistema | 6 |

### Relaciones Principales

```
urukais (1) ──→ (N) caracteristicas
urukais (1) ──→ (N) estadisticas
ubicaciones (1) ──→ (N) estadisticas
usuarios (1) ──→ (N) noticias
```

## 🚀 Instalación

### Requisitos Previos
- MySQL 8.0 o superior
- Privilegios de administrador en MySQL
- Conocimientos básicos de SQL

### Pasos de Instalación

1. **Conectar a MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Ejecutar el script principal**
   ```bash
   mysql -u root -p < base_datos_urukais_klick.sql
   ```

3. **Verificar la instalación**
   ```sql
   USE urukais_klick_db;
   SHOW TABLES;
   ```

## 📊 Datos Principales

### Información de Urukais
- **Nombre**: Urukais Klick
- **Nombre Científico**: Klickianus alpinus
- **Población Estimada**: 3,847 individuos
- **Frecuencia Sonido**: 847 Hz
- **Número Sagrado**: 847
- **Precisión**: 97.3%

### Ubicaciones Clave
1. **Valle de Alforja** (Principal)
   - Coordenadas: 41.1874°N, 1.0047°E
   - Altitud: 450m
   - 15 manantiales activos

2. **Serra de Prades** (Montaña Norte)
   - Coordenadas: 41.2345°N, 0.9876°E
   - Altitud: 1,201m

3. **Puigcerver** (Pico Principal)
   - Coordenadas: 41.2101°N, 1.0123°E
   - Altitud: 1,196m

4. **Cueva de l'Ermità** (Lugar Sagrado)
   - Profundidad máxima: 847m
   - Evento centenal: "Klick Majestuoso"

## 🔍 Consultas Principales

### Obtener todas las características
```sql
SELECT c.titulo, c.descripcion, c.categoria, c.icono
FROM caracteristicas c
JOIN urukais u ON c.urukais_id = u.id
WHERE c.activo = TRUE;
```

### Estadísticas por ubicación
```sql
SELECT 
    ub.nombre as ubicacion,
    COUNT(e.id) as total_metricas,
    AVG(e.precision_porcentaje) as precision_promedio
FROM ubicaciones ub
LEFT JOIN estadisticas e ON ub.id = e.ubicacion_id
GROUP BY ub.nombre;
```

### Proyectos activos
```sql
SELECT nombre, categoria, url, fecha_lanzamiento
FROM proyectos 
WHERE activo = TRUE AND estado = 'activo'
ORDER BY fecha_lanzamiento DESC;
```

## 📈 Características Avanzadas

### Vistas Incluidas
- `vista_estadisticas_completas`: Estadísticas con nombres de ubicaciones
- `vista_proyectos_activos`: Solo proyectos activos y operativos
- `vista_contenido_multimedia`: Videos y galería unificados

### Procedimientos Almacenados
- `ObtenerEstadisticasUbicacion(ubicacion_nombre)`: Estadísticas por ubicación
- `BuscarProyectosPorTecnologia(tecnologia)`: Proyectos filtrados por tecnología
- `ObtenerResumenContacto()`: Resumen de estado de mensajes

### Triggers
- **actualizar_estadisticas_contacto**: Actualiza timestamp del último contacto

## 🎯 Casos de Uso

### 1. Sistema de Gestión de Contenido
```sql
-- Agregar nueva característica
INSERT INTO caracteristicas (urukais_id, titulo, descripcion, categoria)
VALUES (1, 'Nueva Característica', 'Descripción aquí', 'biologia');
```

### 2. Analytics y Reportes
```sql
-- Generar reporte mensual
CALL ReporteMensual();
```

### 3. Búsqueda de Contenido
```sql
-- Buscar por palabra clave
SELECT * FROM caracteristicas 
WHERE titulo LIKE '%mineral%' OR descripcion LIKE '%mineral%';
```

## 🔧 Mantenimiento

### Backup Regular
```bash
# Crear backup completo
mysqldump -u root -p urukais_klick_db > backup_urukais_klick_$(date +%Y%m%d).sql
```

### Limpieza de Datos Antiguos
```sql
-- Ejecutar procedimiento de limpieza
CALL LimpiarDatosAntiguos();
```

### Optimización
```sql
-- Analizar y optimizar tablas
ANALYZE TABLE urukais, caracteristicas, estadisticas;
OPTIMIZE TABLE urukais, caracteristicas, estadisticas;
```

## 📱 Integración con el Sitio Web

### Conexión PHP Ejemplo
```php
<?php
$host = 'localhost';
$dbname = 'urukais_klick_db';
$username = 'your_username';
$password = 'your_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
                   $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
```

### Consulta API Ejemplo
```php
// Obtener todas las características
$stmt = $pdo->query("SELECT * FROM caracteristicas WHERE activo = TRUE");
$caracteristicas = $stmt->fetchAll(PDO::FETCH_ASSOC);
```

## 🔒 Seguridad

### Recomendaciones
1. **Usar usuarios específicos** con permisos limitados
2. **Cambiar contraseñas** regularmente
3. **Habilitar SSL** para conexiones remotas
4. **Hacer backups** regulares
5. **Monitorear logs** de acceso

### Usuario de Solo Lectura
```sql
CREATE USER 'urukais_read'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT ON urukais_klick_db.* TO 'urukais_read'@'localhost';
FLUSH PRIVILEGES;
```

## 🆘 Solución de Problemas

### Error de Encoding
```sql
-- Verificar configuración de charset
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

### Verificar Integridad
```sql
-- Ejecutar consulta de integridad
SELECT * FROM urukais u
LEFT JOIN caracteristicas c ON u.id = c.urukais_id
WHERE u.activo = TRUE AND c.id IS NULL;
```

### Logs de MySQL
```bash
# Verificar logs de errores
tail -f /var/log/mysql/error.log
```

## 📞 Soporte

Para preguntas o problemas relacionados con la base de datos:

1. **Revisa este README** para soluciones comunes
2. **Consulta las consultas** en `consultas_urukais_klick.sql`
3. **Verifica los logs** de MySQL
4. **Ejecuta las consultas de mantenimiento** incluidas

## 📋 Changelog

### Versión 1.0 (2025-11-16)
- ✅ Creación de estructura completa de base de datos
- ✅ Inserción de datos de ejemplo
- ✅ Creación de índices optimizados
- ✅ Implementación de vistas y procedimientos
- ✅ Documentación completa con consultas útiles

## 👨‍💻 Autor

**MiniMax Agent**  
Basado en el sitio web creado por **Manuel Casimiro Carrasco**

---

**🐸 ¡Que los Klicks guíen tu camino en el ecosistema de Alforja! ⚡**