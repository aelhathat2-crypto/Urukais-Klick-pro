/**
 * INTERFAZ DE USUARIO - SISTEMA DE GAMIFICACIÓN URUKAIS KLICK
 * Interface completa para mostrar puntos, logros, desafíos y elementos gamificados
 * 
 * Funcionalidades:
 * - Panel de perfil con estadísticas
 * - Sistema de logros con diseño atractivo
 * - Desafíos activos con barras de progreso
 * - Colección de tarjetas interactiva
 * - Rankings y competencias
 * - Rutas temáticas con mapas
 * - Notificaciones y animaciones
 * 
 * @author MiniMax Agent
 * @version 1.0.0
 * @date 2025-11-16
 */

class InterfazGamificacionUrukais {
    constructor(motorGamificacion, opciones = {}) {
        this.motor = motorGamificacion;
        this.opciones = {
            contenedor: opciones.contenedor || document.body,
            tema: opciones.tema || 'mystico',
            mostrarAnimaciones: opciones.mostrarAnimaciones !== false,
            posicionPanel: opciones.posicionPanel || 'derecha', // izquierda, derecha, superior, inferior
            idioma: opciones.idioma || 'es',
            compacta: opciones.compacta || false,
            autoActualizar: opciones.autoActualizar !== false
        };
        
        // Elementos DOM del panel
        this.elementos = {};
        
        // Estado de la interfaz
        this.estado = {
            panelVisible: false,
            seccionActiva: 'perfil',
            animacionesHabilitadas: true,
            actualizando: false
        };
        
        // Configurar la interfaz
        this.configurarEstilos();
        this.crearElementosDOM();
        this.configurarEventListeners();
        
        // Inicializar contenido
        this.cargarContenidoInicial();
        
        // Auto-actualización si está habilitada
        if (this.opciones.autoActualizar) {
            this.iniciarActualizacionAutomatica();
        }
        
        console.log('🎮 Interfaz de Gamificación Urukais inicializada');
    }
    
    /**
     * Configura los estilos CSS necesarios
     */
    configurarEstilos() {
        // Verificar si ya existen los estilos
        if (document.getElementById('gamificacion-ui-styles')) return;
        
        const estilos = document.createElement('style');
        estilos.id = 'gamificacion-ui-styles';
        estilos.textContent = `
            /* VARIABLES CSS PARA TEMAS */
            :root {
                --gamificacion-primario: #6B46C1;
                --gamificacion-secundario: #9333EA;
                --gamificacion-acento: #F59E0B;
                --gamificacion-exito: #10B981;
                --gamificacion-advertencia: #F59E0B;
                --gamificacion-error: #EF4444;
                --gamificacion-fondo: #1F2937;
                --gamificacion-superficie: #374151;
                --gamificacion-texto: #F9FAFB;
                --gamificacion-texto-secundario: #D1D5DB;
                --gamificacion-borde: #4B5563;
                
                /* Tamaño de fuente responsivo */
                --gamificacion-fuente-base: 14px;
                --gamificacion-fuente-pequena: 12px;
                --gamificacion-fuente-grande: 16px;
                --gamificacion-fuente-titulo: 18px;
                
                /* Espaciado */
                --gamificacion-espaciado-xs: 4px;
                --gamificacion-espaciado-sm: 8px;
                --gamificacion-espaciado-md: 12px;
                --gamificacion-espaciado-lg: 16px;
                --gamificacion-espaciado-xl: 20px;
                --gamificacion-espaciado-xxl: 24px;
            }
            
            /* TEMA MÍSTICO (por defecto) */
            .gamificacion-ui {
                position: fixed;
                z-index: 9999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: var(--gamificacion-texto);
                background: linear-gradient(145deg, var(--gamificacion-fondo), #111827);
                border-radius: 16px;
                box-shadow: 
                    0 10px 30px rgba(107, 70, 193, 0.3),
                    0 4px 15px rgba(0, 0, 0, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(107, 70, 193, 0.3);
            }
            
            /* POSICIONAMIENTO DEL PANEL */
            .gamificacion-panel-derecha {
                top: 20px;
                right: 20px;
                width: 380px;
                max-height: calc(100vh - 40px);
            }
            
            .gamificacion-panel-izquierda {
                top: 20px;
                left: 20px;
                width: 380px;
                max-height: calc(100vh - 40px);
            }
            
            .gamificacion-panel-superior {
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90vw;
                max-width: 800px;
                height: 150px;
            }
            
            .gamificacion-panel-inferior {
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90vw;
                max-width: 800px;
                height: 120px;
            }
            
            /* HEADER DEL PANEL */
            .gamificacion-header {
                background: linear-gradient(135deg, var(--gamificacion-primario), var(--gamificacion-secundario));
                padding: var(--gamificacion-espaciado-lg);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .gamificacion-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
                opacity: 0.3;
            }
            
            .gamificacion-titulo {
                margin: 0;
                font-size: var(--gamificacion-fuente-titulo);
                font-weight: 700;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                position: relative;
                z-index: 1;
            }
            
            .gamificacion-subtitulo {
                margin: var(--gamificacion-espaciado-xs) 0 0 0;
                font-size: var(--gamificacion-fuente-pequena);
                color: rgba(255, 255, 255, 0.8);
                position: relative;
                z-index: 1;
            }
            
            /* NAVEGACIÓN */
            .gamificacion-nav {
                display: flex;
                background: var(--gamificacion-superficie);
                border-bottom: 1px solid var(--gamificacion-borde);
                overflow-x: auto;
            }
            
            .gamificacion-nav-boton {
                flex: 1;
                padding: var(--gamificacion-espaciado-md) var(--gamificacion-espaciado-sm);
                background: transparent;
                border: none;
                color: var(--gamificacion-texto-secundario);
                font-size: var(--gamificacion-fuente-base);
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                min-width: 60px;
                position: relative;
            }
            
            .gamificacion-nav-boton:hover {
                color: var(--gamificacion-texto);
                background: rgba(107, 70, 193, 0.1);
            }
            
            .gamificacion-nav-boton.activo {
                color: var(--gamificacion-primario);
                background: rgba(107, 70, 193, 0.2);
            }
            
            .gamificacion-nav-boton.activo::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--gamificacion-primario), var(--gamificacion-secundario));
            }
            
            /* CONTENIDO DEL PANEL */
            .gamificacion-contenido {
                background: var(--gamificacion-fondo);
                min-height: 300px;
                max-height: calc(100vh - 300px);
                overflow-y: auto;
            }
            
            .gamificacion-seccion {
                display: none;
                padding: var(--gamificacion-espaciado-lg);
            }
            
            .gamificacion-seccion.activa {
                display: block;
            }
            
            /* PERFIL */
            .gamificacion-perfil {
                text-align: center;
            }
            
            .gamificacion-nivel {
                font-size: 2.5em;
                font-weight: 800;
                background: linear-gradient(135deg, var(--gamificacion-primario), var(--gamificacion-acento));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
            }
            
            .gamificacion-experiencia {
                margin: var(--gamificacion-espaciado-md) 0;
            }
            
            .gamificacion-barra-experiencia {
                width: 100%;
                height: 8px;
                background: var(--gamificacion-superficie);
                border-radius: 4px;
                overflow: hidden;
                margin: var(--gamificacion-espaciado-sm) 0;
            }
            
            .gamificacion-barra-experiencia-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--gamificacion-primario), var(--gamificacion-secundario));
                border-radius: 4px;
                transition: width 0.5s ease;
                position: relative;
            }
            
            .gamificacion-barra-experiencia-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .gamificacion-puntos {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: var(--gamificacion-espaciado-md);
                margin: var(--gamificacion-espaciado-lg) 0;
            }
            
            .gamificacion-punto-item {
                background: var(--gamificacion-superficie);
                padding: var(--gamificacion-espaciado-md);
                border-radius: 12px;
                border: 1px solid var(--gamificacion-borde);
                text-align: center;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .gamificacion-punto-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(107, 70, 193, 0.2);
            }
            
            .gamificacion-punto-valor {
                font-size: var(--gamificacion-fuente-grande);
                font-weight: 700;
                color: var(--gamificacion-primario);
            }
            
            .gamificacion-punto-etiqueta {
                font-size: var(--gamificacion-fuente-pequena);
                color: var(--gamificacion-texto-secundario);
                margin-top: var(--gamificacion-espaciado-xs);
            }
            
            /* LOGROS */
            .gamificacion-logros {
                display: grid;
                gap: var(--gamificacion-espaciado-md);
            }
            
            .gamificacion-logro {
                background: var(--gamificacion-superficie);
                padding: var(--gamificacion-espaciado-md);
                border-radius: 12px;
                border: 2px solid var(--gamificacion-borde);
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .gamificacion-logro.desbloqueado {
                border-color: var(--gamificacion-exito);
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
            }
            
            .gamificacion-logro.desbloqueado::before {
                content: '✓';
                position: absolute;
                top: var(--gamificacion-espaciado-sm);
                right: var(--gamificacion-espaciado-sm);
                width: 20px;
                height: 20px;
                background: var(--gamificacion-exito);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }
            
            .gamificacion-logro-nombre {
                font-weight: 600;
                margin-bottom: var(--gamificacion-espaciado-xs);
            }
            
            .gamificacion-logro-descripcion {
                font-size: var(--gamificacion-fuente-pequena);
                color: var(--gamificacion-texto-secundario);
                line-height: 1.4;
            }
            
            .gamificacion-logro-fecha {
                font-size: var(--gamificacion-fuente-pequena);
                color: var(--gamificacion-texto-secundario);
                margin-top: var(--gamificacion-espaciado-xs);
            }
            
            /* DESAFÍOS */
            .gamificacion-desafios {
                display: grid;
                gap: var(--gamificacion-espaciado-md);
            }
            
            .gamificacion-desafio {
                background: var(--gamificacion-superficie);
                padding: var(--gamificacion-espaciado-md);
                border-radius: 12px;
                border: 1px solid var(--gamificacion-borde);
            }
            
            .gamificacion-desafio-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: var(--gamificacion-espaciado-md);
            }
            
            .gamificacion-desafio-nombre {
                font-weight: 600;
                margin: 0;
            }
            
            .gamificacion-desafio-recompensa {
                background: var(--gamificacion-acento);
                color: white;
                padding: var(--gamificacion-espaciado-xs) var(--gamificacion-espaciado-sm);
                border-radius: 20px;
                font-size: var(--gamificacion-fuente-pequena);
                font-weight: 500;
            }
            
            .gamificacion-desafio-descripcion {
                color: var(--gamificacion-texto-secundario);
                font-size: var(--gamificacion-fuente-base);
                margin-bottom: var(--gamificacion-espaciado-md);
            }
            
            .gamificacion-progreso {
                margin-bottom: var(--gamificacion-espaciado-sm);
            }
            
            .gamificacion-barra-progreso {
                width: 100%;
                height: 6px;
                background: var(--gamificacion-fondo);
                border-radius: 3px;
                overflow: hidden;
                margin: var(--gamificacion-espaciado-xs) 0;
            }
            
            .gamificacion-barra-progreso-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--gamificacion-exito), var(--gamificacion-acento));
                border-radius: 3px;
                transition: width 0.3s ease;
            }
            
            .gamificacion-progreso-texto {
                font-size: var(--gamificacion-fuente-pequena);
                color: var(--gamificacion-texto-secundario);
            }
            
            .gamificacion-desafio-tiempo {
                font-size: var(--gamificacion-fuente-pequena);
                color: var(--gamificacion-advertencia);
                margin-top: var(--gamificacion-espaciado-sm);
            }
            
            /* COLECCIÓN */
            .gamificacion-coleccion {
                display: grid;
                gap: var(--gamificacion-espaciado-lg);
            }
            
            .gamificacion-categoria-coleccion {
                background: var(--gamificacion-superficie);
                padding: var(--gamificacion-espaciado-md);
                border-radius: 12px;
            }
            
            .gamificacion-titulo-categoria {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--gamificacion-espaciado-md);
            }
            
            .gamificacion-tarjetas {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: var(--gamificacion-espaciado-sm);
            }
            
            .gamificacion-tarjeta {
                aspect-ratio: 1;
                background: var(--gamificacion-fondo);
                border: 2px solid var(--gamificacion-borde);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: var(--gamificacion-fuente-pequena);
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }
            
            .gamificacion-tarjeta:hover {
                transform: scale(1.05);
                border-color: var(--gamificacion-primario);
            }
            
            .gamificacion-tarjeta.obtenida {
                border-color: var(--gamificacion-exito);
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
            }
            
            .gamificacion-tarjeta-emoji {
                font-size: 1.5em;
                margin-bottom: var(--gamificacion-espaciado-xs);
            }
            
            .gamificacion-tarjeta-cantidad {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--gamificacion-acento);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
            }
            
            .gamificacion-progreso-coleccion {
                margin-top: var(--gamificacion-espaciado-md);
                text-align: center;
            }
            
            .gamificacion-porcentaje-coleccion {
                font-size: var(--gamificacion-fuente-grande);
                font-weight: 700;
                color: var(--gamificacion-primario);
            }
            
            /* RANKINGS */
            .gamificacion-rankings {
                display: grid;
                gap: var(--gamificacion-espaciado-lg);
            }
            
            .gamificacion-ranking {
                background: var(--gamificacion-superficie);
                padding: var(--gamificacion-espaciado-md);
                border-radius: 12px;
            }
            
            .gamificacion-ranking-lista {
                list-style: none;
                padding: 0;
                margin: var(--gamificacion-espaciado-md) 0 0 0;
            }
            
            .gamificacion-ranking-item {
                display: flex;
                align-items: center;
                padding: var(--gamificacion-espaciado-sm);
                margin-bottom: var(--gamificacion-espaciado-xs);
                background: var(--gamificacion-fondo);
                border-radius: 8px;
                transition: transform 0.2s ease;
            }
            
            .gamificacion-ranking-item:hover {
                transform: translateX(4px);
            }
            
            .gamificacion-ranking-posicion {
                width: 30px;
                height: 30px;
                background: var(--gamificacion-primario);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: var(--gamificacion-espaciado-md);
            }
            
            .gamificacion-ranking-item:nth-child(1) .gamificacion-ranking-posicion {
                background: linear-gradient(135deg, #FFD700, #FFA500);
            }
            
            .gamificacion-ranking-item:nth-child(2) .gamificacion-ranking-posicion {
                background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
            }
            
            .gamificacion-ranking-item:nth-child(3) .gamificacion-ranking-posicion {
                background: linear-gradient(135deg, #CD7F32, #A0522D);
            }
            
            .gamificacion-ranking-nombre {
                flex: 1;
                font-weight: 500;
            }
            
            .gamificacion-ranking-puntos {
                color: var(--gamificacion-primario);
                font-weight: 600;
            }
            
            /* ANIMACIONES */
            .gamificacion-animacion-entrada {
                animation: gamificacionSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .gamificacion-animacion-salida {
                animation: gamificacionSlideOut 0.3s ease-in;
            }
            
            .gamificacion-animacion-pulso {
                animation: gamificacionPulse 0.6s ease-in-out;
            }
            
            .gamificacion-animacion-rebote {
                animation: gamificacionBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            @keyframes gamificacionSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateX(100%) scale(0.8); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(0) scale(1); 
                }
            }
            
            @keyframes gamificacionSlideOut {
                from { 
                    opacity: 1; 
                    transform: translateX(0) scale(1); 
                }
                to { 
                    opacity: 0; 
                    transform: translateX(100%) scale(0.8); 
                }
            }
            
            @keyframes gamificacionPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes gamificacionBounce {
                0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
                50% { transform: scale(1.05) rotate(2deg); }
                70% { transform: scale(0.9) rotate(-1deg); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            
            /* RESPONSIVE */
            @media (max-width: 768px) {
                .gamificacion-panel-derecha,
                .gamificacion-panel-izquierda {
                    width: calc(100vw - 20px);
                    max-height: calc(100vh - 20px);
                }
                
                .gamificacion-nav {
                    flex-wrap: wrap;
                }
                
                .gamificacion-nav-boton {
                    flex: 1 1 50%;
                    min-width: 50%;
                }
                
                .gamificacion-puntos {
                    grid-template-columns: 1fr;
                }
            }
            
            /* MODO COMPACTO */
            .gamificacion-compacto .gamificacion-contenido {
                max-height: 200px;
            }
            
            .gamificacion-compacto .gamificacion-seccion {
                padding: var(--gamificacion-espaciado-md);
            }
            
            /* TOOLTIPS */
            .gamificacion-tooltip {
                position: relative;
            }
            
            .gamificacion-tooltip::before {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: var(--gamificacion-espaciado-xs) var(--gamificacion-espaciado-sm);
                border-radius: 4px;
                font-size: var(--gamificacion-fuente-pequena);
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                z-index: 10000;
                margin-bottom: 5px;
            }
            
            .gamificacion-tooltip:hover::before {
                opacity: 1;
            }
            
            /* LOADING STATES */
            .gamificacion-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--gamificacion-espaciado-xl);
                color: var(--gamificacion-texto-secundario);
            }
            
            .gamificacion-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid var(--gamificacion-borde);
                border-top: 2px solid var(--gamificacion-primario);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: var(--gamificacion-espaciado-md);
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* ACCESSIBILITY */
            .gamificacion-accessible {
                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    --gamificacion-primario: #FFFFFF;
                    --gamificacion-secundario: #CCCCCC;
                    --gamificacion-fondo: #000000;
                    --gamificacion-superficie: #333333;
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }
    
    /**
     * Crea los elementos DOM necesarios
     */
    crearElementosDOM() {
        // Crear contenedor principal
        this.container = document.createElement('div');
        this.container.className = `gamificacion-ui gamificacion-panel-${this.opciones.posicionPanel}`;
        if (this.opciones.compacta) {
            this.container.classList.add('gamificacion-compacto');
        }
        
        // Crear header
        this.header = document.createElement('div');
        this.header.className = 'gamificacion-header';
        
        this.titulo = document.createElement('h2');
        this.titulo.className = 'gamificacion-titulo';
        this.titulo.textContent = '🎮 Urukais Gamificado';
        
        this.subtitulo = document.createElement('p');
        this.subtitulo.className = 'gamificacion-subtitulo';
        this.subtitulo.textContent = 'Explora • Descubre • Colecciona';
        
        this.header.appendChild(this.titulo);
        this.header.appendChild(this.subtitulo);
        
        // Crear navegación
        this.nav = document.createElement('div');
        this.nav.className = 'gamificacion-nav';
        
        // Botones de navegación
        this.botonesNav = {
            perfil: this.crearBotonNav('👤', 'Perfil'),
            logros: this.crearBotonNav('🏆', 'Logros'),
            desafios: this.crearBotonNav('🎯', 'Desafíos'),
            coleccion: this.crearBotonNav('🃏', 'Colección'),
            rutas: this.crearBotonNav('🗺️', 'Rutas'),
            rankings: this.crearBotonNav('📊', 'Rankings')
        };
        
        Object.values(this.botonesNav).forEach(boton => {
            this.nav.appendChild(boton);
        });
        
        // Crear contenido
        this.contenido = document.createElement('div');
        this.contenido.className = 'gamificacion-contenido';
        
        // Crear secciones
        this.secciones = {
            perfil: this.crearSeccionPerfil(),
            logros: this.crearSeccionLogros(),
            desafios: this.crearSeccionDesafios(),
            coleccion: this.crearSeccionColeccion(),
            rutas: this.crearSeccionRutas(),
            rankings: this.crearSeccionRankings()
        };
        
        Object.values(this.secciones).forEach(seccion => {
            this.contenido.appendChild(seccion);
        });
        
        // Ensamblar el panel
        this.container.appendChild(this.header);
        this.container.appendChild(this.nav);
        this.container.appendChild(this.contenido);
        
        // Agregar al DOM
        this.opciones.contenedor.appendChild(this.container);
        
        // Ocultar inicialmente
        this.container.style.display = 'none';
        
        console.log('🎨 Elementos DOM creados');
    }
    
    /**
     * Crea un botón de navegación
     */
    crearBotonNav(emoji, texto) {
        const boton = document.createElement('button');
        boton.className = 'gamificacion-nav-boton';
        boton.innerHTML = `${emoji}<br><span style="font-size: 10px;">${texto}</span>`;
        boton.dataset.seccion = Object.keys(this.botonesNav).find(key => this.botonesNav[key] === boton) || 
                              Object.keys(this.botonesNav)[Object.values(this.botonesNav).indexOf(boton)];
        
        return boton;
    }
    
    /**
     * Crea la sección de perfil
     */
    crearSeccionPerfil() {
        const seccion = document.createElement('div');
        seccion.className = 'gamificacion-seccion';
        seccion.dataset.seccion = 'perfil';
        
        seccion.innerHTML = `
            <div class="gamificacion-perfil">
                <h3 class="gamificacion-nivel">Nivel <span id="nivel-actual">1</span></h3>
                
                <div class="gamificacion-experiencia">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span>Experiencia</span>
                        <span id="experiencia-texto">0 / 100 XP</span>
                    </div>
                    <div class="gamificacion-barra-experiencia">
                        <div class="gamificacion-barra-experiencia-fill" id="experiencia-bar"></div>
                    </div>
                </div>
                
                <div class="gamificacion-puntos">
                    <div class="gamificacion-punto-item">
                        <div class="gamificacion-punto-valor" id="puntos-totales">0</div>
                        <div class="gamificacion-punto-etiqueta">Puntos Totales</div>
                    </div>
                    <div class="gamificacion-punto-item">
                        <div class="gamificacion-punto-valor" id="racha-actual">0</div>
                        <div class="gamificacion-punto-etiqueta">Racha Días</div>
                    </div>
                    <div class="gamificacion-punto-item">
                        <div class="gamificacion-punto-valor" id="avistamientos-hoy">0</div>
                        <div class="gamificacion-punto-etiqueta">Avistamientos Hoy</div>
                    </div>
                    <div class="gamificacion-punto-item">
                        <div class="gamificacion-punto-valor" id="logros-total">0</div>
                        <div class="gamificacion-punto-etiqueta">Logros Desbloqueados</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4 style="margin: 0 0 12px 0; color: var(--gamificacion-primario);">Estadísticas Rápidas</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; font-size: 12px;">
                        <div style="text-align: center;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--gamificacion-primario);" id="estadisticas-total-avistamientos">0</div>
                            <div style="color: var(--gamificacion-texto-secundario);">Total Avistamientos</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--gamificacion-primario);" id="estadisticas-fotos-tomadas">0</div>
                            <div style="color: var(--gamificacion-texto-secundario);">Fotos Tomadas</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--gamificacion-primario);" id="estadisticas-zonas-visitadas">0</div>
                            <div style="color: var(--gamificacion-texto-secundario);">Zonas Visitadas</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--gamificacion-primario);" id="estadisticas-desafios-completados">0</div>
                            <div style="color: var(--gamificacion-texto-secundario);">Desafíos Completados</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return seccion;
    }
    
    /**
     * Crea la sección de logros
     */
    crearSeccionLogros() {
        const seccion = document.createElement('div');
        seccion.className = 'gamificacion-seccion';
        seccion.dataset.seccion = 'logros';
        
        seccion.innerHTML = `
            <div class="gamificacion-logros" id="contenedor-logros">
                <div class="gamificacion-loading">
                    <div class="gamificacion-spinner"></div>
                    <span>Cargando logros...</span>
                </div>
            </div>
        `;
        
        return seccion;
    }
    
    /**
     * Crea la sección de desafíos
     */
    crearSeccionDesafios() {
        const seccion = document.createElement('div');
        seccion.className = 'gamificacion-seccion';
        seccion.dataset.seccion = 'desafios';
        
        seccion.innerHTML = `
            <div class="gamificacion-desafios" id="contenedor-desafios">
                <div class="gamificacion-loading">
                    <div class="gamificacion-spinner"></div>
                    <span>Cargando desafíos...</span>
                </div>
            </div>
        `;
        
        return seccion;
    }
    
    /**
     * Crea la sección de colección
     */
    crearSeccionColeccion() {
        const seccion = document.createElement('div');
        seccion.className = 'gamificacion-seccion';
        seccion.dataset.seccion = 'coleccion';
        
        seccion.innerHTML = `
            <div class="gamificacion-coleccion">
                <div class="gamificacion-categoria-coleccion">
                    <div class="gamificacion-titulo-categoria">
                        <h4 style="margin: 0;">🧝 Criaturas Místicas</h4>
                        <span class="gamificacion-progreso-texto" id="progreso-criaturas">0/0 (0%)</span>
                    </div>
                    <div class="gamificacion-tarjetas" id="tarjetas-criaturas">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando colección...</span>
                        </div>
                    </div>
                </div>
                
                <div class="gamificacion-categoria-coleccion">
                    <div class="gamificacion-titulo-categoria">
                        <h4 style="margin: 0;">🏞️ Zonas Explored</h4>
                        <span class="gamificacion-progreso-texto" id="progreso-zonas">0/0 (0%)</span>
                    </div>
                    <div class="gamificacion-tarjetas" id="tarjetas-zonas">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando colección...</span>
                        </div>
                    </div>
                </div>
                
                <div class="gamificacion-categoria-coleccion">
                    <div class="gamificacion-titulo-categoria">
                        <h4 style="margin: 0;">🏆 Logros</h4>
                        <span class="gamificacion-progreso-texto" id="progreso-logros">0/0 (0%)</span>
                    </div>
                    <div class="gamificacion-tarjetas" id="tarjetas-logros">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando colección...</span>
                        </div>
                    </div>
                </div>
                
                <div class="gamificacion-categoria-coleccion">
                    <div class="gamificacion-titulo-categoria">
                        <h4 style="margin: 0;">⭐ Especiales</h4>
                        <span class="gamificacion-progreso-texto" id="progreso-especiales">0/0 (0%)</span>
                    </div>
                    <div class="gamificacion-tarjetas" id="tarjetas-especiales">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando colección...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return seccion;
    }
    
    /**
     * Crea la sección de rutas
     */
    crearSeccionRutas() {
        const seccion = document.createElement('div');
        seccion.className = 'gamificacion-seccion';
        seccion.dataset.seccion = 'rutas';
        
        seccion.innerHTML = `
            <div id="contenedor-rutas">
                <div style="text-align: center; padding: 20px; color: var(--gamificacion-texto-secundario);">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                    <h4 style="margin: 0 0 8px 0;">Rutas Temáticas</h4>
                    <p style="margin: 0; font-size: 14px;">Explora zonas místicas en aventuras estructuradas</p>
                    <div style="margin-top: 16px;">
                        <button class="gamificacion-nav-boton" style="padding: 8px 16px; border-radius: 8px;" onclick="interfazGamificacion.mostrarModalRutas()">
                            Ver Rutas Disponibles
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return seccion;
    }
    
    /**
     * Crea la sección de rankings
     */
    crearSeccionRankings() {
        const seccion = document.createElement('div');
        seccion.className = 'gamificacion-seccion';
        seccion.dataset.seccion = 'rankings';
        
        seccion.innerHTML = `
            <div class="gamificacion-rankings">
                <div class="gamificacion-ranking">
                    <h4 style="margin: 0 0 12px 0;">🏆 Ranking Global</h4>
                    <ul class="gamificacion-ranking-lista" id="ranking-global">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando rankings...</span>
                        </div>
                    </ul>
                </div>
                
                <div class="gamificacion-ranking">
                    <h4 style="margin: 0 0 12px 0;">📅 Ranking Semanal</h4>
                    <ul class="gamificacion-ranking-lista" id="ranking-semanal">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando rankings...</span>
                        </div>
                    </ul>
                </div>
                
                <div class="gamificacion-ranking">
                    <h4 style="margin: 0 0 12px 0;">🌍 Ranking Local</h4>
                    <ul class="gamificacion-ranking-lista" id="ranking-local">
                        <div class="gamificacion-loading">
                            <div class="gamificacion-spinner"></div>
                            <span>Cargando rankings...</span>
                        </div>
                    </ul>
                </div>
            </div>
        `;
        
        return seccion;
    }
    
    /**
     * Configura los event listeners
     */
    configurarEventListeners() {
        // Botones de navegación
        Object.values(this.botonesNav).forEach(boton => {
            boton.addEventListener('click', (e) => {
                const seccion = boton.dataset.seccion || 
                              Object.keys(this.botonesNav)[Object.values(this.botonesNav).indexOf(boton)];
                this.cambiarSeccion(seccion);
            });
        });
        
        // Eventos del motor de gamificación
        this.motor.onPuntosObtenidos = (evento) => {
            this.actualizarPuntos(evento);
        };
        
        this.motor.onLogroDesbloqueado = (logro) => {
            this.mostrarNotificacionLogro(logro);
        };
        
        this.motor.onNivelSubido = (evento) => {
            this.actualizarNivel(evento);
        };
        
        // Cerrar panel con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.estado.panelVisible) {
                this.ocultarPanel();
            }
        });
        
        console.log('🔗 Event listeners configurados');
    }
    
    /**
     * Carga el contenido inicial
     */
    cargarContenidoInicial() {
        this.actualizarContenido();
        
        // Simular datos de ejemplo si no existen
        if (Object.keys(this.motor.logros).length === 0) {
            this.simularDatosEjemplo();
        }
    }
    
    /**
     * Simula datos de ejemplo para demostración
     */
    simularDatosEjemplo() {
        // Logros de ejemplo
        this.motor.desbloquearLogro('novato_100', 'Obtener 100 puntos totales');
        this.motor.desbloquearLogro('nivel_5', 'Alcanzar el nivel 5');
        this.motor.desbloquearLogro('primera_foto', 'Tomar tu primera fotografía mística');
        
        // Puntos de ejemplo
        this.motor.otorgarPuntos('avistamiento', 75);
        this.motor.otorgarPuntos('fotografia', 50);
        this.motor.otorgarPuntos('identificacion', 40);
        
        // Desafíos activos
        this.motor.activarDesafio('primer_avistamiento');
        this.motor.activarDesafio('fotografo_semanal', { objetivo: 3 });
        
        // Tarjetas de colección
        this.motor.agregarTarjetaColeccion('criaturas', 'fantasma', {
            nombre: 'Fantasma del Castillo',
            calidad: 'poco_comun'
        });
        this.motor.agregarTarjetaColeccion('zonas', 'parque_central', {
            nombre: 'Parque Central'
        });
        
        this.actualizarContenido();
    }
    
    /**
     * Actualiza todo el contenido de la interfaz
     */
    actualizarContenido() {
        this.actualizarPerfil();
        this.actualizarLogros();
        this.actualizarDesafios();
        this.actualizarColeccion();
        this.actualizarRankings();
        
        console.log('🔄 Contenido de gamificación actualizado');
    }
    
    /**
     * Actualiza la sección de perfil
     */
    actualizarPerfil() {
        const estado = this.motor.obtenerEstadoUsuario();
        const experiencia = this.motor.obtenerExperienciaNivel();
        
        // Nivel
        document.getElementById('nivel-actual').textContent = estado.perfil.nivel;
        
        // Experiencia
        document.getElementById('experiencia-texto').textContent = 
            `${experiencia.actual} / ${experiencia.paraSiguienteNivel - experiencia.paraNivelActual} XP`;
        document.getElementById('experiencia-bar').style.width = `${experiencia.progreso}%`;
        
        // Puntos
        document.getElementById('puntos-totales').textContent = estado.perfil.puntosTotales;
        document.getElementById('racha-actual').textContent = estado.perfil.racha;
        document.getElementById('avistamientos-hoy').textContent = estado.perfil.avistamientosHoy;
        document.getElementById('logros-total').textContent = Object.keys(estado.logros).length;
        
        // Estadísticas
        document.getElementById('estadisticas-total-avistamientos').textContent = estado.estadisticas.totalAvistamientos;
        document.getElementById('estadisticas-fotos-tomadas').textContent = estado.estadisticas.fotosTomadas;
        document.getElementById('estadisticas-zonas-visitadas').textContent = estado.estadisticas.zonasVisitadas;
        document.getElementById('estadisticas-desafios-completados').textContent = estado.estadisticas.desafiosCompletados;
    }
    
    /**
     * Actualiza la sección de logros
     */
    actualizarLogros() {
        const contenedor = document.getElementById('contenedor-logros');
        const estado = this.motor.obtenerEstadoUsuario();
        
        if (Object.keys(estado.logros).length === 0) {
            contenedor.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--gamificacion-texto-secundario);">
                    <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
                    <h4 style="margin: 0 0 8px 0;">Sin Logros Aún</h4>
                    <p style="margin: 0; font-size: 14px;">Continúa explorando para desbloquear logros</p>
                </div>
            `;
            return;
        }
        
        contenedor.innerHTML = '';
        
        Object.values(estado.logros).forEach(logro => {
            const elemento = document.createElement('div');
            elemento.className = 'gamificacion-logro desbloqueado gamificacion-animacion-entrada';
            
            const fecha = new Date(logro.fechaDesbloqueo).toLocaleDateString();
            
            elemento.innerHTML = `
                <div class="gamificacion-logro-nombre">${logro.nombre}</div>
                <div class="gamificacion-logro-descripcion">${logro.descripcion || 'Logro especial desbloqueado'}</div>
                <div class="gamificacion-logro-fecha">Desbloqueado el ${fecha}</div>
            `;
            
            contenedor.appendChild(elemento);
        });
    }
    
    /**
     * Actualiza la sección de desafíos
     */
    actualizarDesafios() {
        const contenedor = document.getElementById('contenedor-desafios');
        const estado = this.motor.obtenerEstadoUsuario();
        
        if (estado.desafios.activos.length === 0) {
            contenedor.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--gamificacion-texto-secundario);">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
                    <h4 style="margin: 0 0 8px 0;">Sin Desafíos Activos</h4>
                    <p style="margin: 0; font-size: 14px;">Completa actividades para activar nuevos desafíos</p>
                    <button class="gamificacion-nav-boton" style="margin-top: 16px; padding: 8px 16px; border-radius: 8px;">
                        Activar Desafío
                    </button>
                </div>
            `;
            return;
        }
        
        contenedor.innerHTML = '';
        
        estado.desafios.activos.forEach(desafio => {
            const elemento = document.createElement('div');
            elemento.className = 'gamificacion-desafio gamificacion-animacion-entrada';
            
            const progreso = Math.round((desafio.progreso / desafio.configuracion.objetivo) * 100);
            const tiempoRestante = this.calcularTiempoRestante(desafio.fechaLimite);
            
            elemento.innerHTML = `
                <div class="gamificacion-desafio-header">
                    <h4 class="gamificacion-desafio-nombre">${desafio.nombre}</h4>
                    <span class="gamificacion-desafio-recompensa">+${desafio.recompensa.puntos} pts</span>
                </div>
                <div class="gamificacion-desafio-descripcion">${desafio.descripcion}</div>
                <div class="gamificacion-progreso">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span class="gamificacion-progreso-texto">Progreso</span>
                        <span class="gamificacion-progreso-texto">${desafio.progreso}/${desafio.configuracion.objetivo}</span>
                    </div>
                    <div class="gamificacion-barra-progreso">
                        <div class="gamificacion-barra-progreso-fill" style="width: ${progreso}%"></div>
                    </div>
                </div>
                <div class="gamificacion-desafio-tiempo">
                    ⏰ ${tiempoRestante} restante
                </div>
            `;
            
            contenedor.appendChild(elemento);
        });
    }
    
    /**
     * Actualiza la sección de colección
     */
    actualizarColeccion() {
        const estado = this.motor.obtenerEstadoUsuario();
        
        // Criaturas
        this.actualizarCategoriaColeccion('criaturas', 'tarjetas-criaturas', 'progreso-criaturas');
        this.actualizarCategoriaColeccion('zonas', 'tarjetas-zonas', 'progreso-zonas');
        this.actualizarCategoriaColeccion('logros', 'tarjetas-logros', 'progreso-logros');
        this.actualizarCategoriaColeccion('especiales', 'tarjetas-especiales', 'progreso-especiales');
    }
    
    /**
     * Actualiza una categoría específica de la colección
     */
    actualizarCategoriaColeccion(categoria, contenedorId, progresoId) {
        const contenedor = document.getElementById(contenedorId);
        const estado = this.motor.obtenerEstadoUsuario();
        const progreso = this.motor.obtenerProgresoColeccion(categoria);
        
        // Actualizar progreso
        document.getElementById(progresoId).textContent = `${progreso.obtenidas}/${progreso.total} (${progreso.porcentaje}%)`;
        
        // Generar tarjetas
        contenedor.innerHTML = '';
        
        // Agregar tarjetas obtenidas
        Object.values(estado.coleccion[categoria] || {}).forEach(tarjeta => {
            const elemento = this.crearTarjetaColeccion(tarjeta, categoria);
            contenedor.appendChild(elemento);
        });
        
        // Agregar espacios vacíos para completar la colección
        const espaciosRestantes = progreso.total - progreso.obtenidas;
        for (let i = 0; i < Math.min(espaciosRestantes, 8); i++) {
            const espacio = document.createElement('div');
            espacio.className = 'gamificacion-tarjeta';
            espacio.style.opacity = '0.3';
            espacio.innerHTML = `
                <div style="font-size: 2em; opacity: 0.5;">❓</div>
                <div style="font-size: 10px; opacity: 0.7;">Mystery</div>
            `;
            contenedor.appendChild(espacio);
        }
    }
    
    /**
     * Crea una tarjeta de colección
     */
    crearTarjetaColeccion(tarjeta, categoria) {
        const elemento = document.createElement('div');
        elemento.className = 'gamificacion-tarjeta obtenida gamificacion-tooltip';
        elemento.dataset.tooltip = tarjeta.datos?.nombre || tarjeta.id;
        
        const emoji = this.obtenerEmojiTarjeta(categoria, tarjeta.id);
        
        elemento.innerHTML = `
            <div class="gamificacion-tarjeta-emoji">${emoji}</div>
            ${tarjeta.cantidad > 1 ? `<div class="gamificacion-tarjeta-cantidad">${tarjeta.cantidad}</div>` : ''}
        `;
        
        elemento.addEventListener('click', () => {
            this.mostrarDetallesTarjeta(tarjeta, categoria);
        });
        
        return elemento;
    }
    
    /**
     * Obtiene el emoji para una tarjeta
     */
    obtenerEmojiTarjeta(categoria, id) {
        const emojism = {
            criaturas: {
                'fantasma': '👻',
                'dragon': '🐉',
                'vampiro': '🧛',
                'hombre_lobo': '🐺',
                'bruja': '🧙‍♀️'
            },
            zonas: {
                'parque_central': '🌳',
                'cementerio': '⚱️',
                'bosque_encantado': '🌲',
                'lago_misterioso': '🌊',
                'castillo_antiguo': '🏰'
            },
            logros: {
                'novato_100': '🏆',
                'entusiasta_500': '🥇',
                'investigador_1000': '👨‍🔬',
                'experto_2500': '🧠',
                'maestro_5000': '👑'
            },
            especiales: {
                'desafio_completado': '🎯',
                'ruta_completada': '🗺️',
                'evento_especial': '🎉',
                'coleccionista': '📚'
            }
        };
        
        return emojism[categoria]?.[id] || '❓';
    }
    
    /**
     * Actualiza la sección de rankings
     */
    actualizarRankings() {
        const estado = this.motor.obtenerEstadoUsuario();
        
        // Simular datos de ranking por ahora
        this.actualizarRankingIndividual('ranking-global', [
            { nombre: 'ExploradorMístico', puntos: 15000, posicion: 1 },
            { nombre: 'CazadorDeFantasmas', puntos: 12500, posicion: 2 },
            { nombre: 'Tú', puntos: estado.perfil.puntosTotales, posicion: 5 },
            { nombre: 'NovatoCurioso', puntos: 3200, posicion: 6 }
        ]);
        
        this.actualizarRankingIndividual('ranking-semanal', [
            { nombre: 'FotografoUrbano', puntos: 2500, posicion: 1 },
            { nombre: 'ExploradorNocturno', puntos: 2100, posicion: 2 },
            { nombre: 'Tú', puntos: estado.perfil.puntosTotales, posicion: 3 },
            { nombre: 'RastreadorZonas', puntos: 1800, posicion: 4 }
        ]);
        
        this.actualizarRankingIndividual('ranking-local', [
            { nombre: 'VecinoMisterioso', puntos: 8500, posicion: 1 },
            { nombre: 'Tú', puntos: estado.perfil.puntosTotales, posicion: 2 },
            { nombre: 'CiudadanoCurioso', puntos: 4200, posicion: 3 },
            { nombre: 'ExploradorLocal', puntos: 3800, posicion: 4 }
        ]);
    }
    
    /**
     * Actualiza un ranking individual
     */
    actualizarRankingIndividual(contenedorId, datos) {
        const contenedor = document.getElementById(contenedorId);
        contenedor.innerHTML = '';
        
        datos.forEach(item => {
            const elemento = document.createElement('li');
            elemento.className = 'gamificacion-ranking-item';
            
            elemento.innerHTML = `
                <div class="gamificacion-ranking-posicion">${item.posicion}</div>
                <div class="gamificacion-ranking-nombre">${item.nombre}</div>
                <div class="gamificacion-ranking-puntos">${item.puntos.toLocaleString()}</div>
            `;
            
            contenedor.appendChild(elemento);
        });
    }
    
    /**
     * Cambia la sección activa
     */
    cambiarSeccion(nombreSeccion) {
        // Actualizar botones de navegación
        Object.values(this.botonesNav).forEach(boton => {
            boton.classList.remove('activo');
        });
        
        const botonActivo = this.botonesNav[nombreSeccion];
        if (botonActivo) {
            botonActivo.classList.add('activo');
        }
        
        // Actualizar secciones
        Object.values(this.secciones).forEach(seccion => {
            seccion.classList.remove('activa');
        });
        
        const seccionActiva = this.secciones[nombreSeccion];
        if (seccionActiva) {
            seccionActiva.classList.add('activa');
        }
        
        this.estado.seccionActiva = nombreSeccion;
        console.log(`📱 Cambiando a sección: ${nombreSeccion}`);
    }
    
    /**
     * Muestra el panel
     */
    mostrarPanel() {
        if (this.estado.panelVisible) return;
        
        this.container.style.display = 'block';
        this.container.classList.add('gamificacion-animacion-entrada');
        this.estado.panelVisible = true;
        
        console.log('👁️ Panel de gamificación mostrado');
    }
    
    /**
     * Oculta el panel
     */
    ocultarPanel() {
        if (!this.estado.panelVisible) return;
        
        this.container.classList.add('gamificacion-animacion-salida');
        
        setTimeout(() => {
            this.container.style.display = 'none';
            this.container.classList.remove('gamificacion-animacion-salida');
        }, 300);
        
        this.estado.panelVisible = false;
        console.log('🙈 Panel de gamificación ocultado');
    }
    
    /**
     * Alterna la visibilidad del panel
     */
    alternarPanel() {
        if (this.estado.panelVisible) {
            this.ocultarPanel();
        } else {
            this.mostrarPanel();
        }
    }
    
    /**
     * Actualiza la sección de puntos
     */
    actualizarPuntos(evento) {
        this.actualizarPerfil();
        
        // Animación de puntos
        if (this.opciones.mostrarAnimaciones) {
            const elemento = document.createElement('div');
            elemento.className = 'gamificacion-puntos-ganados gamificacion-animacion-rebote';
            elemento.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, var(--gamificacion-primario), var(--gamificacion-acento));
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
            `;
            elemento.textContent = `+${evento.cantidad} puntos`;
            
            document.body.appendChild(elemento);
            
            setTimeout(() => {
                if (elemento.parentNode) {
                    elemento.parentNode.removeChild(elemento);
                }
            }, 2000);
        }
    }
    
    /**
     * Actualiza el nivel
     */
    actualizarNivel(evento) {
        this.actualizarPerfil();
        
        // Animación especial para subir de nivel
        if (this.opciones.mostrarAnimaciones) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
            `;
            
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: linear-gradient(135deg, var(--gamificacion-primario), var(--gamificacion-secundario));
                color: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                transform: scale(0.8);
                animation: gamificacionBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            `;
            
            modal.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                <h2 style="margin: 0 0 12px 0;">¡Subiste de Nivel!</h2>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">Nivel ${evento.nuevoNivel}</div>
                <div style="opacity: 0.9; font-size: 14px;">¡Felicidades por tu progreso!</div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 500);
            }, 3000);
        }
    }
    
    /**
     * Muestra notificación de logro
     */
    mostrarNotificacionLogro(logro) {
        this.actualizarLogros();
        
        if (this.opciones.mostrarAnimaciones) {
            const notificacion = document.createElement('div');
            notificacion.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--gamificacion-exito), #22c55e);
                color: white;
                padding: 20px 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                text-align: center;
                pointer-events: none;
                animation: gamificacionPulse 0.6s ease-in-out;
            `;
            
            notificacion.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
                <h3 style="margin: 0 0 8px 0;">¡Logro Desbloqueado!</h3>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${logro.nombre}</div>
                <div style="opacity: 0.9; font-size: 14px;">${logro.descripcion}</div>
            `;
            
            document.body.appendChild(notificacion);
            
            setTimeout(() => {
                notificacion.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    if (notificacion.parentNode) {
                        notificacion.parentNode.removeChild(notificacion);
                    }
                }, 500);
            }, 3000);
        }
    }
    
    /**
     * Calcula el tiempo restante para un desafío
     */
    calcularTiempoRestante(fechaLimite) {
        const ahora = new Date();
        const limite = new Date(fechaLimite);
        const diferencia = limite - ahora;
        
        if (diferencia <= 0) return 'Vencido';
        
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (dias > 0) {
            return `${dias}d ${horas}h`;
        } else {
            return `${horas}h`;
        }
    }
    
    /**
     * Muestra detalles de una tarjeta
     */
    mostrarDetallesTarjeta(tarjeta, categoria) {
        console.log(`Mostrando detalles de ${categoria}:`, tarjeta);
        // TODO: Implementar modal de detalles
    }
    
    /**
     * Inicia la actualización automática
     */
    iniciarActualizacionAutomatica() {
        // Actualizar cada 30 segundos
        setInterval(() => {
            if (!this.estado.actualizando) {
                this.actualizarContenido();
            }
        }, 30000);
        
        // Actualizar desafíos cada minuto (para tiempos restantes)
        setInterval(() => {
            if (this.estado.seccionActiva === 'desafios') {
                this.actualizarDesafios();
            }
        }, 60000);
    }
    
    /**
     * Obtiene la configuración de la interfaz
     */
    obtenerConfiguracion() {
        return {
            posicion: this.opciones.posicionPanel,
            compacta: this.opciones.compacta,
            animaciones: this.opciones.mostrarAnimaciones,
            autoActualizar: this.opciones.autoActualizar,
            visible: this.estado.panelVisible,
            seccionActiva: this.estado.seccionActiva
        };
    }
    
    /**
     * Actualiza la configuración
     */
    actualizarConfiguracion(nuevaConfiguracion) {
        this.opciones = { ...this.opciones, ...nuevaConfiguracion };
        
        // Aplicar cambios visuales
        if (nuevaConfiguracion.posicion) {
            this.container.className = `gamificacion-ui gamificacion-panel-${nuevaConfiguracion.posicion}`;
        }
        
        if (nuevaConfiguracion.compacta !== undefined) {
            if (nuevaConfiguracion.compacta) {
                this.container.classList.add('gamificacion-compacto');
            } else {
                this.container.classList.remove('gamificacion-compacto');
            }
        }
        
        console.log('⚙️ Configuración de interfaz actualizada');
    }
    
    /**
     * Cierra la interfaz y limpia recursos
     */
    destruir() {
        // Remover del DOM
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        // Limpiar referencias
        this.elementos = {};
        this.botonesNav = {};
        this.secciones = {};
        
        console.log('🧹 Interfaz de gamificación destruida');
    }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.InterfazGamificacionUrukais = InterfazGamificacionUrukais;
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InterfazGamificacionUrukais;
}