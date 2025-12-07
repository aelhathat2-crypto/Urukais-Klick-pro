// ============================================================================
// Sistema de Automatización Web Pro - Application Logic
// ============================================================================

// Estado Global de la Aplicación
const AppState = {
  tasks: [],
  proxies: [
    {
      id: 1,
      url: 'http://proxy1.example.com:8080',
      status: 'active',
      latency: 45,
      successRate: 98.5,
      username: '',
      password: ''
    },
    {
      id: 2,
      url: 'http://proxy2.example.com:8080',
      status: 'inactive',
      latency: 0,
      successRate: 0,
      username: '',
      password: ''
    }
  ],
  logs: [],
  stats: {
    totalTasksRun: 0,
    successRate: 0,
    avgResponseTime: 0,
    totalDataProcessed: 0
  },
  systemStatus: {
    activeConnections: 0,
    browserPoolStatus: 'ready',
    systemUptime: 0,
    memoryUsage: 45
  },
  settings: {
    rateLimit: 2,
    delayMin: 500,
    delayMax: 2000,
    backoffStrategy: 'exponential',
    backoffMultiplier: 2,
    logLevel: 'info',
    headerRandomization: true,
    mouseSimulation: true,
    canvasFingerprint: true,
    robotsTxt: true,
    verboseLogging: false
  },
  session: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    timezone: 'Europe/Madrid',
    language: 'es-ES',
    screenResolution: '1920x1080',
    cookies: [],
    persistSession: true
  },
  rotationStrategy: 'round-robin'
};

let taskIdCounter = 1;
let proxyIdCounter = 3;
let logIdCounter = 1;

// ============================================================================
// Utility Functions
// ============================================================================

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDelay() {
  return getRandomInt(AppState.settings.delayMin, AppState.settings.delayMax);
}

// ============================================================================
// Toast Notifications
// ============================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============================================================================
// Logging System
// ============================================================================

function addLog(level, message, taskId = null) {
  const log = {
    id: logIdCounter++,
    timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false }),
    level: level,
    message: message,
    taskId: taskId
  };
  
  AppState.logs.unshift(log);
  
  // Limitar logs a 1000 entradas
  if (AppState.logs.length > 1000) {
    AppState.logs = AppState.logs.slice(0, 1000);
  }
  
  updateLogsViewer();
}

function updateLogsViewer() {
  const viewer = document.getElementById('logsViewer');
  const filter = document.getElementById('logFilter').value;
  const search = document.getElementById('logSearch').value.toLowerCase();
  
  let filteredLogs = AppState.logs;
  
  if (filter !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.level === filter);
  }
  
  if (search) {
    filteredLogs = filteredLogs.filter(log => 
      log.message.toLowerCase().includes(search)
    );
  }
  
  if (filteredLogs.length === 0) {
    viewer.innerHTML = '<div class="empty-state">No hay logs para mostrar</div>';
    return;
  }
  
  viewer.innerHTML = filteredLogs.map(log => `
    <div class="log-entry">
      <span class="log-timestamp">${log.timestamp}</span>
      <span class="log-level ${log.level}">${log.level}</span>
      <span class="log-message">${log.message}</span>
    </div>
  `).join('');
  
  // Auto-scroll to top for new logs
  viewer.scrollTop = 0;
}

// ============================================================================
// Stats Update
// ============================================================================

function updateStats() {
  document.getElementById('totalTasks').textContent = AppState.stats.totalTasksRun;
  document.getElementById('successRate').textContent = `${AppState.stats.successRate.toFixed(1)}%`;
  document.getElementById('avgResponseTime').textContent = `${AppState.stats.avgResponseTime}ms`;
  document.getElementById('totalData').textContent = formatBytes(AppState.stats.totalDataProcessed);
  
  // System status
  document.getElementById('activeConnections').textContent = AppState.systemStatus.activeConnections;
  document.getElementById('browserStatus').textContent = AppState.systemStatus.browserPoolStatus;
  document.getElementById('memoryUsage').textContent = `${AppState.systemStatus.memoryUsage}%`;
  
  const activeProxiesCount = AppState.proxies.filter(p => p.status === 'active').length;
  document.getElementById('activeProxies').textContent = activeProxiesCount;
}

// ============================================================================
// Tasks Management
// ============================================================================

function createTask(taskData) {
  const task = {
    id: generateId('task'),
    name: taskData.name,
    url: taskData.url,
    type: taskData.type,
    schedule: taskData.schedule,
    maxRetries: parseInt(taskData.retries),
    timeout: parseInt(taskData.timeout),
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    attempts: 0,
    logs: []
  };
  
  AppState.tasks.push(task);
  updateTasksList();
  updateActiveTasks();
  addLog('info', `Tarea creada: ${task.name}`, task.id);
  showToast(`Tarea "${task.name}" creada exitosamente`, 'success');
  
  return task;
}

function startTask(taskId) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  task.status = 'running';
  task.startedAt = new Date().toISOString();
  task.progress = 0;
  
  AppState.systemStatus.activeConnections++;
  
  updateTasksList();
  updateActiveTasks();
  updateStats();
  
  addLog('info', `Tarea iniciada: ${task.name}`, taskId);
  showToast(`Tarea "${task.name}" iniciada`, 'info');
  
  // Simular ejecución de tarea
  simulateTaskExecution(task);
}

function stopTask(taskId) {
  const task = AppState.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  task.status = 'stopped';
  task.completedAt = new Date().toISOString();
  
  AppState.systemStatus.activeConnections = Math.max(0, AppState.systemStatus.activeConnections - 1);
  
  updateTasksList();
  updateActiveTasks();
  updateStats();
  
  addLog('warning', `Tarea detenida: ${task.name}`, taskId);
  showToast(`Tarea "${task.name}" detenida`, 'warning');
}

function deleteTask(taskId) {
  const taskIndex = AppState.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;
  
  const task = AppState.tasks[taskIndex];
  
  if (task.status === 'running') {
    stopTask(taskId);
  }
  
  AppState.tasks.splice(taskIndex, 1);
  updateTasksList();
  updateActiveTasks();
  
  addLog('info', `Tarea eliminada: ${task.name}`);
  showToast(`Tarea "${task.name}" eliminada`, 'info');
}

function simulateTaskExecution(task) {
  const steps = 20;
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (task.status !== 'running') {
      clearInterval(interval);
      return;
    }
    
    currentStep++;
    task.progress = (currentStep / steps) * 100;
    
    // Generar logs simulados
    if (currentStep % 5 === 0) {
      const logMessages = [
        'Navegando a URL objetivo...',
        'Esperando carga de página...',
        'Ejecutando script de extracción...',
        'Procesando datos...',
        'Almacenando resultados...'
      ];
      addLog('info', logMessages[Math.floor(currentStep / 5) - 1], task.id);
    }
    
    updateTasksList();
    updateActiveTasks();
    
    if (currentStep >= steps) {
      clearInterval(interval);
      completeTask(task);
    }
  }, getRandomDelay());
}

function completeTask(task) {
  const success = Math.random() > 0.2; // 80% tasa de éxito
  
  task.status = success ? 'completed' : 'failed';
  task.progress = 100;
  task.completedAt = new Date().toISOString();
  
  AppState.systemStatus.activeConnections = Math.max(0, AppState.systemStatus.activeConnections - 1);
  
  // Actualizar estadísticas
  AppState.stats.totalTasksRun++;
  if (success) {
    const dataSize = getRandomInt(10000, 500000);
    AppState.stats.totalDataProcessed += dataSize;
  }
  
  const completedTasks = AppState.tasks.filter(t => t.status === 'completed' || t.status === 'failed');
  const successfulTasks = AppState.tasks.filter(t => t.status === 'completed');
  AppState.stats.successRate = completedTasks.length > 0 
    ? (successfulTasks.length / completedTasks.length) * 100 
    : 0;
  
  AppState.stats.avgResponseTime = getRandomInt(200, 3000);
  
  updateTasksList();
  updateActiveTasks();
  updateStats();
  
  if (success) {
    addLog('success', `Tarea completada exitosamente: ${task.name}`, task.id);
    showToast(`Tarea "${task.name}" completada`, 'success');
  } else {
    addLog('error', `Tarea fallida: ${task.name}`, task.id);
    showToast(`Tarea "${task.name}" falló`, 'error');
  }
}

function updateTasksList() {
  const list = document.getElementById('tasksList');
  
  if (AppState.tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">No hay tareas configuradas</div>';
    return;
  }
  
  list.innerHTML = AppState.tasks.map(task => `
    <div class="task-card">
      <div class="task-header">
        <div>
          <div class="task-title">${task.name}</div>
          <div class="task-url">${task.url}</div>
        </div>
        <div class="task-actions">
          ${task.status === 'running' 
            ? `<button class="btn-icon" onclick="stopTask('${task.id}')" title="Detener">⏸️</button>`
            : task.status === 'pending' || task.status === 'stopped'
            ? `<button class="btn-icon" onclick="startTask('${task.id}')" title="Iniciar">▶️</button>`
            : ''}
          <button class="btn-icon" onclick="deleteTask('${task.id}')" title="Eliminar">🗑️</button>
        </div>
      </div>
      <div class="task-details">
        <span>Tipo: ${task.type}</span>
        <span>Programación: ${task.schedule}</span>
        <span>Reintentos: ${task.maxRetries}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="status-badge ${task.status}">${task.status}</span>
        ${task.status === 'running' ? `<span style="color: var(--text-secondary); font-size: 12px;">${task.progress.toFixed(0)}%</span>` : ''}
      </div>
      ${task.status === 'running' ? `
        <div class="task-progress">
          <div class="task-progress-bar" style="width: ${task.progress}%"></div>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function updateActiveTasks() {
  const container = document.getElementById('activeTasks');
  const activeTasks = AppState.tasks.filter(t => t.status === 'running');
  
  if (activeTasks.length === 0) {
    container.innerHTML = '<div class="empty-state">No hay tareas activas</div>';
    return;
  }
  
  container.innerHTML = activeTasks.map(task => `
    <div class="task-item">
      <div style="flex: 1;">
        <div class="task-info">
          <h4>${task.name}</h4>
          <div class="task-meta">${task.type} • ${task.url}</div>
        </div>
        <div class="task-progress">
          <div class="task-progress-bar" style="width: ${task.progress}%"></div>
        </div>
      </div>
      <span class="status-badge success">${task.progress.toFixed(0)}%</span>
    </div>
  `).join('');
}

// ============================================================================
// Proxy Management
// ============================================================================

function addProxy(proxyData) {
  const proxy = {
    id: proxyIdCounter++,
    url: proxyData.url,
    username: proxyData.username || '',
    password: proxyData.password || '',
    status: 'pending',
    latency: 0,
    successRate: 0
  };
  
  AppState.proxies.push(proxy);
  updateProxiesList();
  addLog('info', `Proxy agregado: ${proxy.url}`);
  showToast('Proxy agregado exitosamente', 'success');
  
  // Simular test de proxy
  setTimeout(() => testProxy(proxy.id), 1000);
}

function testProxy(proxyId) {
  const proxy = AppState.proxies.find(p => p.id === proxyId);
  if (!proxy) return;
  
  proxy.status = 'testing';
  updateProxiesList();
  addLog('info', `Probando proxy: ${proxy.url}`);
  
  setTimeout(() => {
    const success = Math.random() > 0.3; // 70% de éxito
    
    if (success) {
      proxy.status = 'active';
      proxy.latency = getRandomInt(20, 200);
      proxy.successRate = parseFloat((85 + Math.random() * 13).toFixed(1));
      addLog('success', `Proxy activo: ${proxy.url} (${proxy.latency}ms)`);
      showToast(`Proxy ${proxy.url} está activo`, 'success');
    } else {
      proxy.status = 'failed';
      proxy.latency = 0;
      proxy.successRate = 0;
      addLog('error', `Proxy falló: ${proxy.url}`);
      showToast(`Proxy ${proxy.url} falló la prueba`, 'error');
    }
    
    updateProxiesList();
    updateStats();
  }, getRandomInt(1000, 3000));
}

function removeProxy(proxyId) {
  const proxyIndex = AppState.proxies.findIndex(p => p.id === proxyId);
  if (proxyIndex === -1) return;
  
  const proxy = AppState.proxies[proxyIndex];
  AppState.proxies.splice(proxyIndex, 1);
  
  updateProxiesList();
  updateStats();
  addLog('info', `Proxy eliminado: ${proxy.url}`);
  showToast('Proxy eliminado', 'info');
}

function updateProxiesList() {
  const list = document.getElementById('proxiesList');
  
  if (AppState.proxies.length === 0) {
    list.innerHTML = '<div class="empty-state">No hay proxies configurados</div>';
    return;
  }
  
  list.innerHTML = AppState.proxies.map(proxy => `
    <div class="proxy-card">
      <div class="proxy-header">
        <div class="proxy-url">${proxy.url}</div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-icon" onclick="testProxy(${proxy.id})" title="Probar">🔄</button>
          <button class="btn-icon" onclick="removeProxy(${proxy.id})" title="Eliminar">🗑️</button>
        </div>
      </div>
      <div style="margin-top: 8px;">
        <span class="status-badge ${proxy.status === 'active' ? 'success' : proxy.status === 'failed' ? 'error' : proxy.status === 'testing' ? 'warning' : 'pending'}">
          ${proxy.status}
        </span>
      </div>
      <div class="proxy-stats">
        <div class="proxy-stat">Latencia: <strong>${proxy.latency}ms</strong></div>
        <div class="proxy-stat">Tasa éxito: <strong>${proxy.successRate}%</strong></div>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// Session Management
// ============================================================================

function updateUserAgent() {
  const preset = document.getElementById('uaPreset').value;
  const userAgentField = document.getElementById('userAgent');
  
  const userAgents = {
    chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    custom: userAgentField.value
  };
  
  if (preset !== 'custom') {
    userAgentField.value = userAgents[preset];
    AppState.session.userAgent = userAgents[preset];
  }
}

function exportSession() {
  const session = {
    ...AppState.session,
    settings: AppState.settings,
    exportedAt: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(session, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `session-${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showToast('Sesión exportada exitosamente', 'success');
  addLog('info', 'Sesión exportada');
}

function importSession() {
  showToast('Funcionalidad de importación disponible', 'info');
  addLog('info', 'Importar sesión solicitado');
}

// ============================================================================
// Settings Management
// ============================================================================

function updateBackoffPreview() {
  const strategy = document.getElementById('backoffStrategy').value;
  const multiplier = parseFloat(document.getElementById('backoffMultiplier').value);
  const preview = document.getElementById('backoffPreview');
  
  let delays = [];
  for (let i = 0; i < 5; i++) {
    let delay;
    if (strategy === 'exponential') {
      delay = Math.pow(multiplier, i) * 1000;
    } else if (strategy === 'linear') {
      delay = (i + 1) * multiplier * 1000;
    } else {
      delay = multiplier * 1000;
    }
    delays.push(delay);
  }
  
  preview.innerHTML = `
    <div style="margin-bottom: 8px; color: var(--text-secondary);">Retrasos de reintento:</div>
    ${delays.map((d, i) => `Intento ${i + 1}: ${d.toFixed(0)}ms`).join('<br>')}
  `;
}

// ============================================================================
// Navigation
// ============================================================================

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;
      
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      
      item.classList.add('active');
      document.getElementById(sectionId).classList.add('active');
    });
  });
}

// ============================================================================
// Event Listeners Setup
// ============================================================================

function setupEventListeners() {
  // Task Form
  document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('taskName').value,
      url: document.getElementById('taskUrl').value,
      type: document.getElementById('taskType').value,
      schedule: document.getElementById('taskSchedule').value,
      retries: document.getElementById('taskRetries').value,
      timeout: document.getElementById('taskTimeout').value
    };
    createTask(formData);
    e.target.reset();
  });
  
  // Proxy Form
  document.getElementById('proxyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const proxyData = {
      url: document.getElementById('proxyUrl').value,
      username: document.getElementById('proxyUsername').value,
      password: document.getElementById('proxyPassword').value
    };
    AppState.rotationStrategy = document.getElementById('rotationStrategy').value;
    addProxy(proxyData);
    e.target.reset();
  });
  
  // User Agent Preset
  document.getElementById('uaPreset').addEventListener('change', updateUserAgent);
  
  // Session Management
  document.getElementById('exportSession').addEventListener('click', exportSession);
  document.getElementById('importSession').addEventListener('click', importSession);
  
  // Settings
  document.getElementById('backoffStrategy').addEventListener('change', updateBackoffPreview);
  document.getElementById('backoffMultiplier').addEventListener('input', updateBackoffPreview);
  
  // Logs
  document.getElementById('logFilter').addEventListener('change', updateLogsViewer);
  document.getElementById('logSearch').addEventListener('input', updateLogsViewer);
  document.getElementById('clearLogsBtn').addEventListener('click', () => {
    AppState.logs = [];
    updateLogsViewer();
    showToast('Logs limpiados', 'info');
  });
  document.getElementById('exportLogsBtn').addEventListener('click', () => {
    const dataStr = JSON.stringify(AppState.logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `logs-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast('Logs exportados', 'success');
  });
}

// ============================================================================
// System Uptime Counter
// ============================================================================

function startUptimeCounter() {
  setInterval(() => {
    AppState.systemStatus.systemUptime++;
    document.getElementById('uptimeDisplay').textContent = 
      `Uptime: ${formatTime(AppState.systemStatus.systemUptime * 1000)}`;
  }, 1000);
}

// ============================================================================
// Real-time Log Generator (Simulación)
// ============================================================================

function startLogGenerator() {
  setInterval(() => {
    const runningTasks = AppState.tasks.filter(t => t.status === 'running');
    if (runningTasks.length > 0 && Math.random() > 0.7) {
      const task = runningTasks[Math.floor(Math.random() * runningTasks.length)];
      const messages = [
        'Esperando respuesta del servidor...',
        'Analizando estructura HTML...',
        'Ejecutando selector CSS...',
        'Validando datos extraídos...',
        'Aplicando transformación de datos...'
      ];
      addLog('info', messages[Math.floor(Math.random() * messages.length)], task.id);
    }
  }, 3000);
}

// ============================================================================
// Initialization
// ============================================================================

function init() {
  console.log('🚀 Iniciando Sistema de Automatización Web Pro');
  
  setupNavigation();
  setupEventListeners();
  
  // Inicializar vistas
  updateStats();
  updateTasksList();
  updateActiveTasks();
  updateProxiesList();
  updateLogsViewer();
  updateBackoffPreview();
  
  // Configurar User Agent inicial
  document.getElementById('userAgent').value = AppState.session.userAgent;
  
  // Iniciar contadores
  startUptimeCounter();
  startLogGenerator();
  
  // Logs iniciales
  addLog('success', 'Sistema iniciado correctamente');
  addLog('info', 'Pool de navegadores listo');
  addLog('info', `${AppState.proxies.length} proxies cargados`);
  
  showToast('Sistema iniciado correctamente', 'success');
  
  console.log('✅ Sistema listo');
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}