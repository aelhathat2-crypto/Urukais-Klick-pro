// Buscador Urukais Klick - Funcionalidad Principal
class UrukaisSearcher {
    constructor() {
        this.currentPage = 1;
        this.resultsPerPage = 12;
        this.currentResults = [];
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.showSuggestions();
    }

    bindEvents() {
        // Elementos del DOM
        this.searchInput = document.getElementById('searchInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.typeFilter = document.getElementById('typeFilter');
        this.sortFilter = document.getElementById('sortFilter');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.noResults = document.getElementById('noResults');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.suggestionsList = document.getElementById('suggestionsList');
        this.recentList = document.getElementById('recentList');
        this.pagination = document.getElementById('pagination');
        this.totalResults = document.getElementById('totalResults');
        this.searchTime = document.getElementById('searchTime');

        // Event listeners
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        this.clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        this.categoryFilter.addEventListener('change', () => {
            this.performSearch();
        });

        this.typeFilter.addEventListener('change', () => {
            this.performSearch();
        });

        this.sortFilter.addEventListener('change', () => {
            this.performSearch();
        });

        // Mostrar/ocultar botón clear
        this.searchInput.addEventListener('input', () => {
            this.toggleClearButton();
        });
    }

    handleSearchInput(value) {
        // Mostrar sugerencias si no hay búsqueda activa
        if (!value.trim()) {
            this.showSuggestions();
            return;
        }

        // Búsqueda en tiempo real con debounce
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }

    performSearch() {
        const startTime = performance.now();
        const query = this.searchInput.value;
        const category = this.categoryFilter.value;
        const type = this.typeFilter.value;

        if (query.trim()) {
            // Agregar a búsquedas recientes
            addRecentSearch(query);
            this.showRecentSearches();
        }

        // Realizar búsqueda
        this.currentResults = searchInData(query, category, type);
        
        // Ordenar resultados
        this.sortResults();

        // Calcular tiempo de búsqueda
        const endTime = performance.now();
        const searchTime = Math.round(endTime - startTime);
        this.updateSearchStats(searchTime);

        // Mostrar resultados
        this.displayResults();

        // Scroll a resultados
        this.scrollToResults();
    }

    sortResults() {
        const sortBy = this.sortFilter.value;
        
        switch (sortBy) {
            case 'alphabetical':
                this.currentResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'category':
                this.currentResults.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'relevance':
            default:
                // Ya está ordenado por relevancia en searchInData
                break;
        }
    }

    displayResults() {
        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const pageResults = this.currentResults.slice(startIndex, endIndex);

        // Limpiar grid
        this.resultsGrid.innerHTML = '';

        if (pageResults.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        // Generar tarjetas de resultados
        pageResults.forEach((result, index) => {
            const resultCard = this.createResultCard(result);
            this.resultsGrid.appendChild(resultCard);
            
            // Animación escalonada
            setTimeout(() => {
                resultCard.style.opacity = '1';
                resultCard.style.transform = 'translateY(0)';
            }, index * 50);
        });

        this.updatePagination();
        this.updateResultsCount();
    }

    createResultCard(result) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease';

        card.innerHTML = `
            <div class="result-header">
                <div class="result-icon">${result.icon}</div>
                <div class="result-info">
                    <h3>${result.title}</h3>
                    <span class="result-category">${this.formatCategory(result.category)}</span>
                </div>
            </div>
            <div class="result-content">
                <p class="result-description">${result.description}</p>
                <div class="result-tags">
                    ${result.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="result-footer">
                <a href="${result.url}" class="result-link" target="_blank" rel="noopener">
                    <i class="fas fa-external-link-alt"></i>
                    Acceder
                </a>
                <span class="relevance-score">Relevancia: ${result.relevance}%</span>
            </div>
        `;

        // Event listener para la tarjeta
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.open(result.url, '_blank', 'noopener');
            }
        });

        return card;
    }

    formatCategory(category) {
        const categoryMap = {
            'animales': 'Animaladas',
            'buscadores': 'Buscadores',
            'populares': 'Populares',
            'comidas': 'Comidas',
            'conics': 'Cómics',
            'herramientas': 'Herramientas',
            'musicas': 'Músicas',
            'tierra': 'Tierra y Más',
            'proyecto': 'Proyecto Destacado',
            'contenido': 'Contenido',
            'portales': 'Portales Sagrados'
        };
        return categoryMap[category] || category;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.currentResults.length / this.resultsPerPage);
        
        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Botón anterior
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="searcher.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                            onclick="searcher.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        // Botón siguiente
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn" onclick="searcher.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        this.pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.displayResults();
        this.scrollToResults();
    }

    scrollToResults() {
        document.querySelector('.search-results').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    updateResultsCount() {
        this.totalResults.textContent = this.currentResults.length;
    }

    updateSearchStats(searchTime) {
        this.searchTime.textContent = searchTime;
    }

    showNoResults() {
        this.resultsGrid.style.display = 'none';
        this.noResults.style.display = 'block';
        this.pagination.innerHTML = '';
        this.totalResults.textContent = '0';
    }

    hideNoResults() {
        this.resultsGrid.style.display = 'grid';
        this.noResults.style.display = 'none';
    }

    showSuggestions() {
        this.searchSuggestions.style.display = 'block';
        this.resultsGrid.style.display = 'none';
        this.noResults.style.display = 'none';
        this.pagination.innerHTML = '';

        // Generar sugerencias aleatorias
        const randomSuggestions = this.getRandomSuggestions(12);
        this.suggestionsList.innerHTML = randomSuggestions
            .map(suggestion => `
                <span class="suggestion-tag" onclick="searcher.searchSuggestion('${suggestion}')">
                    ${suggestion}
                </span>
            `).join('');

        this.totalResults.textContent = '0';
        this.searchTime.textContent = '0';
    }

    getRandomSuggestions(count) {
        const shuffled = [...SEARCH_SUGGESTIONS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    searchSuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.performSearch();
        this.toggleClearButton();
    }

    showRecentSearches() {
        const recent = getRecentSearches();
        if (recent.length === 0) {
            this.recentList.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No hay búsquedas recientes</p>';
            return;
        }

        this.recentList.innerHTML = recent
            .map(search => `
                <div class="recent-item" onclick="searcher.searchSuggestion('${search}')">
                    <i class="fas fa-history"></i>
                    <span>${search}</span>
                    <button onclick="event.stopPropagation(); searcher.removeRecentSearch('${search}')" 
                            style="background: none; border: none; color: var(--text-muted); cursor: pointer; margin-left: auto;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
    }

    removeRecentSearch(search) {
        const recent = getRecentSearches();
        const updated = recent.filter(s => s !== search);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        this.showRecentSearches();
    }

    clearRecentSearches() {
        clearRecentSearches();
        this.showRecentSearches();
    }

    clearSearch() {
        this.searchInput.value = '';
        this.clearBtn.classList.remove('visible');
        this.currentPage = 1;
        this.showSuggestions();
        this.searchInput.focus();
    }

    toggleClearButton() {
        if (this.searchInput.value.trim()) {
            this.clearBtn.classList.add('visible');
        } else {
            this.clearBtn.classList.remove('visible');
        }
    }

    loadInitialData() {
        // Mostrar búsquedas recientes al cargar
        this.showRecentSearches();
        
        // Focus en el input de búsqueda
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    }
}

// Funciones globales para uso en HTML
function searchSuggestion(suggestion) {
    searcher.searchSuggestion(suggestion);
}

function goToPage(page) {
    searcher.goToPage(page);
}

// Inicializar el buscador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.searcher = new UrukaisSearcher();
    
    // Agregar algunos estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .pagination-ellipsis {
            color: var(--text-muted);
            padding: 0.75rem 0.5rem;
            user-select: none;
        }
        
        .result-card {
            position: relative;
            overflow: hidden;
        }
        
        .result-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 136, 0.1) 50%, transparent 70%);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
            pointer-events: none;
        }
        
        .result-card:hover::after {
            transform: translateX(100%);
        }
        
        .search-stats {
            animation: slideDown 0.5s ease-out;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .floating-animation {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🔍 Buscador Urukais Klick inicializado correctamente');
    console.log('📊 Base de datos cargada con', getAllData().length, 'elementos');
});

// Funciones de utilidad
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para exportar datos (útil para debugging)
function exportSearchData() {
    const data = {
        totalItems: getAllData().length,
        categories: Object.keys(URUKAIS_DATA),
        recentSearches: getRecentSearches(),
        suggestions: SEARCH_SUGGESTIONS
    };
    
    console.log('📊 Datos del Buscador Urukais:', data);
    return data;
}

// Función para resetear el buscador
function resetSearcher() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    if (window.searcher) {
        window.searcher.clearSearch();
        window.searcher.showRecentSearches();
    }
    console.log('🔄 Buscador reseteado');
}

// Funciones de accesibilidad
function announceSearchResults(count) {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Se encontraron ${count} resultados para tu búsqueda`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Manejo de errores
window.addEventListener('error', (e) => {
    console.error('❌ Error en el Buscador Urukais:', e.error);
});

// Detección de soporte para características modernas
const supports = {
    localStorage: typeof Storage !== 'undefined',
    webAnimations: 'animate' in document.createElement('div'),
    fetch: typeof fetch !== 'undefined'
};

console.log('🔧 Capacidades del navegador:', supports);