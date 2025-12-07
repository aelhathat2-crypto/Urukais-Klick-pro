// =====================================================
// GENERADOR AUTOMÁTICO DE SITEMAP.XML
// =====================================================
// Este script genera dinámicamente un sitemap.xml
// basado en la estructura del sitio web

const fs = require('fs');
const path = require('path');

// Configuración
const SITE_URL = 'https://urukais-klick.netlify.app';
const OUTPUT_FILE = 'sitemap.xml';

// Prioridades por tipo de página
const PRIORITIES = {
    index: 1.0,
    main: 0.9,
    interior: 0.8,
    contenido: 0.8,
    herramientas: 0.7,
    footer: 0.6,
    sistema: 0.6,
    default: 0.5
};

// Frecuencias de actualización
const CHANGE_FREQ = {
    index: 'weekly',
    dynamic: 'weekly',
    static: 'monthly',
    legal: 'yearly'
};

// Función para obtener la prioridad según la ruta
function getPriority(filePath) {
    if (filePath === '/') return PRIORITIES.index;
    if (filePath.includes('/aplicacion/') || filePath.includes('/buscador/')) return PRIORITIES.main;
    if (filePath.includes('/interior/')) return PRIORITIES.interior;
    if (filePath.includes('/contenido/')) return PRIORITIES.contenido;
    if (filePath.includes('/herramientas/')) return PRIORITIES.herramientas;
    if (filePath.includes('/footer/')) return PRIORITIES.footer;
    if (filePath.includes('/sistema-')) return PRIORITIES.sistema;
    return PRIORITIES.default;
}

// Función para obtener la frecuencia según la ruta
function getChangeFreq(filePath) {
    if (filePath === '/') return CHANGE_FREQ.index;
    if (filePath.includes('/politica-') || filePath.includes('/cookies')) return CHANGE_FREQ.legal;
    if (filePath.includes('/aplicacion/') || filePath.includes('/buscador/')) return CHANGE_FREQ.dynamic;
    return CHANGE_FREQ.static;
}

// Función para escanear directorios y encontrar archivos HTML
function findHtmlFiles(dir, baseDir = dir) {
    let results = [];

    // Directorios a ignorar
    const ignoreDirs = ['node_modules', '.git', '.netlify', 'base de datos', '.gemini'];

    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            // Ignorar directorios específicos
            if (!ignoreDirs.includes(file)) {
                results = results.concat(findHtmlFiles(filePath, baseDir));
            }
        } else if (file.endsWith('.html')) {
            // Obtener ruta relativa
            const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
            results.push(relativePath);
        }
    });

    return results;
}

// Función para generar el sitemap XML
function generateSitemap() {
    console.log('🗺️  Generando sitemap.xml...');

    // Encontrar todos los archivos HTML
    const htmlFiles = findHtmlFiles('./');

    // Fecha actual en formato ISO
    const lastmod = new Date().toISOString().split('T')[0];

    // Comenzar el XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

`;

    // Agregar página principal primero
    xml += `    <!-- Página Principal -->
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

`;

    // Agrupar archivos por directorio
    const grouped = {};

    htmlFiles.forEach(file => {
        // Convertir index.html a /
        let url = file === 'index.html' ? '/' : '/' + file;

        // Obtener directorio padre
        const dir = path.dirname(file);
        if (!grouped[dir]) {
            grouped[dir] = [];
        }

        grouped[dir].push({
            url: url,
            priority: getPriority(url),
            changefreq: getChangeFreq(url)
        });
    });

    // Ordenar y generar URLs
    Object.keys(grouped).sort().forEach(dir => {
        if (dir !== '.') {
            const dirName = dir.charAt(0).toUpperCase() + dir.slice(1);
            xml += `    <!-- ${dirName} -->\n`;
        }

        grouped[dir].forEach(item => {
            if (item.url !== '/') { // Ya agregamos la principal
                xml += `    <url>
        <loc>${SITE_URL}${item.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority.toFixed(1)}</priority>
    </url>

`;
            }
        });
    });

    // Cerrar el XML
    xml += `</urlset>`;

    // Guardar archivo
    fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');

    console.log(`✅ Sitemap generado exitosamente: ${OUTPUT_FILE}`);
    console.log(`📊 Total de URLs: ${htmlFiles.length + 1}`);

    return xml;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    try {
        generateSitemap();
    } catch (error) {
        console.error('❌ Error al generar sitemap:', error);
        process.exit(1);
    }
}

// Exportar para uso en otros scripts
module.exports = { generateSitemap };
