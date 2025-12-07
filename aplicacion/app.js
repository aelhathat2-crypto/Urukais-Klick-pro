/**
 * ADVANCED JAVASCRIPT APPLICATION
 * Main Application State Management and Initialization
 * 
 * This file demonstrates:
 * - ES6 Module Pattern
 * - Observer Pattern for state management
 * - Event delegation
 * - Async/await patterns
 * - Memory management considerations
 */

// ============================================================================
// GLOBAL STATE MANAGEMENT
// ============================================================================

/**
 * Global Application State
 * Using an object to encapsulate all application state
 * This allows for easy state tracking and debugging
 */
const AppState = {
    // Current active module
    activeModule: 'scraping',
    
    // System status
    systemStatus: 'online',
    
    // Scraping module state
    scraping: {
        tasks: [],
        instances: [],
        logs: [],
        metrics: {
            totalRequests: 0,
            avgResponseTime: 0,
            successRate: 0,
            failedTasks: 0
        },
        isRunning: true,
        proxyCount: 5
    },
    
    // Editor module state
    editor: {
        currentLanguage: 'javascript',
        code: '',
        snippets: [], // Using array instead of localStorage due to sandboxed environment
        isExecuting: false,
        output: []
    },
    
    // Observers for state changes (Observer Pattern)
    observers: []
};

/**
 * Observer Pattern Implementation
 * Allows components to subscribe to state changes
 * This is a fundamental pattern for reactive applications
 */
const StateManager = {
    /**
     * Subscribe to state changes
     * @param {Function} callback - Function to call when state changes
     */
    subscribe(callback) {
        AppState.observers.push(callback);
    },
    
    /**
     * Notify all observers of state change
     * @param {string} key - The state key that changed
     * @param {any} value - The new value
     */
    notify(key, value) {
        AppState.observers.forEach(callback => {
            try {
                callback(key, value);
            } catch (error) {
                console.error('Observer error:', error);
            }
        });
    },
    
    /**
     * Update state and notify observers
     * @param {string} key - Dot-notation path to state property
     * @param {any} value - New value
     */
    setState(key, value) {
        // Parse dot notation to nested object
        const keys = key.split('.');
        let obj = AppState;
        
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
        
        // Notify observers
        this.notify(key, value);
    },
    
    /**
     * Get state value
     * @param {string} key - Dot-notation path to state property
     */
    getState(key) {
        const keys = key.split('.');
        let value = AppState;
        
        for (const k of keys) {
            value = value[k];
            if (value === undefined) break;
        }
        
        return value;
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Toast Notification System
 * Provides user feedback for actions
 */
const Toast = {
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: success, error, info, warning
     * @param {number} duration - Duration in ms (default 3000)
     */
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toast.innerHTML = `
            <span class="text-2xl">${icons[type]}</span>
            <div class="flex-1">
                <div class="font-semibold text-sm">${type.toUpperCase()}</div>
                <div class="text-xs text-gray-300 mt-1">${message}</div>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

/**
 * Format timestamp for display
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
function formatTime(date = new Date()) {
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Generate random ID
 * @returns {string} Random ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 * Limits the rate at which a function can fire
 * Useful for search inputs and resize handlers
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
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

// ============================================================================
// UI MANAGEMENT
// ============================================================================

/**
 * Tab Navigation Handler
 * Demonstrates event delegation pattern
 */
function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetTab = e.target.dataset.tab;
            
            // Update active tab styling
            tabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Show/hide modules
            document.querySelectorAll('.module-content').forEach(module => {
                module.classList.add('hidden');
            });
            
            const targetModule = document.getElementById(`${targetTab}-module`);
            if (targetModule) {
                targetModule.classList.remove('hidden');
            }
            
            // Update state
            StateManager.setState('activeModule', targetTab);
            
            // Initialize Monaco Editor when switching to editor tab
            if (targetTab === 'editor' && !window.monacoInitialized) {
                initializeMonacoEditor();
            }
        });
    });
}

/**
 * Update system time in header
 * Uses setInterval for real-time updates
 */
function updateSystemTime() {
    const timeElement = document.getElementById('current-time');
    
    function update() {
        const now = new Date();
        timeElement.textContent = now.toLocaleString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    update();
    setInterval(update, 1000);
}

/**
 * Initialize Monaco Editor
 * Lazy loading pattern - only load when needed
 */
function initializeMonacoEditor() {
    if (window.monacoInitialized) return;
    
    // Load Monaco Editor from CDN
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.50.0/min/vs/loader.min.js';
    
    loaderScript.onload = () => {
        require.config({ 
            paths: { 
                'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.50.0/min/vs' 
            }
        });
        
        require(['vs/editor/editor.main'], function() {
            window.monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: getExampleCode('javascript'),
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on'
            });
            
            window.monacoInitialized = true;
            Toast.show('Editor loaded successfully', 'success');
        });
    };
    
    loaderScript.onerror = () => {
        Toast.show('Failed to load Monaco Editor', 'error');
    };
    
    document.head.appendChild(loaderScript);
}

/**
 * Get example code for language
 * @param {string} language - Programming language
 * @returns {string} Example code
 */
function getExampleCode(language) {
    const examples = {
        javascript: `// Ejemplo: Procesar array y calcular estadísticas
const números = [1, 2, 3, 4, 5];
const suma = números.reduce((a, b) => a + b, 0);
const promedio = suma / números.length;
console.log(\`Suma: \${suma}, Promedio: \${promedio}\`);`,
        python: `# Ejemplo: Fibonacci en Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = [fibonacci(i) for i in range(10)]
print(f"Secuencia Fibonacci: {result}")`,
        html: `<!DOCTYPE html>
<html>
<body>
<h1>Hola WebAssembly</h1>
<p>Este es un ejemplo HTML interactivo</p>
</body>
</html>`
    };
    
    return examples[language] || '';
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Initialize the application
 * This is the main entry point
 */
function initializeApp() {
    console.log('🚀 Initializing Advanced JavaScript Application...');
    
    // Initialize UI components
    initializeTabNavigation();
    updateSystemTime();
    
    // Initialize modules
    if (typeof initializeScrapingModule === 'function') {
        initializeScrapingModule();
    }
    
    if (typeof initializeEditorModule === 'function') {
        initializeEditorModule();
    }
    
    // Show welcome message
    setTimeout(() => {
        Toast.show('Application initialized successfully', 'success');
    }, 500);
    
    console.log('✅ Application ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for other modules
window.AppState = AppState;
window.StateManager = StateManager;
window.Toast = Toast;
window.formatTime = formatTime;
window.generateId = generateId;
window.debounce = debounce;