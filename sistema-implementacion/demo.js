// SISTEMA DE GAMIFICACIÓN URUKAIS - DEMO INTERACTIVO
// Archivo JavaScript para demostrar todas las funcionalidades del sistema

// Variables globales
let motorGamificacion = null;
let interfazGamificacion = null;
let sistemaDesafios = null;
let sistemaRutas = null;

// Inicialización del sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Inicializando Sistema de Gamificación Urukais...');
    inicializarSistema();
    configurarEventListeners();
    actualizarEstadisticasTiempoReal();
    console.log('✅ Sistema de Gamificación Urukais listo');
});

/**
 * Inicializa el sistema completo de gamificación
 */
function inicializarSistema() {
    // Configuración del motor principal
    motorGamificacion = new MotorGamificacionUrukais({
        usuarioId: 'explorador_mistico_demo',
        idioma: 'es',
        habilitarPuntos: true,
        habilitarLogros: true,
        habilitarRankings: true,
        habilitarDesafios: true,
        habilitarColeccion: true,
        habilitarRutas: true,
        mostrarNotificaciones: true,
        animaciones: true,
        onPuntosObtenidos: (evento) => {
            console.log(`⭐ +${evento.cantidad} puntos por ${evento.tipo}`);
            actualizarEstadisticasTiempoReal();
        },
        onLogroDesbloqueado: (logro) => {
            console.log(`🏆 ¡Nuevo logro desbloqueado: ${logro.nombre}!`);
        },
        onNivelSubido: (evento) => {
            console.log(`🎉 ¡Subiste al nivel ${evento.nuevoNivel}!`);
        }
    });

    // Crear interfaz de gamificación
    interfazGamificacion = new InterfazGamificacionUrukais(motorGamificacion, {
        contenedor: document.body,
        tema: 'mystico',
        posicionPanel: 'derecha',
        idioma: 'es',
        mostrarAnimaciones: true,
        compacta: false,
        autoActualizar: true
    });

    // Sistema de desafíos (opcional)
    if (typeof SistemaDesafiosUrukais !== 'undefined') {
        sistemaDesafios = new SistemaDesafiosUrukais(motorGamificacion, {
            habilitarCompetencias: true,
            habilitarEventos: true,
            eventosAutomaticos: true,
            dificultadAdaptativa: true
        });
    }

    // Sistema de rutas (opcional)
    if (typeof SistemaRutasUrukais !== 'undefined') {
        sistemaRutas = new SistemaRutasUrukais(motorGamificacion, {
            habilitarMapas: true,
            habilitarGPS: false, // Deshabilitado para demo
            habilitarNarrativa: true,
            habilitarPersonalizacion: true
        });
    }
}

/**
 * Configura los event listeners de la demo
 */
function configurarEventListeners() {
    // Botón para mostrar panel de gamificación
    const btnGamificacion = document.getElementById('btn-gamificacion');
    if (btnGamificacion) {
        btnGamificacion.addEventListener('click', () => {
            interfazGamificacion.alternarPanel();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + G para mostrar panel
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            interfazGamificacion.alternarPanel();
        }
        
        // ESC para cerrar panel
        if (e.key === 'Escape' && interfazGamificacion.estado.panelVisible) {
            interfazGamificacion.ocultarPanel();
        }
    });
}

/**
 * Funciones de demostración para avistamientos
 */
function demoAvistamiento(criatura) {
    const criaturas = {
        'fantasma': {
            nombre: 'Fantasma del Parque',
            zona: 'parque_central',
            clima: 'niebla'
        },
        'dragon': {
            nombre: 'Dragón de la Montaña',
            zona: 'montana_cercana',
            clima: 'soleado'
        },
        'vampiro': {
            nombre: 'Vampiro Nocturno',
            zona: 'cementerio_local',
            clima: 'noche'
        }
    };

    const infoCriatura = criaturas[criatura];
    if (!infoCriatura) return;

    // Registrar avistamiento en el motor
    motorGamificacion.registrarEvento('avistamiento', {
        criatura: criatura,
        nombreCriatura: infoCriatura.nombre,
        zona: infoCriatura.zona,
        clima: infoCriatura.clima,
        calidad: ['baja', 'buena', 'alta', 'excelente'][Math.floor(Math.random() * 4)],
        primeraVez: Math.random() > 0.7
    });

    // Agregar tarjeta a la colección
    motorGamificacion.agregarTarjetaColeccion('criaturas', criatura, {
        nombre: infoCriatura.nombre,
        calidad: 'común',
        fecha: new Date()
    });

    // Feedback visual
    mostrarFeedback(`👻 Avistamiento registrado: ${infoCriatura.nombre}`);
    
    // Simular progreso de desafío si existe
    if (sistemaDesafios && motorGamificacion.desafios.activos.length > 0) {
        const desafioAvistamiento = motorGamificacion.desafios.activos.find(d => d.categoria === 'avistamiento');
        if (desafioAvistamiento) {
            sistemaDesafios.registrarActividadDesafio(desafioAvistamiento.id, {
                tipo: 'avistamiento',
                criatura: criatura,
                zona: infoCriatura.zona,
                clima: infoCriatura.clima
            });
        }
    }
}

/**
 * Función de demostración para fotografía
 */
function demoFotografia() {
    const criaturas = ['fantasma', 'dragon', 'vampiro', 'hombre_lobo', 'bruja'];
    const criaturaAleatoria = criaturas[Math.floor(Math.random() * criaturas.length)];
    const calidades = ['baja', 'buena', 'alta', 'excelente'];
    const calidadAleatoria = calidades[Math.floor(Math.random() * calidades.length)];

    // Registrar fotografía
    motorGamificacion.registrarEvento('fotografia', {
        criatura: criaturaAleatoria,
        calidad: calidadAleatoria,
        zona: 'parque_central',
        fecha: new Date()
    });

    // Agregar tarjeta de foto a la colección
    motorGamificacion.agregarTarjetaColeccion('especiales', `foto_${criaturaAleatoria}_${Date.now()}`, {
        nombre: `Fotografía de ${criaturaAleatoria}`,
        calidad: calidadAleatoria,
        tipo: 'fotografia',
        fecha: new Date()
    });

    mostrarFeedback(`📸 Fotografía tomada: ${criaturaAleatoria} (${calidadAleatoria})`);
}

/**
 * Función de demostración para exploración
 */
function demoExploracion() {
    const zonas = ['parque_central', 'bosque_encantado', 'cementerio_local', 'montana_cercana'];
    const zonaAleatoria = zonas[Math.floor(Math.random() * zonas.length)];
    const distancias = [0.5, 1.2, 2.8, 3.5, 5.1];
    const distanciaAleatoria = distancias[Math.floor(Math.random() * distancias.length)];

    // Registrar exploración
    motorGamificacion.registrarEvento('exploracion', {
        zona: zonaAleatoria,
        nombreZona: zonaAleatoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        distancia: distanciaAleatoria,
        actividades: ['avistamiento', 'fotografia'],
        tiempoZona: Math.floor(Math.random() * 60) + 15 // 15-75 minutos
    });

    // Agregar tarjeta de zona
    motorGamificacion.agregarTarjetaColeccion('zonas', zonaAleatoria, {
        nombre: zonaAleatoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        primeraVez: Math.random() > 0.6,
        fecha: new Date()
    });

    mostrarFeedback(`🗺️ Zona explorada: ${zonaAleatoria.replace('_', ' ')} (${distanciaAleatoria}km)`);
}

/**
 * Función para simular progreso rápido
 */
function simularVariasAcciones() {
    mostrarFeedback('🚀 Simulando progreso rápido...');
    
    // Simular múltiples acciones en secuencia
    const acciones = [
        () => demoAvistamiento('fantasma'),
        () => demoFotografia(),
        () => demoExploracion(),
        () => demoAvistamiento('dragon'),
        () => demoAvistamiento('vampiro'),
        () => demoFotografia()
    ];

    let indice = 0;
    const ejecutarSiguiente = () => {
        if (indice < acciones.length) {
            acciones[indice]();
            indice++;
            setTimeout(ejecutarSiguiente, 1000); // 1 segundo entre acciones
        } else {
            mostrarFeedback('✅ Progreso simulado completado');
            
            // Activar desafíos disponibles
            setTimeout(() => {
                activarDesafiosDisponibles();
            }, 2000);
        }
    };

    ejecutarSiguiente();
}

/**
 * Activa desafíos disponibles
 */
function activarDesafiosDisponibles() {
    if (!sistemaDesafios) return;

    const desafiosDisponibles = sistemaDesafios.obtenerDesafiosDisponibles();
    if (desafiosDisponibles.length > 0) {
        const desafio = desafiosDisponibles[0];
        sistemaDesafios.activarDesafioPublico(desafio.id);
        mostrarFeedback(`🎯 Desafío activado: ${desafio.nombre}`);
    }
}

/**
 * Resetea todos los datos del sistema
 */
function resetearDatos() {
    if (confirm('¿Estás seguro de que quieres resetear todos los datos de gamificación?')) {
        motorGamificacion.resetearEstadisticas();
        actualizarEstadisticasTiempoReal();
        mostrarFeedback('🔄 Datos reseteados correctamente');
        console.log('🔄 Todos los datos de gamificación han sido reseteados');
    }
}

/**
 * Actualiza las estadísticas en tiempo real en la página
 */
function actualizarEstadisticasTiempoReal() {
    const estado = motorGamificacion.obtenerEstadoUsuario();
    const statsGrid = document.getElementById('stats-grid');
    
    if (!statsGrid) return;

    const estadisticas = [
        { valor: estado.perfil.nivel, etiqueta: 'Nivel', icono: '⭐' },
        { valor: estado.perfil.puntosTotales, etiqueta: 'Puntos Totales', icono: '💎' },
        { valor: estado.perfil.racha, etiqueta: 'Racha Días', icono: '🔥' },
        { valor: Object.keys(estado.logros).length, etiqueta: 'Logros', icono: '🏆' },
        { valor: estado.estadisticas.totalAvistamientos, etiqueta: 'Avistamientos', icono: '👁️' },
        { valor: estado.estadisticas.fotosTomadas, etiqueta: 'Fotografías', icono: '📸' },
        { valor: estado.estadisticas.zonasVisitadas, etiqueta: 'Zonas', icono: '🗺️' },
        { valor: estado.estadisticas.desafiosCompletados || 0, etiqueta: 'Desafíos', icono: '🎯' }
    ];

    statsGrid.innerHTML = estadisticas.map(stat => `
        <div class="stat-card">
            <div class="stat-value">${stat.valor}</div>
            <div class="stat-label">${stat.icono} ${stat.etiqueta}</div>
        </div>
    `).join('');
}

/**
 * Muestra feedback visual al usuario
 */
function mostrarFeedback(mensaje) {
    // Crear elemento de feedback
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = mensaje;
    
    // Estilos inline
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #6B46C1, #9333EA);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 90vw;
        text-align: center;
        animation: feedbackSlideIn 0.3s ease-out;
        pointer-events: none;
    `;

    // Agregar animación CSS si no existe
    if (!document.getElementById('feedback-styles')) {
        const style = document.createElement('style');
        style.id = 'feedback-styles';
        style.textContent = `
            @keyframes feedbackSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0); 
                }
            }
            @keyframes feedbackSlideOut {
                from { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0); 
                }
                to { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-20px); 
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Agregar al DOM
    document.body.appendChild(feedback);

    // Remover después de 3 segundos
    setTimeout(() => {
        feedback.style.animation = 'feedbackSlideOut 0.3s ease-in';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

/**
 * Función para exportar datos del usuario
 */
function exportarDatosUsuario() {
    const datos = motorGamificacion.exportarDatos();
    
    // Crear y descargar archivo
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urukais-gamificacion-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarFeedback('📁 Datos exportados correctamente');
}

/**
 * Función para importar datos del usuario
 */
function importarDatosUsuario() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datos = e.target.result;
                const exito = motorGamificacion.importarDatos(datos);
                
                if (exito) {
                    mostrarFeedback('📥 Datos importados correctamente');
                    actualizarEstadisticasTiempoReal();
                } else {
                    mostrarFeedback('❌ Error al importar datos');
                }
            } catch (error) {
                console.error('Error importando datos:', error);
                mostrarFeedback('❌ Archivo inválido');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * Inicializar sistema de rutas demo
 */
function inicializarRutasDemo() {
    if (!sistemaRutas) return;
    
    const rutas = sistemaRutas.obtenerRutasDisponibles();
    if (rutas.length > 0) {
        const primeraRuta = rutas[0];
        sistemaRutas.iniciarRutaPublica(primeraRuta.id);
        mostrarFeedback(`🗺️ Ruta iniciada: ${primeraRuta.nombre}`);
    }
}

/**
 * Simular progreso en ruta activa
 */
function simularProgresoRuta() {
    if (!sistemaRutas) return;
    
    const rutasActivas = Object.keys(sistemaRutas.rutasActivas);
    if (rutasActivas.length === 0) {
        mostrarFeedback('⚠️ No hay rutas activas para progresar');
        return;
    }
    
    const primeraRutaId = rutasActivas[0];
    const ruta = sistemaRutas.rutasActivas[primeraRutaId];
    
    // Simular llegada a un punto
    if (ruta.puntos.length > 0) {
        const punto = ruta.puntos[Math.floor(Math.random() * ruta.puntos.length)];
        sistemaRutas.actualizarProgresoPublico(primeraRutaId, 'llegada_punto', {
            distancia: Math.random() * 2 + 0.5,
            tiempoExploracion: Math.floor(Math.random() * 30) + 10
        });
        
        mostrarFeedback(`📍 Progreso en ruta: ${punto.nombre}`);
    }
}

/**
 * Función para mostrar información del sistema
 */
function mostrarInfoSistema() {
    const estado = motorGamificacion.obtenerEstadoUsuario();
    
    const info = `
🎮 Sistema de Gamificación Urukais Klick

📊 Estadísticas del Usuario:
• Nivel: ${estado.perfil.nivel}
• Puntos Totales: ${estado.perfil.puntosTotales}
• Racha Actual: ${estado.perfil.racha} días
• Logros Desbloqueados: ${Object.keys(estado.logros).length}

🔍 Actividad:
• Avistamientos: ${estado.estadisticas.totalAvistamientos}
• Fotografías: ${estado.estadisticas.fotosTomadas}
• Zonas Visitadas: ${estado.estadisticas.zonasVisitadas}
• Desafíos Completados: ${estado.estadisticas.desafiosCompletados || 0}

🎯 Funcionalidades Activas:
• Sistema de Puntos: ✅
• Sistema de Logros: ✅
• Sistema de Desafíos: ${sistemaDesafios ? '✅' : '❌'}
• Sistema de Rutas: ${sistemaRutas ? '✅' : '❌'}
• Interfaz Gráfica: ✅

💾 Almacenamiento: localStorage
🌐 Versión del Sistema: 1.0.0
    `;
    
    console.log(info);
    alert(info);
}

// Funciones adicionales para la demo
window.demoAvistamiento = demoAvistamiento;
window.demoFotografia = demoFotografia;
window.demoExploracion = demoExploracion;
window.simularVariasAcciones = simularVariasAcciones;
window.resetearDatos = resetearDatos;
window.mostrarInfoSistema = mostrarInfoSistema;
window.exportarDatosUsuario = exportarDatosUsuario;
window.importarDatosUsuario = importarDatosUsuario;
window.inicializarRutasDemo = inicializarRutasDemo;
window.simularProgresoRuta = simularProgresoRuta;

// Auto-actualización de estadísticas cada 10 segundos
setInterval(actualizarEstadisticasTiempoReal, 10000);

// Configurar tooltips y ayuda
document.addEventListener('DOMContentLoaded', function() {
    // Agregar tooltips a los botones de demo
    const botonesDemo = document.querySelectorAll('.btn-demo');
    botonesDemo.forEach(boton => {
        boton.title = 'Función de demostración del sistema de gamificación';
    });
    
    // Agregar información sobre shortcuts
    console.log('⌨️ Shortcuts disponibles:');
    console.log('• Ctrl/Cmd + G: Mostrar/Ocultar panel de gamificación');
    console.log('• ESC: Cerrar panel de gamificación');
    console.log('• Función mostrarInfoSistema(): Ver información completa del sistema');
});

console.log('🎮 Demo de Sistema de Gamificación Urukais cargado correctamente');
console.log('📚 Documentación completa disponible en: README_sistema_gamificacion.md');