// Configuración adicional para el Buscador Urukais Klick
// Este archivo contiene configuraciones avanzadas y personalizaciones

const URUKAIS_SEARCH_CONFIG = {
    // Configuración de la aplicación
    app: {
        name: "Buscador Urukais Klick",
        version: "1.0.0",
        author: "MiniMax Agent",
        description: "Buscador avanzado del ecosistema digital de Alforja",
        debug: false  // Cambiar a true para modo debug
    },

    // Configuración de búsqueda
    search: {
        debounceTime: 300,          // Tiempo de debounce en ms
        minQueryLength: 2,          // Mínimo de caracteres para buscar
        maxRecentSearches: 10,      // Máximo de búsquedas recientes
        enableFuzzySearch: true,    // Búsqueda aproximada
        enableSynonyms: true        // Búsqueda con sinónimos
    },

    // Configuración de resultados
    results: {
        perPage: 12,                // Resultados por página
        maxPages: 50,               // Máximo de páginas
        showRelevance: true,        // Mostrar puntuación de relevancia
        showCategory: true,         // Mostrar categoría en resultados
        showTags: true,             // Mostrar etiquetas
        animationDelay: 50          // Delay para animaciones
    },

    // Configuración de interfaz
    ui: {
        theme: "dark",              // Tema: "dark" o "light"
        animations: true,           // Activar animaciones
        soundEffects: false,        // Efectos de sonido
        showStats: true,            // Mostrar estadísticas
        showSuggestions: true,      // Mostrar sugerencias
        showRecent: true            // Mostrar búsquedas recientes
    },

    // Configuración de filtros
    filters: {
        categories: {
            all: "Todas las categorías",
            animales: "Animaladas",
            buscadores: "Buscadores",
            populares: "Populares",
            comidas: "Comidas",
            conics: "Cómics",
            herramientas: "Herramientas",
            musicas: "Músicas",
            tierra: "Tierra y Más",
            proyecto: "Proyectos Destacados",
            contenido: "Contenido",
            portales: "Portales Sagrados"
        },
        types: {
            all: "Todo tipo",
            proyecto: "Proyectos",
            herramienta: "Herramientas",
            contenido: "Contenido",
            enlace: "Enlaces",
            biblioteca: "Bibliotecas",
            plataforma: "Plataformas",
            aplicación: "Aplicaciones",
            buscador: "Buscadores",
            api: "APIs",
            asistente: "Asistentes",
            sistema: "Sistemas"
        },
        sortOptions: {
            relevance: "Relevancia",
            alphabetical: "Alfabético",
            category: "Categoría",
            date: "Fecha"
        }
    },

    // Configuración de rendimiento
    performance: {
        enableCaching: true,        // Cache de resultados
        cacheExpiry: 300000,        // Expiración del cache (5 min)
        lazyLoading: true,          // Carga perezosa
        preloadNextPage: true,      // Precargar siguiente página
        virtualScrolling: false     // Scroll virtual (para muchos resultados)
    },

    // Configuración de analytics
    analytics: {
        enabled: true,              // Analytics habilitado
        trackSearches: true,        // Rastrear búsquedas
        trackClicks: true,          // Rastrear clics
        trackFilters: true,         // Rastrear uso de filtros
        anonymize: true,            // Anonimizar datos
        localOnly: true             // Solo local (no enviar a servidor)
    },

    // Configuración de accesibilidad
    accessibility: {
        enableAria: true,           // Labels ARIA
        enableKeyboard: true,       // Navegación por teclado
        enableScreenReader: true,   // Soporte para lectores de pantalla
        enableHighContrast: true,   // Modo alto contraste
        enableReducedMotion: true   // Respetar preferencia de movimiento
    }
};

// Configuración de sinónimos para búsqueda avanzada
const SEARCH_SYNONYMS = {
    // Términos generales
    "generador": ["create", "creator", "maker", "generator"],
    "buscador": ["search", "finder", "explorer", "browser"],
    "herramientas": ["tools", "utilities", "apps", "applications"],
    "gestión": ["management", "admin", "control", "organize"],
    "proyecto": ["project", "app", "application", "tool"],
    
    // Categorías específicas
    "animales": ["animaladas", "mascotas", "pets", "criaturas"],
    "musica": ["música", "audio", "sound", "music"],
    "clima": ["weather", "meteorología", "tiempo", "climate"],
    "juegos": ["games", "gaming", "entretenimiento", "fun"],
    "educación": ["education", "learning", "aprender", "enseñar"],
    
    // Tecnologías
    "api": ["rest", "web service", "servicio web", "endpoint"],
    "ia": ["ai", "artificial intelligence", "inteligencia artificial", "machine learning"],
    "web": ["website", "site", "página web", "webpage"],
    "móvil": ["mobile", "smartphone", "teléfono", "phone"]
};

// Términos de búsqueda populares
const POPULAR_SEARCH_TERMS = [
    "generador", "chat bot", "api", "clima", "música",
    "animales", "pokédex", "productividad", "deportes",
    "libros", "películas", "cocina", "cómics", "herramientas"
];

// Configuración de eventos personalizados
const CUSTOM_EVENTS = {
    SEARCH_PERFORMED: 'urukais:search:performed',
    SEARCH_CLEARED: 'urukais:search:cleared',
    FILTER_CHANGED: 'urukais:search:filterChanged',
    RESULT_CLICKED: 'urukais:search:resultClicked',
    SUGGESTION_CLICKED: 'urukais:search:suggestionClicked'
};

// Función para obtener configuración
function getConfig(section = null) {
    if (section && URUKAIS_SEARCH_CONFIG[section]) {
        return URUKAIS_SEARCH_CONFIG[section];
    }
    return URUKAIS_SEARCH_CONFIG;
}

// Función para actualizar configuración
function updateConfig(section, values) {
    if (URUKAIS_SEARCH_CONFIG[section]) {
        Object.assign(URUKAIS_SEARCH_CONFIG[section], values);
        return true;
    }
    return false;
}

// Sistema de eventos personalizado
class SearchEventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// Instancia global del emisor de eventos
const searchEvents = new SearchEventEmitter();

// Sistema de analytics local
class LocalAnalytics {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('urukais_analytics');
        return stored ? JSON.parse(stored) : {
            searches: [],
            clicks: [],
            filters: [],
            timestamp: Date.now()
        };
    }

    saveData() {
        localStorage.setItem('urukais_analytics', JSON.stringify(this.data));
    }

    trackSearch(query, resultsCount, filters) {
        this.data.searches.push({
            query,
            resultsCount,
            filters,
            timestamp: Date.now()
        });
        this.saveData();
        searchEvents.emit(CUSTOM_EVENTS.SEARCH_PERFORMED, { query, resultsCount, filters });
    }

    trackClick(url, title) {
        this.data.clicks.push({
            url,
            title,
            timestamp: Date.now()
        });
        this.saveData();
        searchEvents.emit(CUSTOM_EVENTS.RESULT_CLICKED, { url, title });
    }

    getTopSearches(limit = 10) {
        const counts = {};
        this.data.searches.forEach(search => {
            const query = search.query.toLowerCase();
            counts[query] = (counts[query] || 0) + 1;
        });

        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([query, count]) => ({ query, count }));
    }

    getPopularCategories(limit = 5) {
        const categoryCounts = {};
        this.data.clicks.forEach(click => {
            // Implementar lógica para determinar categoría del click
            // Esto requeriría acceso a la base de datos de resultados
        });
        return categoryCounts;
    }

    clearData() {
        this.data = {
            searches: [],
            clicks: [],
            filters: [],
            timestamp: Date.now()
        };
        this.saveData();
    }
}

// Instancia global de analytics
const localAnalytics = new LocalAnalytics();

// Función de búsqueda con sinónimos
function enhancedSearch(query, category = 'all', type = 'all') {
    const searchTerm = query.toLowerCase().trim();
    let searchWords = [searchTerm];
    
    // Expandir con sinónimos
    if (URUKAIS_SEARCH_CONFIG.search.enableSynonyms) {
        Object.entries(SEARCH_SYNONYMS).forEach(([main, synonyms]) => {
            if (searchTerm.includes(main)) {
                searchWords.push(...synonyms);
            }
        });
    }

    // Búsqueda fuzzy básica
    if (URUKAIS_SEARCH_CONFIG.search.enableFuzzySearch) {
        // Implementar búsqueda aproximada básica
        searchWords.push(...generateFuzzyTerms(searchTerm));
    }

    return searchInData(searchWords.join(' '), category, type);
}

// Generar términos fuzzy básicos
function generateFuzzyTerms(term) {
    const variations = [];
    
    // Variaciones con typos comunes
    variations.push(term.replace(/s$/, ''));  // Quitar 's' final
    variations.push(term + 's');              // Añadir 's'
    variations.push(term.replace(/a/g, 'à')); // Variaciones de acentos
    
    return variations.filter(v => v !== term);
}

// Función de precarga de páginas
function preloadNextPage() {
    if (!URUKAIS_SEARCH_CONFIG.performance.preloadNextPage) return;
    
    const nextPage = searcher.currentPage + 1;
    const totalPages = Math.ceil(searcher.currentResults.length / searcher.resultsPerPage);
    
    if (nextPage <= totalPages) {
        // Precargar datos de la siguiente página
        setTimeout(() => {
            const startIndex = (nextPage - 1) * searcher.resultsPerPage;
            const endIndex = startIndex + searcher.resultsPerPage;
            // Los datos ya están en currentResults, solo necesitamos generar el HTML
        }, 100);
    }
}

// Función de cache simple
class SimpleCache {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
    }

    set(key, value) {
        this.cache.set(key, value);
        this.timestamps.set(key, Date.now());
    }

    get(key) {
        const timestamp = this.timestamps.get(key);
        const expiry = URUKAIS_SEARCH_CONFIG.performance.cacheExpiry;
        
        if (timestamp && (Date.now() - timestamp) > expiry) {
            this.delete(key);
            return null;
        }
        
        return this.cache.get(key);
    }

    delete(key) {
        this.cache.delete(key);
        this.timestamps.delete(key);
    }

    clear() {
        this.cache.clear();
        this.timestamps.clear();
    }

    size() {
        return this.cache.size;
    }
}

// Instancia global de cache
const searchCache = new SimpleCache();

// Función para resetear toda la configuración
function resetAllConfig() {
    localStorage.removeItem('urukais_recent_searches');
    localStorage.removeItem('urukais_analytics');
    searchCache.clear();
    
    if (window.searcher) {
        window.searcher.clearSearch();
    }
    
    console.log('🔄 Toda la configuración ha sido reseteada');
}

// Función para exportar configuración
function exportConfig() {
    return {
        config: URUKAIS_SEARCH_CONFIG,
        analytics: localAnalytics.data,
        cache: Object.fromEntries(searchCache.cache),
        recentSearches: getRecentSearches()
    };
}

// Función para importar configuración
function importConfig(data) {
    if (data.config) {
        Object.assign(URUKAIS_SEARCH_CONFIG, data.config);
    }
    
    if (data.analytics) {
        localAnalytics.data = data.analytics;
        localAnalytics.saveData();
    }
    
    if (data.cache) {
        Object.entries(data.cache).forEach(([key, value]) => {
            searchCache.set(key, value);
        });
    }
    
    console.log('⚙️ Configuración importada');
}

// Funciones de utilidad para debugging
function debugSearch() {
    if (!URUKAIS_SEARCH_CONFIG.app.debug) {
        console.log('🔍 Debug mode está deshabilitado');
        return;
    }
    
    console.group('🔍 Debug del Buscador Urukais');
    console.log('📊 Configuración:', URUKAIS_SEARCH_CONFIG);
    console.log('💾 Cache actual:', searchCache.cache);
    console.log('📈 Analytics:', localAnalytics.data);
    console.log('🔍 Búsquedas recientes:', getRecentSearches());
    console.log('🗃️ Base de datos:', getAllData());
    console.groupEnd();
}

// Inicializar configuración avanzada
document.addEventListener('DOMContentLoaded', () => {
    if (URUKAIS_SEARCH_CONFIG.app.debug) {
        console.log('🔍 Modo debug activado');
        debugSearch();
    }
    
    // Escuchar eventos personalizados
    searchEvents.on(CUSTOM_EVENTS.SEARCH_PERFORMED, (data) => {
        localAnalytics.trackSearch(data.query, data.resultsCount, data.filters);
    });
    
    searchEvents.on(CUSTOM_EVENTS.RESULT_CLICKED, (data) => {
        localAnalytics.trackClick(data.url, data.title);
    });
    
    console.log('⚙️ Configuración avanzada cargada');
});

// Funciones globales para uso externo
window.UrukaisSearchConfig = {
    get: getConfig,
    update: updateConfig,
    reset: resetAllConfig,
    export: exportConfig,
    import: importConfig,
    debug: debugSearch,
    events: searchEvents,
    analytics: localAnalytics,
    cache: searchCache
};

console.log('🚀 Configuración avanzada del Buscador Urukais cargada');