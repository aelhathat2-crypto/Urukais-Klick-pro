/**
 * DISTRIBUTED SCRAPING MODULE
 * 
 * This module simulates a distributed web scraping system with:
 * - Task queue management
 * - Multiple browser instances
 * - Real-time logging
 * - Performance metrics
 * 
 * Educational concepts demonstrated:
 * - Web Workers for background processing
 * - Async task simulation
 * - Real-time UI updates
 * - State management
 */

// ============================================================================
// DATA STRUCTURES
// ============================================================================

/**
 * Sample data for realistic simulation
 */
const SCRAPING_DATA = {
    exampleUrls: [
        'https://example.com/products',
        'https://api.example.com/data',
        'https://shop.example.com/listings',
        'https://news.example.com/articles',
        'https://store.example.com/items',
        'https://blog.example.com/posts'
    ],
    exampleSelectors: [
        '.product-card',
        '.article-title',
        'h1.headline',
        '.item-container',
        '.post-content',
        '.data-row'
    ],
    proxyList: [
        '203.0.113.1:8080',
        '203.0.113.2:8080',
        '203.0.113.3:8080',
        '203.0.113.4:8080',
        '203.0.113.5:8080'
    ]
};

// ============================================================================
// TASK MANAGEMENT
// ============================================================================

/**
 * Task Queue Manager
 * Handles task creation, execution, and state updates
 */
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskCounter = 0;
    }
    
    /**
     * Add a new task to the queue
     * @param {Object} taskData - Task configuration
     */
    addTask(taskData) {
        const task = {
            id: generateId(),
            number: ++this.taskCounter,
            url: taskData.url,
            selector: taskData.selector,
            priority: taskData.priority,
            status: 'pending',
            progress: 0,
            createdAt: new Date(),
            startedAt: null,
            completedAt: null,
            error: null
        };
        
        this.tasks.push(task);
        StateManager.setState('scraping.tasks', this.tasks);
        
        this.renderTasks();
        this.updateMetrics();
        
        // Add log entry
        addLog('INFO', `Task #${task.number} added to queue: ${task.url}`);
        
        // Start execution if system is running
        if (AppState.scraping.isRunning) {
            this.executeTask(task);
        }
        
        return task;
    }
    
    /**
     * Execute a task (simulated)
     * Demonstrates async/await pattern and realistic timing
     */
    async executeTask(task) {
        if (task.status !== 'pending') return;
        
        // Find an available instance
        const instance = this.findAvailableInstance();
        if (!instance) {
            addLog('WARNING', `No available instances for task #${task.number}, queuing...`);
            return;
        }
        
        // Update task status
        task.status = 'running';
        task.startedAt = new Date();
        
        // Update instance status
        instance.status = 'busy';
        instance.currentUrl = task.url;
        instance.requestsCompleted++;
        
        this.renderTasks();
        renderInstances();
        
        addLog('INFO', `Task #${task.number} started on Instance ${instance.id}`);
        
        // Simulate execution time (2-8 seconds)
        const executionTime = 2000 + Math.random() * 6000;
        const steps = 20;
        const stepTime = executionTime / steps;
        
        // Animate progress
        for (let i = 1; i <= steps; i++) {
            await this.sleep(stepTime);
            task.progress = (i / steps) * 100;
            this.renderTasks();
        }
        
        // Determine success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            task.status = 'completed';
            task.completedAt = new Date();
            addLog('SUCCESS', `Task #${task.number} completed successfully (${Math.round(executionTime)}ms)`);
            Toast.show(`Task #${task.number} completed`, 'success', 2000);
        } else {
            task.status = 'failed';
            task.error = 'Connection timeout';
            addLog('ERROR', `Task #${task.number} failed: ${task.error}`);
            Toast.show(`Task #${task.number} failed`, 'error', 2000);
        }
        
        // Release instance
        instance.status = 'idle';
        instance.currentUrl = null;
        
        // Update metrics
        AppState.scraping.metrics.totalRequests++;
        AppState.scraping.metrics.avgResponseTime = 
            (AppState.scraping.metrics.avgResponseTime * (AppState.scraping.metrics.totalRequests - 1) + executionTime) / 
            AppState.scraping.metrics.totalRequests;
        
        if (!success) {
            AppState.scraping.metrics.failedTasks++;
        }
        
        this.renderTasks();
        renderInstances();
        this.updateMetrics();
        
        // Check for next pending task
        const nextTask = this.tasks.find(t => t.status === 'pending');
        if (nextTask && AppState.scraping.isRunning) {
            this.executeTask(nextTask);
        }
    }
    
    /**
     * Find an available instance
     */
    findAvailableInstance() {
        return AppState.scraping.instances.find(inst => inst.status === 'idle');
    }
    
    /**
     * Sleep utility for async delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Render task list
     */
    renderTasks() {
        const container = document.getElementById('task-list');
        
        if (this.tasks.length === 0) {
            container.innerHTML = '<div class="text-gray-500 text-sm text-center py-4">No tasks in queue</div>';
            return;
        }
        
        container.innerHTML = this.tasks.map(task => `
            <div class="task-card">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <div class="text-xs text-gray-400">Task #${task.number}</div>
                        <div class="text-sm font-semibold text-white truncate">${task.url}</div>
                        <div class="text-xs text-gray-500">${task.selector}</div>
                    </div>
                    <span class="status-badge status-${task.status}">${task.status}</span>
                </div>
                ${task.status === 'running' ? `
                    <div class="progress-bar mt-2">
                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">${Math.round(task.progress)}%</div>
                ` : ''}
                ${task.status === 'failed' ? `
                    <div class="text-xs text-red-400 mt-1">❌ ${task.error}</div>
                ` : ''}
            </div>
        `).join('');
        
        // Update totals
        document.getElementById('total-tasks').textContent = this.tasks.length;
        
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const completionRate = this.tasks.length > 0 ? (completed / this.tasks.length * 100).toFixed(1) : 0;
        document.getElementById('completion-rate').textContent = `${completionRate}%`;
    }
    
    /**
     * Update performance metrics
     */
    updateMetrics() {
        const metrics = AppState.scraping.metrics;
        
        document.getElementById('metric-requests').textContent = metrics.totalRequests;
        document.getElementById('metric-response-time').textContent = `${Math.round(metrics.avgResponseTime)}ms`;
        document.getElementById('metric-failed').textContent = metrics.failedTasks;
        
        const successRate = metrics.totalRequests > 0 ? 
            ((metrics.totalRequests - metrics.failedTasks) / metrics.totalRequests * 100).toFixed(1) : 0;
        
        document.getElementById('metric-success-rate').textContent = `${successRate}%`;
        document.getElementById('metric-success-bar').style.width = `${successRate}%`;
    }
}

// Create global task manager instance
const taskManager = new TaskManager();

// ============================================================================
// INSTANCE MANAGEMENT
// ============================================================================

/**
 * Initialize browser instances
 */
function initializeInstances() {
    const instances = [];
    
    // Create 5 simulated instances
    for (let i = 1; i <= 5; i++) {
        instances.push({
            id: i,
            status: 'idle',
            currentUrl: null,
            memoryUsage: Math.floor(50 + Math.random() * 100), // MB
            requestsCompleted: 0,
            startedAt: new Date(Date.now() - Math.random() * 3600000) // Random start time within last hour
        });
    }
    
    AppState.scraping.instances = instances;
    renderInstances();
}

/**
 * Render instance cards
 */
function renderInstances() {
    const container = document.getElementById('instances-container');
    const instances = AppState.scraping.instances;
    
    container.innerHTML = instances.map(inst => `
        <div class="instance-card ${inst.status}">
            <div class="flex justify-between items-center mb-2">
                <div class="font-bold text-neon-purple">Instance ${inst.id}</div>
                <span class="status-badge status-${inst.status === 'busy' ? 'running' : inst.status === 'idle' ? 'completed' : 'failed'}">
                    ${inst.status}
                </span>
            </div>
            ${inst.currentUrl ? `
                <div class="text-xs text-gray-400 truncate mb-1">📄 ${inst.currentUrl}</div>
            ` : '<div class="text-xs text-gray-500 mb-1">💤 Waiting for tasks...</div>'}
            <div class="flex justify-between text-xs mt-2">
                <span class="text-gray-400">Memory: ${inst.memoryUsage}MB</span>
                <span class="text-neon-blue">${inst.requestsCompleted} req</span>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// LOGGING SYSTEM
// ============================================================================

let logFilter = 'all';
const MAX_LOGS = 1000; // Prevent memory issues

/**
 * Add a log entry
 * @param {string} level - Log level (INFO, WARNING, ERROR, DEBUG, SUCCESS)
 * @param {string} message - Log message
 */
function addLog(level, message) {
    const log = {
        id: generateId(),
        timestamp: new Date(),
        level,
        message
    };
    
    AppState.scraping.logs.push(log);
    
    // Limit log size to prevent memory issues
    if (AppState.scraping.logs.length > MAX_LOGS) {
        AppState.scraping.logs.shift();
    }
    
    renderLogs();
}

/**
 * Render logs with filtering
 */
function renderLogs() {
    const container = document.getElementById('logs-container');
    const logs = AppState.scraping.logs;
    
    // Filter logs
    const filteredLogs = logFilter === 'all' ? 
        logs : logs.filter(log => log.level === logFilter);
    
    // Show only last 100 for performance (virtual scrolling would be better for production)
    const displayLogs = filteredLogs.slice(-100);
    
    container.innerHTML = displayLogs.map(log => `
        <div class="log-entry log-${log.level}">
            <span class="text-gray-600">[${formatTime(log.timestamp)}]</span>
            <span class="font-semibold">[${log.level}]</span>
            <span>${log.message}</span>
        </div>
    `).join('');
    
    // Auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // Update log count
    document.getElementById('log-count').textContent = logs.length;
}

/**
 * Initialize log filters
 */
function initializeLogFilters() {
    const filterButtons = document.querySelectorAll('.log-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            logFilter = e.target.dataset.filter;
            renderLogs();
        });
    });
    
    // Clear logs button
    document.getElementById('clear-logs').addEventListener('click', () => {
        AppState.scraping.logs = [];
        renderLogs();
        Toast.show('Logs cleared', 'info');
    });
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Initialize form handlers
 */
function initializeFormHandlers() {
    const form = document.getElementById('add-task-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const url = document.getElementById('task-url').value;
        const selector = document.getElementById('task-selector').value;
        const priority = document.getElementById('task-priority').value;
        
        // Validate inputs
        if (!url || !selector) {
            Toast.show('Please fill all fields', 'warning');
            return;
        }
        
        // Add task
        taskManager.addTask({ url, selector, priority });
        
        // Reset form
        form.reset();
        Toast.show('Task added to queue', 'success', 2000);
    });
}

/**
 * Initialize control buttons
 */
function initializeControls() {
    // Toggle instances button
    const toggleButton = document.getElementById('toggle-instances');
    
    toggleButton.addEventListener('click', () => {
        AppState.scraping.isRunning = !AppState.scraping.isRunning;
        
        if (AppState.scraping.isRunning) {
            toggleButton.innerHTML = '⏸️ Stop All';
            toggleButton.classList.remove('bg-neon-green');
            toggleButton.classList.add('bg-slate-700');
            addLog('INFO', 'System resumed - processing tasks');
            Toast.show('System resumed', 'success');
            
            // Resume pending tasks
            const pendingTask = taskManager.tasks.find(t => t.status === 'pending');
            if (pendingTask) {
                taskManager.executeTask(pendingTask);
            }
        } else {
            toggleButton.innerHTML = '▶️ Start All';
            toggleButton.classList.add('bg-neon-green');
            toggleButton.classList.remove('bg-slate-700');
            addLog('WARNING', 'System paused - tasks queued');
            Toast.show('System paused', 'warning');
        }
    });
    
    // Export results button
    document.getElementById('export-results').addEventListener('click', () => {
        const data = {
            tasks: taskManager.tasks,
            metrics: AppState.scraping.metrics,
            exportedAt: new Date().toISOString()
        };
        
        // Simulate CSV export
        const csv = `Task Number,URL,Status,Created At\n${taskManager.tasks.map(t => 
            `${t.number},${t.url},${t.status},${t.createdAt.toISOString()}`
        ).join('\n')}`;
        
        // Show export dialog (simulation)
        Toast.show(`Exported ${taskManager.tasks.length} tasks`, 'success');
        addLog('INFO', `Results exported: ${taskManager.tasks.length} tasks`);
        
        console.log('Export Data:', data);
        console.log('CSV:', csv);
    });
}

// ============================================================================
// MODULE INITIALIZATION
// ============================================================================

/**
 * Initialize the scraping module
 */
function initializeScrapingModule() {
    console.log('🕷️ Initializing Scraping Module...');
    
    // Initialize components
    initializeInstances();
    initializeFormHandlers();
    initializeLogFilters();
    initializeControls();
    
    // Add initial logs
    addLog('SUCCESS', 'Scraping system initialized');
    addLog('INFO', `${AppState.scraping.instances.length} browser instances ready`);
    addLog('INFO', `Proxy pool loaded: ${AppState.scraping.proxyCount} proxies`);
    
    // Add demo tasks after 1 second
    setTimeout(() => {
        addLog('INFO', 'System ready to accept tasks');
    }, 1000);
    
    console.log('✅ Scraping Module ready!');
}

// Export for global access
window.initializeScrapingModule = initializeScrapingModule;
window.addLog = addLog;