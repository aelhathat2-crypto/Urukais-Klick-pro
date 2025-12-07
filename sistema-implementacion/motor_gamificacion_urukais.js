/**
 * SISTEMA DE GAMIFICACIÓN URUKAIS KLICK
 * Motor principal del sistema gamificado
 * 
 * Funcionalidades:
 * - Sistema de puntos y logros
 * - Mecánicas de progresión
 * - Rankings y competencias
 * - Elementos educativos
 * - Desafíos de fotografía
 * - Colección de tarjetas
 * 
 * @author MiniMax Agent
 * @version 1.0.0
 * @date 2025-11-16
 */

class MotorGamificacionUrukais {
    constructor(config = {}) {
        this.config = {
            // Configuración básica
            usuarioId: config.usuarioId || this.generarIdUnico(),
            idioma: config.idioma || 'es',
            
            // Configuración de gamificación
            habilitarPuntos: config.habilitarPuntos !== false,
            habilitarLogros: config.habilitarLogros !== false,
            habilitarRankings: config.habilitarRankings !== false,
            habilitarDesafios: config.habilitarDesafios !== false,
            habilitarColeccion: config.habilitarColeccion !== false,
            habilitarRutas: config.habilitarRutas !== false,
            
            // Persistencia
            storageMethod: config.storageMethod || 'localStorage', // localStorage, sessionStorage, indexedDB
            
            // Eventos y callbacks
            onPuntosObtenidos: config.onPuntosObtenidos || null,
            onLogroDesbloqueado: config.onLogroDesbloqueado || null,
            onNivelSubido: config.onNivelSubido || null,
            onDesafioCompletado: config.onDesafioCompletado || null,
            
            // Configuración avanzada
            mostrarNotificaciones: config.mostrarNotificaciones !== false,
            animaciones: config.animaciones !== false,
            sonidoEfectos: config.sonidoEfectos !== false
        };
        
        // Inicialización de propiedades
        this.inicializarPropiedades();
        
        // Cargar datos existentes
        this.cargarDatosUsuario();
        
        // Event listeners
        this.configurarEventListeners();
        
        console.log('🎮 Motor de Gamificación Urukais inicializado');
    }
    
    /**
     * Inicializa las propiedades del sistema
     */
    inicializarPropiedades() {
        // Perfil del usuario
        this.perfil = {
            nivel: 1,
            experiencia: 0,
            puntosTotales: 0,
            racha: 0,
            fechaUltimoAvistamiento: null,
            avistamientosHoy: 0,
            zonaFavorita: null,
            criaturaFavorita: null,
            tiempoTotalUsandoApp: 0
        };
        
        // Sistemas de puntos
        this.puntos = {
            avistamiento: 0,
            fotografia: 0,
            identificacion: 0,
            exploracion: 0,
            colaboracion: 0,
            diario: 0,
            logros: 0,
            bonificaciones: 0
        };
        
        // Logros desbloqueados
        this.logros = {};
        
        // Desafíos activos y completados
        this.desafios = {
            activos: [],
            completados: [],
            fallidos: []
        };
        
        // Colección de tarjetas
        this.coleccionTarjetas = {
            criaturas: {},
            zonas: {},
            logros: {},
            especiales: {}
        };
        
        // Rutas temáticas
        this.rutasTematicas = {
            activas: [],
            completadas: [],
            progresos: {}
        };
        
        // Competencias y rankings
        this.rankings = {
            local: { posicion: null, datos: [] },
            global: { posicion: null, datos: [] },
            semanal: { posicion: null, datos: [] },
            mensual: { posicion: null, datos: [] }
        };
        
        // Configuraciones personales
        this.configuracionPersonal = {
            notificacionesPuntos: true,
            mostrarProgresoPublicamente: false,
            participarEnRankings: true,
            notificacionesDesafios: true,
            temaVisual: 'mystico',
            dificultadDesafios: 'normal'
        };
        
        // Estadísticas completas
        this.estadisticas = this.inicializarEstadisticas();
        
        // Sistemas de recompensas
        this.recompensas = {
            proximasDisponibles: this.calcularRecompensasDisponibles(),
            historial: [],
            pendientes: []
        };
    }
    
    /**
     * Inicializa las estadísticas del usuario
     */
    inicializarEstadisticas() {
        return {
            // Avistamientos
            totalAvistamientos: 0,
            avistamientosUnicos: 0,
            avistamientosRepetidos: 0,
            criaturasDiferentesVistas: 0,
            zonasVisitadas: 0,
            kilometrosRecorridos: 0,
            
            // Fotografía
            fotosTomadas: 0,
            fotosDeCalidadAlta: 0,
            fotosCompartidas: 0,
            fotosPremiadas: 0,
            albumesCreados: 0,
            
            // Identificación
            identificacionesCorrectas: 0,
            identificacionesIncorrectas: 0,
            ayudaRecibida: 0,
            tiempoPromedioIdentificacion: 0,
            precisionIdentificacion: 0,
            
            // Colaboración
            comentariosPublicados: 0,
            ayudasBrindadas: 0,
            reportesSubidos: 0,
            validacionesRealizadas: 0,
            
            // Temporal
            diasActivos: 0,
            tiempoPromedioSesion: 0,
            mayorRacha: 0,
            ultimaVezActivo: new Date(),
            
            // Especiales
            primerAvistamiento: null,
            criaturareMasRaraVista: null,
            lugarMasAventurado: null,
            fotoMasPremiada: null,
            logroMasDificil: null
        };
    }
    
    /**
     * Configura los event listeners
     */
    configurarEventListeners() {
        // Listener para cambios de nivel
        document.addEventListener('nivelSubido', (event) => {
            this.mostrarNotificacionNivel(event.detail.nuevoNivel);
        });
        
        // Listener para nuevos logros
        document.addEventListener('logroDesbloqueado', (event) => {
            this.mostrarNotificacionLogro(event.detail.logro);
        });
        
        // Listener para completar desafíos
        document.addEventListener('desafioCompletado', (event) => {
            this.procesarCompletadoDesafio(event.detail.desafio);
        });
    }
    
    /**
     * Carga los datos del usuario desde el storage
     */
    cargarDatosUsuario() {
        try {
            const datos = this.obtenerDelStorage();
            if (datos && datos.version === '1.0.0') {
                this.perfil = { ...this.perfil, ...datos.perfil };
                this.puntos = { ...this.puntos, ...datos.puntos };
                this.logros = datos.logros || {};
                this.desafios = { ...this.desafios, ...datos.desafios };
                this.coleccionTarjetas = { ...this.coleccionTarjetas, ...datos.coleccionTarjetas };
                this.rutasTematicas = { ...this.rutasTematicas, ...datos.rutasTematicas };
                this.rankings = { ...this.rankings, ...datos.rankings };
                this.configuracionPersonal = { ...this.configuracionPersonal, ...datos.configuracionPersonal };
                this.estadisticas = { ...this.estadisticas, ...datos.estadisticas };
                this.recompensas = { ...this.recompensas, ...datos.recompensas };
                
                console.log('📊 Datos de gamificación cargados exitosamente');
            }
        } catch (error) {
            console.error('Error cargando datos de gamificación:', error);
        }
    }
    
    /**
     * Guarda los datos del usuario en el storage
     */
    guardarDatosUsuario() {
        try {
            const datos = {
                version: '1.0.0',
                perfil: this.perfil,
                puntos: this.puntos,
                logros: this.logros,
                desafios: this.desafios,
                coleccionTarjetas: this.coleccionTarjetas,
                rutasTematicas: this.rutasTematicas,
                rankings: this.rankings,
                configuracionPersonal: this.configuracionPersonal,
                estadisticas: this.estadisticas,
                recompensas: this.recompensas,
                ultimaActualizacion: new Date()
            };
            
            this.guardarEnStorage(datos);
            console.log('💾 Datos de gamificación guardados');
        } catch (error) {
            console.error('Error guardando datos de gamificación:', error);
        }
    }
    
    // ===============================
    // SISTEMA DE PUNTOS
    // ===============================
    
    /**
     * Otorga puntos por una acción específica
     */
    otorgarPuntos(tipoAccion, cantidad, detalles = {}) {
        if (!this.config.habilitarPuntos) return;
        
        // Verificar multiplicadores de bonus
        const multiplicador = this.calcularMultiplicadorBonus(detalles);
        const puntosFinales = Math.floor(cantidad * multiplicador);
        
        // Actualizar contadores de puntos
        this.puntos[tipoAccion] = (this.puntos[tipoAccion] || 0) + puntosFinales;
        this.perfil.puntosTotales += puntosFinales;
        
        // Actualizar experiencia
        this.agregarExperiencia(puntosFinales);
        
        // Verificar nuevos logros relacionados con puntos
        this.verificarLogrosPuntos();
        
        // Guardar datos
        this.guardarDatosUsuario();
        
        // Callback si está configurado
        if (this.config.onPuntosObtenidos) {
            this.config.onPuntosObtenidos({
                tipo: tipoAccion,
                cantidad: puntosFinales,
                multiplicador: multiplicador,
                detalles: detalles
            });
        }
        
        // Mostrar notificación si está habilitada
        if (this.config.mostrarNotificaciones) {
            this.mostrarNotificacionPuntos(tipoAccion, puntosFinales);
        }
        
        console.log(`⭐ ${puntosFinales} puntos otorgados por: ${tipoAccion}`);
        return puntosFinales;
    }
    
    /**
     * Calcula el multiplicador de bonus basado en varios factores
     */
    calcularMultiplicadorBonus(detalles) {
        let multiplicador = 1.0;
        
        // Bonus por racha
        if (this.perfil.racha > 0) {
            multiplicador *= (1 + Math.min(this.perfil.racha * 0.1, 2.0));
        }
        
        // Bonus por nivel
        multiplicador *= (1 + (this.perfil.nivel - 1) * 0.05);
        
        // Bonus por hora del día (horas premium)
        const hora = new Date().getHours();
        if (hora >= 6 && hora <= 9) multiplicador *= 1.2; // Hora dorada matutina
        if (hora >= 18 && hora <= 20) multiplicador *= 1.3; // Hora dorada vespertina
        
        // Bonus por clima (tiempo místico)
        if (detalles.clima === 'niebla' || detalles.clima === 'tormenta') {
            multiplicador *= 1.25;
        }
        
        // Bonus por fin de semana
        const diaSemana = new Date().getDay();
        if (diaSemana === 0 || diaSemana === 6) multiplicador *= 1.15;
        
        // Bonus por primera vez
        if (detalles.primeraVez) multiplicador *= 1.5;
        
        // Bonus por calidad de foto
        if (detalles.calidadFoto === 'excelente') multiplicador *= 1.1;
        
        return multiplicador;
    }
    
    /**
     * Agrega experiencia al usuario
     */
    agregarExperiencia(cantidad) {
        this.perfil.experiencia += cantidad;
        
        // Verificar si sube de nivel
        const experienciaParaNivel = this.calcularExperienciaParaNivel(this.perfil.nivel);
        if (this.perfil.experiencia >= experienciaParaNivel) {
            this.subirNivel();
        }
    }
    
    /**
     * Sube el nivel del usuario
     */
    subirNivel() {
        const experienciaAnterior = this.calcularExperienciaParaNivel(this.perfil.nivel - 1);
        const experienciaParaNivelActual = this.calcularExperienciaParaNivel(this.perfil.nivel);
        const experienciaUsada = experienciaParaNivelActual - experienciaAnterior;
        
        this.perfil.experiencia -= experienciaUsada;
        this.perfil.nivel++;
        
        // Bonificación por subir de nivel
        this.puntos.bonificaciones += (this.perfil.nivel * 10);
        this.perfil.puntosTotales += (this.perfil.nivel * 10);
        
        // Verificar logros relacionados con nivel
        this.verificarLogrosNivel();
        
        // Recalcular recompensas disponibles
        this.recompensas.proximasDisponibles = this.calcularRecompensasDisponibles();
        
        // Callback si está configurado
        if (this.config.onNivelSubido) {
            this.config.onNivelSubido({
                nivelAnterior: this.perfil.nivel - 1,
                nuevoNivel: this.perfil.nivel,
                bonificacion: this.perfil.nivel * 10
            });
        }
        
        console.log(`🎉 ¡Subiste al nivel ${this.perfil.nivel}!`);
        this.guardarDatosUsuario();
    }
    
    /**
     * Calcula la experiencia necesaria para un nivel específico
     */
    calcularExperienciaParaNivel(nivel) {
        // Fórmula exponencial para experiencia requerida
        return Math.floor(100 * Math.pow(1.5, nivel - 1));
    }
    
    // ===============================
    // SISTEMA DE LOGROS
    // ===============================
    
    /**
     * Desbloquea un logro
     */
    desbloquearLogro(idLogro, descripcion = '', recompensa = null) {
        if (this.logros[idLogro]) return; // Ya desbloqueado
        
        this.logros[idLogro] = {
            id: idLogro,
            nombre: this.obtenerNombreLogro(idLogro),
            descripcion: descripcion,
            fechaDesbloqueo: new Date(),
            recompensa: recompensa,
            categoria: this.obtenerCategoriaLogro(idLogro)
        };
        
        // Otorgar puntos por el logro
        this.otorgarPuntos('logros', 50);
        
        // Callback si está configurado
        if (this.config.onLogroDesbloqueado) {
            this.config.onLogroDesbloqueado(this.logros[idLogro]);
        }
        
        // Mostrar notificación
        if (this.config.mostrarNotificaciones) {
            this.mostrarNotificacionLogro(this.logros[idLogro]);
        }
        
        // Verificar logros relacionados
        this.verificarLogrosCadena(idLogro);
        
        console.log(`🏆 Logro desbloqueado: ${this.logros[idLogro].nombre}`);
        this.guardarDatosUsuario();
    }
    
    /**
     * Verifica logros basados en puntos
     */
    verificarLogrosPuntos() {
        const logrosPuntos = [
            { id: 'novato_100', umbral: 100, nombre: 'Explorador Novato' },
            { id: 'entusiasta_500', umbral: 500, nombre: 'Entusiasta' },
            { id: 'investigador_1000', umbral: 1000, nombre: 'Investigador' },
            { id: 'experto_2500', umbral: 2500, nombre: 'Experto Místico' },
            { id: 'maestro_5000', umbral: 5000, nombre: 'Maestro de lo Místico' },
            { id: 'leyenda_10000', umbral: 10000, nombre: 'Leyenda Urbana' }
        ];
        
        logrosPuntos.forEach(logro => {
            if (!this.logros[logro.id] && this.perfil.puntosTotales >= logro.umbral) {
                this.desbloquearLogro(logro.id, `Obtener ${logro.umbral} puntos totales`, {
                    puntos: 100,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    /**
     * Verifica logros basados en nivel
     */
    verificarLogrosNivel() {
        const logrosNivel = [
            { id: 'nivel_5', nivel: 5, nombre: 'Practicante' },
            { id: 'nivel_10', nivel: 10, nombre: 'Aventurero' },
            { id: 'nivel_20', nivel: 20, nombre: 'Explorador' },
            { id: 'nivel_50', nivel: 50, nombre: 'Sabio Místico' },
            { id: 'nivel_100', nivel: 100, nombre: 'Guardián del Conocimiento' }
        ];
        
        logrosNivel.forEach(logro => {
            if (!this.logros[logro.id] && this.perfil.nivel >= logro.nivel) {
                this.desbloquearLogro(logro.id, `Alcanzar el nivel ${logro.nivel}`, {
                    puntos: logro.nivel * 20,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    /**
     * Verifica logros en cadena
     */
    verificarLogrosCadena(logroId) {
        // Verificar si completar este logro desbloquea otros
        const cadenasLogros = {
            'primera_foto': ['fotografo_principiante', 'coleccionista_inicial'],
            'novato_100': ['explorador_dedicado'],
            'nivel_10': ['maestro_aprendiz']
        };
        
        const relacionados = cadenasLogros[logroId] || [];
        relacionados.forEach(id => {
            if (this.cumpleRequisitosLogro(id) && !this.logros[id]) {
                this.desbloquearLogro(id, 'Completar cadena de logros');
            }
        });
    }
    
    /**
     * Verifica si se cumplen los requisitos de un logro
     */
    cumpleRequisitosLogro(idLogro) {
        const requisitos = this.obtenerRequisitosLogro(idLogro);
        
        for (const [tipo, umbral] of Object.entries(requisitos)) {
            if (tipo === 'nivel' && this.perfil.nivel < umbral) return false;
            if (tipo === 'puntos' && this.perfil.puntosTotales < umbral) return false;
            if (tipo === 'avistamientos' && this.estadisticas.totalAvistamientos < umbral) return false;
            if (tipo === 'fotos' && this.estadisticas.fotosTomadas < umbral) return false;
            if (tipo === 'zonas' && this.estadisticas.zonasVisitadas < umbral) return false;
            if (tipo === 'racha' && this.perfil.racha < umbral) return false;
        }
        
        return true;
    }
    
    // ===============================
    // SISTEMA DE DESAFÍOS
    // ===============================
    
    /**
     * Activa un nuevo desafío
     */
    activarDesafio(idDesafio, configuracion = {}) {
        const desafio = this.crearDesafio(idDesafio, configuracion);
        
        if (desafio) {
            this.desafios.activos.push(desafio);
            this.guardarDatosUsuario();
            
            if (this.config.mostrarNotificaciones) {
                this.mostrarNotificacionDesafio(desafio);
            }
            
            console.log(`🎯 Nuevo desafío activado: ${desafio.nombre}`);
            return desafio;
        }
        return null;
    }
    
    /**
     * Crea un desafío personalizado
     */
    crearDesafio(idDesafio, configuracion) {
        const desafiasDisponibles = this.obtenerDesafiosDisponibles();
        const template = desafiasDisponibles[idDesafio];
        
        if (!template) return null;
        
        return {
            id: idDesafio,
            nombre: template.nombre,
            descripcion: template.descripcion,
            tipo: template.tipo,
            configuracion: { ...template.configuracion, ...configuracion },
            fechaInicio: new Date(),
            fechaLimite: this.calcularFechaLimite(template.duracion),
            recompensa: template.recompensa,
            progreso: 0,
            completado: false,
            vecesCompletado: 0,
            estadisticas: this.inicializarEstadisticasDesafio(template.tipo)
        };
    }
    
    /**
     * Actualiza el progreso de un desafío
     */
    actualizarProgresoDesafio(idDesafio, progresoAdicional = 1, detalles = {}) {
        const desafio = this.desafios.activos.find(d => d.id === idDesafio);
        if (!desafio || desafio.completado) return;
        
        // Verificar si está vencido
        if (new Date() > desafio.fechaLimite) {
            this.marcaraDesafioVencido(idDesafio);
            return;
        }
        
        // Actualizar progreso
        desafio.progreso += progresoAdicional;
        
        // Actualizar estadísticas específicas
        this.actualizarEstadisticasDesafio(desafio, detalles);
        
        // Verificar si está completado
        if (desafio.progreso >= desafio.configuracion.objetivo) {
            this.completarDesafio(idDesafio);
        } else {
            this.guardarDatosUsuario();
        }
    }
    
    /**
     * Completa un desafío
     */
    completarDesafio(idDesafio) {
        const desafio = this.desafios.activos.find(d => d.id === idDesafio);
        if (!desafio) return;
        
        // Marcar como completado
        desafio.completado = true;
        desafio.fechaCompletado = new Date();
        desafio.vecesCompletado++;
        
        // Mover a completados
        this.desafios.completados.push(desafio);
        this.desafios.activos = this.desafios.activos.filter(d => d.id !== idDesafio);
        
        // Otorgar recompensa
        this.otorgarRecompensaDesafio(desafio);
        
        // Actualizar estadísticas
        this.estadisticas.desafiosCompletados = (this.estadisticas.desafiosCompletados || 0) + 1;
        
        // Verificar logros relacionados
        this.verificarLogrosDesafios();
        
        // Callback si está configurado
        if (this.config.onDesafioCompletado) {
            this.config.onDesafioCompletado(desafio);
        }
        
        // Mostrar notificación
        if (this.config.mostrarNotificaciones) {
            this.mostrarNotificacionDesafioCompletado(desafio);
        }
        
        console.log(`🎉 Desafío completado: ${desafio.nombre}`);
        this.guardarDatosUsuario();
    }
    
    // ===============================
    // SISTEMA DE COLECCIÓN
    // ===============================
    
    /**
     * Agrega una tarjeta a la colección
     */
    agregarTarjetaColeccion(tipo, idElemento, datos = {}) {
        const fecha = new Date();
        
        if (!this.coleccionTarjetas[tipo]) {
            this.coleccionTarjetas[tipo] = {};
        }
        
        if (!this.coleccionTarjetas[tipo][idElemento]) {
            this.coleccionTarjetas[tipo][idElemento] = {
                id: idElemento,
                fechaObtencion: fecha,
                cantidad: 1,
                calidad: datos.calidad || 'común',
                raro: datos.raro || false,
                especial: datos.especial || false,
                posicion: this.contarElementosColeccion() + 1,
                datos: datos
            };
            
            // Verificar logros de colección
            this.verificarLogrosColeccion();
            
            this.guardarDatosUsuario();
            console.log(`🃏 Nueva tarjeta agregada a la colección: ${idElemento}`);
            
            return true;
        } else {
            // Incrementar cantidad si ya existe
            this.coleccionTarjetas[tipo][idElemento].cantidad++;
            this.guardarDatosUsuario();
            return false;
        }
    }
    
    /**
     * Obtiene el progreso de la colección
     */
    obtenerProgresoColeccion(tipo) {
        const coleccion = this.coleccionTarjetas[tipo];
        if (!coleccion) return { obtenidas: 0, total: 0, porcentaje: 0 };
        
        const obtenidas = Object.keys(coleccion).length;
        const total = this.obtenerTotalElementosColeccion(tipo);
        const porcentaje = total > 0 ? Math.round((obtenidas / total) * 100) : 0;
        
        return { obtenidas, total, porcentaje };
    }
    
    // ===============================
    // SISTEMA DE RUTAS TEMÁTICAS
    // ===============================
    
    /**
     * Inicia una ruta temática
     */
    iniciarRutaTematica(idRuta) {
        const ruta = this.obtenerRutaTematica(idRuta);
        if (!ruta) return null;
        
        const nuevaRuta = {
            id: idRuta,
            nombre: ruta.nombre,
            descripcion: ruta.descripcion,
            puntos: ruta.puntos,
            fechaInicio: new Date(),
            fechaLimite: this.calcularFechaLimite(ruta.duracion),
            progreso: 0,
            completada: false,
            etapasCompletadas: [],
            puntosVisitados: [],
            estadisticas: {
                tiempoInicio: new Date(),
                tiempoPausado: 0,
                pausasRealizadas: 0
            }
        };
        
        this.rutasTematicas.activas.push(nuevaRuta);
        this.rutasTematicas.progresos[idRuta] = nuevaRuta;
        
        this.guardarDatosUsuario();
        console.log(`🗺️ Ruta temática iniciada: ${ruta.nombre}`);
        return nuevaRuta;
    }
    
    /**
     * Actualiza el progreso de una ruta
     */
    actualizarProgresoRuta(idRuta, puntoId) {
        const ruta = this.rutasTematicas.activas.find(r => r.id === idRuta);
        if (!ruta || ruta.completada) return;
        
        // Verificar si es un punto válido de la ruta
        const esPuntoValido = ruta.puntos.some(p => p.id === puntoId);
        if (!esPuntoValido) return;
        
        // Verificar si ya fue visitado
        if (ruta.puntosVisitados.includes(puntoId)) return;
        
        // Agregar punto visitado
        ruta.puntosVisitados.push(puntoId);
        ruta.progreso = Math.round((ruta.puntosVisitados.length / ruta.puntos.length) * 100);
        
        // Verificar si está completa
        if (ruta.progreso >= 100) {
            this.completarRutaTematica(idRuta);
        } else {
            this.guardarDatosUsuario();
        }
    }
    
    // ===============================
    // UTILIDADES Y HELPERS
    // ===============================
    
    /**
     * Genera un ID único
     */
    generarIdUnico() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Obtiene datos del storage
     */
    obtenerDelStorage() {
        const key = `urukais_gamificacion_${this.config.usuarioId}`;
        let datos = null;
        
        switch (this.config.storageMethod) {
            case 'sessionStorage':
                datos = sessionStorage.getItem(key);
                break;
            case 'indexedDB':
                // Implementar IndexedDB si se requiere
                break;
            default:
                datos = localStorage.getItem(key);
        }
        
        return datos ? JSON.parse(datos) : null;
    }
    
    /**
     * Guarda datos en el storage
     */
    guardarEnStorage(datos) {
        const key = `urukais_gamificacion_${this.config.usuarioId}`;
        const jsonDatos = JSON.stringify(datos);
        
        switch (this.config.storageMethod) {
            case 'sessionStorage':
                sessionStorage.setItem(key, jsonDatos);
                break;
            case 'indexedDB':
                // Implementar IndexedDB si se requiere
                break;
            default:
                localStorage.setItem(key, jsonDatos);
        }
    }
    
    /**
     * Calcula fecha límite para desafíos/rutas
     */
    calcularFechaLimite(duracion) {
        const ahora = new Date();
        return new Date(ahora.getTime() + (duracion * 24 * 60 * 60 * 1000));
    }
    
    /**
     * Obtiene la experiencia actual y requerida para el nivel
     */
    obtenerExperienciaNivel() {
        const experienciaActual = this.perfil.experiencia;
        const experienciaParaNivelActual = this.calcularExperienciaParaNivel(this.perfil.nivel);
        const experienciaParaSiguienteNivel = this.calcularExperienciaParaNivel(this.perfil.nivel + 1);
        
        return {
            actual: experienciaActual,
            paraNivelActual: experienciaParaNivelActual,
            paraSiguienteNivel: experienciaParaSiguienteNivel,
            progreso: experienciaParaSiguienteNivel > experienciaParaNivelActual ? 
                Math.round(((experienciaActual - experienciaParaNivelActual) / (experienciaParaSiguienteNivel - experienciaParaNivelActual)) * 100) : 0
        };
    }
    
    /**
     * Obtiene estadísticas completas del usuario
     */
    obtenerEstadisticasCompletas() {
        return {
            perfil: this.perfil,
            puntos: this.puntos,
            logros: this.logros,
            desafios: {
                activos: this.desafios.activos.length,
                completados: this.desafios.completados.length,
                total: this.desafios.completados.length + this.desafios.activos.length
            },
            coleccion: this.coleccionTarjetas,
            rutas: {
                activas: this.rutasTematicas.activas.length,
                completadas: this.rutasTematicas.completadas.length
            },
            rankings: this.rankings,
            estadisticas: this.estadisticas
        };
    }
    
    // ===============================
    // NOTIFICACIONES Y UI
    // ===============================
    
    /**
     * Muestra notificación de puntos obtenidos
     */
    mostrarNotificacionPuntos(tipo, cantidad) {
        if (!this.config.mostrarNotificaciones) return;
        
        const mensaje = this.obtenerMensajePuntos(tipo, cantidad);
        this.crearNotificacionVisual(mensaje, 'puntos');
    }
    
    /**
     * Muestra notificación de nuevo logro
     */
    mostrarNotificacionLogro(logro) {
        if (!this.config.mostrarNotificaciones) return;
        
        const mensaje = `🏆 ¡Nuevo Logro Desbloqueado!\\n${logro.nombre}`;
        this.crearNotificacionVisual(mensaje, 'logro');
    }
    
    /**
     * Muestra notificación de subir de nivel
     */
    mostrarNotificacionNivel(nuevoNivel) {
        if (!this.config.mostrarNotificaciones) return;
        
        const mensaje = `🎉 ¡Felicidades!\\nSubiste al nivel ${nuevoNivel}`;
        this.crearNotificacionVisual(mensaje, 'nivel');
    }
    
    /**
     * Muestra notificación de desafío
     */
    mostrarNotificacionDesafio(desafio) {
        if (!this.config.mostrarNotificaciones) return;
        
        const mensaje = `🎯 Nuevo Desafío Activado\\n${desafio.nombre}`;
        this.crearNotificacionVisual(mensaje, 'desafio');
    }
    
    /**
     * Muestra notificación de desafío completado
     */
    mostrarNotificacionDesafioCompletado(desafio) {
        if (!this.config.mostrarNotificaciones) return;
        
        const mensaje = `🎉 ¡Desafío Completado!\\n${desafio.nombre}`;
        this.crearNotificacionVisual(mensaje, 'desafio_completado');
    }
    
    /**
     * Crea una notificación visual
     */
    crearNotificacionVisual(mensaje, tipo) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `gamificacion-notificacion gamificacion-${tipo}`;
        notificacion.innerHTML = mensaje.replace(/\\n/g, '<br>');
        
        // Estilos inline para la notificación
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #6B46C1, #9333EA);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            animation: gamificacionSlideIn 0.3s ease-out;
        `;
        
        // Agregar animación CSS
        if (!document.getElementById('gamificacion-styles')) {
            const style = document.createElement('style');
            style.id = 'gamificacion-styles';
            style.textContent = `
                @keyframes gamificacionSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes gamificacionSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .gamificacion-notificacion:hover {
                    transform: translateX(-5px);
                    transition: transform 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Agregar al DOM
        document.body.appendChild(notificacion);
        
        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notificacion.style.animation = 'gamificacionSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 4000);
        
        // Click para cerrar manualmente
        notificacion.addEventListener('click', () => {
            notificacion.style.animation = 'gamificacionSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        });
    }
    
    // ===============================
    // MÉTODOS DE CONFIGURACIÓN Y TEMPLATES
    // ===============================
    
    /**
     * Obtiene el nombre de un logro
     */
    obtenerNombreLogro(idLogro) {
        const nombres = {
            'novato_100': 'Explorador Novato',
            'entusiasta_500': 'Entusiasta',
            'investigador_1000': 'Investigador',
            'experto_2500': 'Experto Místico',
            'maestro_5000': 'Maestro de lo Místico',
            'leyenda_10000': 'Leyenda Urbana',
            'nivel_5': 'Practicante',
            'nivel_10': 'Aventurero',
            'nivel_20': 'Explorador',
            'nivel_50': 'Sabio Místico',
            'nivel_100': 'Guardián del Conocimiento',
            'primera_foto': 'Primer Recuerdo',
            'fotografo_principiante': 'Fotógrafo Principiante',
            'coleccionista_inicial': 'Coleccionista Inicial'
        };
        return nombres[idLogro] || 'Logro Desconocido';
    }
    
    /**
     * Obtiene la categoría de un logro
     */
    obtenerCategoriaLogro(idLogro) {
        if (idLogro.startsWith('nivel_')) return 'nivel';
        if (idLogro.includes('1000') || idLogro.includes('2500')) return 'experiencia';
        if (idLogro.includes('foto') || idLogro.includes('coleccion')) return 'coleccion';
        return 'general';
    }
    
    /**
     * Obtiene los requisitos de un logro
     */
    obtenerRequisitosLogro(idLogro) {
        const requisitos = {
            'fotografo_principiante': { fotos: 5 },
            'coleccionista_inicial': { coleccion: 10 },
            'explorador_dedicado': { racha: 7 },
            'maestro_aprendiz': { nivel: 10, experiencia: 1000 }
        };
        return requisitos[idLogro] || {};
    }
    
    /**
     * Obtiene desafíos disponibles
     */
    obtenerDesafiosDisponibles() {
        return {
            'primer_avistamiento': {
                nombre: 'Primera Vez',
                descripcion: 'Realiza tu primer avistamiento',
                tipo: 'avistamiento',
                configuracion: { objetivo: 1, zona: null, criatura: null },
                duracion: 7,
                recompensa: { puntos: 100, titulo: 'Explorador Novato' }
            },
            'fotografo_semanal': {
                nombre: 'Fotógrafo Semanal',
                descripcion: 'Toma 10 fotos de calidad esta semana',
                tipo: 'fotografia',
                configuracion: { objetivo: 10, calidad: 'alta' },
                duracion: 7,
                recompensa: { puntos: 200, tarjeta_especial: true }
            },
            'explorador_zona': {
                nombre: 'Explorador de Zona',
                descripcion: 'Visita 5 zonas diferentes',
                tipo: 'exploracion',
                configuracion: { objetivo: 5, zonas: [] },
                duracion: 30,
                recompensa: { puntos: 300, badge: 'Explorador' }
            },
            'racha_diaria': {
                nombre: 'Constancia',
                descripcion: 'Mantén una racha de 7 días',
                tipo: 'actividad',
                configuracion: { objetivo: 7, tipo: 'dias_consecutivos' },
                duracion: 7,
                recompensa: { puntos: 500, titulo: 'Constante' }
            }
        };
    }
    
    /**
     * Obtiene una ruta temática
     */
    obtenerRutaTematica(idRuta) {
        const rutas = {
            'iniciacion_mistica': {
                nombre: 'Iniciación Mística',
                descripcion: 'Tu primera aventura en el mundo de las criaturas místicas',
                puntos: [
                    { id: 'punto_1', nombre: 'Parque Central', lat: 0, lng: 0 },
                    { id: 'punto_2', nombre: 'Bosque Encantado', lat: 0.1, lng: 0.1 },
                    { id: 'punto_3', nombre: 'Lago Misterioso', lat: 0.2, lng: 0.1 }
                ],
                duracion: 14
            },
            'leyenda_local': {
                nombre: 'Leyendas Locales',
                descripcion: 'Descubre las criaturas más famosas de tu región',
                puntos: [
                    { id: 'punto_1', nombre: 'Centro Histórico', lat: 0, lng: 0 },
                    { id: 'punto_2', nombre: 'Puente Antiguo', lat: 0.05, lng: -0.05 },
                    { id: 'punto_3', nombre: 'Cementerio', lat: -0.1, lng: 0.05 }
                ],
                duracion: 21
            }
        };
        return rutas[idRuta];
    }
    
    /**
     * Obtiene mensaje de puntos según el tipo
     */
    obtenerMensajePuntos(tipo, cantidad) {
        const mensajes = {
            'avistamiento': `👁️ +${cantidad} puntos por avistamiento`,
            'fotografia': `📸 +${cantidad} puntos por fotografía`,
            'identificacion': `🔍 +${cantidad} puntos por identificación`,
            'exploracion': `🗺️ +${cantidad} puntos por exploración`,
            'colaboracion': `🤝 +${cantidad} puntos por colaboración`,
            'diario': `📝 +${cantidad} puntos por reporte`,
            'logros': `🏆 +${cantidad} puntos por logro`,
            'bonificaciones': `⭐ +${cantidad} puntos de bonificación`
        };
        return mensajes[tipo] || `⭐ +${cantidad} puntos`;
    }
    
    // ===============================
    // MÉTODOS DE CÁLCULO Y VALIDACIÓN
    // ===============================
    
    /**
     * Calcula recompensas disponibles basadas en nivel
     */
    calcularRecompensasDisponibles() {
        const recompensas = [];
        
        // Recompensas por nivel
        for (let nivel = this.perfil.nivel; nivel <= this.perfil.nivel + 10; nivel++) {
            const puntosRecompensa = nivel * 50;
            const experienciaRecompensa = nivel * 100;
            
            recompensas.push({
                tipo: 'nivel',
                valor: nivel,
                puntos: puntosRecompensa,
                experiencia: experienciaRecompensa,
                disponible: nivel <= this.perfil.nivel
            });
        }
        
        return recompensas;
    }
    
    /**
     * Cuenta elementos en la colección
     */
    contarElementosColeccion() {
        let total = 0;
        Object.values(this.coleccionTarjetas).forEach(tipo => {
            total += Object.keys(tipo).length;
        });
        return total;
    }
    
    /**
     * Obtiene total de elementos disponibles para colección
     */
    obtenerTotalElementosColeccion(tipo) {
        const totales = {
            'criaturas': 20,
            'zonas': 15,
            'logros': 25,
            'especiales': 10
        };
        return totales[tipo] || 0;
    }
    
    /**
     * Otorga recompensa por completar desafío
     */
    otorgarRecompensaDesafio(desafio) {
        if (desafio.recompensa.puntos) {
            this.perfil.puntosTotales += desafio.recompensa.puntos;
        }
        
        if (desafio.recompensa.tarjeta_especial) {
            this.agregarTarjetaColeccion('especiales', 'desafio_' + desafio.id, {
                raro: true,
                descripcion: 'Completar desafío: ' + desafio.nombre
            });
        }
        
        // Agregar al historial de recompensas
        this.recompensas.historial.push({
            fecha: new Date(),
            tipo: 'desafio',
            desafio: desafio.id,
            recompensa: desafio.recompensa
        });
    }
    
    /**
     * Inicializa estadísticas de desafío
     */
    inicializarEstadisticasDesafio(tipo) {
        const base = {
            inicio: new Date(),
            intentos: 0,
            exitosos: 0,
            tiempo: 0
        };
        
        switch (tipo) {
            case 'avistamiento':
                return { ...base, criaturasVistas: [], zonasVisitadas: [] };
            case 'fotografia':
                return { ...base, fotosTomadas: [], calidades: [] };
            case 'exploracion':
                return { ...base, zonasVisitadas: [], distancias: [] };
            case 'actividad':
                return { ...base, diasActivos: [], actividadesDiarias: [] };
            default:
                return base;
        }
    }
    
    /**
     * Actualiza estadísticas específicas del desafío
     */
    actualizarEstadisticasDesafio(desafio, detalles) {
        if (!desafio.estadisticas) return;
        
        desafio.estadisticas.intentos++;
        desafio.estadisticas.tiempo = new Date() - desafio.estadisticas.inicio;
        
        // Actualizar estadísticas específicas según el tipo
        switch (desafio.tipo) {
            case 'avistamiento':
                if (detalles.criatura) {
                    desafio.estadisticas.criaturasVistas.push(detalles.criatura);
                }
                if (detalles.zona) {
                    desafio.estadisticas.zonasVisitadas.push(detalles.zona);
                }
                break;
            case 'fotografia':
                if (detalles.calidad) {
                    desafio.estadisticas.calidades.push(detalles.calidad);
                }
                break;
        }
    }
    
    /**
     * Marca un desafío como vencido
     */
    marcaraDesafioVencido(idDesafio) {
        const desafio = this.desafios.activos.find(d => d.id === idDesafio);
        if (!desafio) return;
        
        // Mover a fallidos
        desafio.fechaVencimiento = new Date();
        this.desafios.fallidos.push(desafio);
        this.desafios.activos = this.desafios.activos.filter(d => d.id !== idDesafio);
        
        console.log(`⏰ Desafío vencido: ${desafio.nombre}`);
        this.guardarDatosUsuario();
    }
    
    /**
     * Verifica logros de desafíos
     */
    verificarLogrosDesafios() {
        const desafiosCompletados = this.desafios.completados.length;
        
        const logrosDesafios = [
            { id: 'desafiante_1', umbral: 1, nombre: 'Desafiante' },
            { id: 'desafiante_5', umbral: 5, nombre: 'Competidor' },
            { id: 'desafiante_10', umbral: 10, nombre: 'Maestro de Desafíos' },
            { id: 'desafiante_25', umbral: 25, nombre: 'Leyenda de Desafíos' }
        ];
        
        logrosDesafios.forEach(logro => {
            if (!this.logros[logro.id] && desafiosCompletados >= logro.umbral) {
                this.desbloquearLogro(logro.id, `Completar ${logro.umbral} desafíos`, {
                    puntos: logro.umbral * 25,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    /**
     * Verifica logros de colección
     */
    verificarLogrosColeccion() {
        const totalColeccion = this.contarElementosColeccion();
        
        const logrosColeccion = [
            { id: 'coleccionista_1', umbral: 1, nombre: 'Coleccionista' },
            { id: 'coleccionista_5', umbral: 5, nombre: 'Curador' },
            { id: 'coleccionista_10', umbral: 10, nombre: 'Maestro Coleccionista' },
            { id: 'coleccionista_25', umbral: 25, nombre: 'Guardián de la Colección' }
        ];
        
        logrosColeccion.forEach(logro => {
            if (!this.logros[logro.id] && totalColeccion >= logro.umbral) {
                this.desbloquearLogro(logro.id, `Obtener ${logro.umbral} tarjetas`, {
                    puntos: logro.umbral * 20,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    /**
     * Completa una ruta temática
     */
    completarRutaTematica(idRuta) {
        const ruta = this.rutasTematicas.activas.find(r => r.id === idRuta);
        if (!ruta) return;
        
        ruta.completada = true;
        ruta.fechaCompletada = new Date();
        
        // Mover a completadas
        this.rutasTematicas.completadas.push(ruta);
        this.rutasTematicas.activas = this.rutasTematicas.activas.filter(r => r.id !== idRuta);
        
        // Otorgar puntos y recompensas
        this.otorgarPuntos('exploracion', ruta.puntos.length * 25);
        this.agregarTarjetaColeccion('especiales', 'ruta_' + idRuta, {
            raro: true,
            descripcion: 'Completar ruta: ' + ruta.nombre
        });
        
        // Verificar logros de rutas
        this.verificarLogrosRutas();
        
        console.log(`🗺️ Ruta completada: ${ruta.nombre}`);
        this.guardarDatosUsuario();
    }
    
    /**
     * Verifica logros de rutas
     */
    verificarLogrosRutas() {
        const rutasCompletadas = this.rutasTematicas.completadas.length;
        
        const logrosRutas = [
            { id: 'explorador_ruta_1', umbral: 1, nombre: 'Explorador de Rutas' },
            { id: 'explorador_ruta_3', umbral: 3, nombre: 'Maestro Explorador' },
            { id: 'explorador_ruta_5', umbral: 5, nombre: 'Leyenda de las Rutas' }
        ];
        
        logrosRutas.forEach(logro => {
            if (!this.logros[logro.id] && rutasCompletadas >= logro.umbral) {
                this.desbloquearLogro(logro.id, `Completar ${logro.umbral} rutas`, {
                    puntos: logro.umbral * 100,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    // ===============================
    // MÉTODOS PÚBLICOS DE LA API
    // ===============================
    
    /**
     * API pública para obtener el estado completo del usuario
     */
    obtenerEstadoUsuario() {
        return {
            perfil: this.perfil,
            puntos: this.puntos,
            experiencia: this.obtenerExperienciaNivel(),
            logros: Object.values(this.logros),
            desafios: {
                activos: this.desafios.activos,
                completados: this.desafios.completados.length,
                progreso_activo: this.desafios.activos.map(d => ({
                    id: d.id,
                    nombre: d.nombre,
                    progreso: d.progreso,
                    configuracion: d.configuracion
                }))
            },
            coleccion: {
                total: this.contarElementosColeccion(),
                progreso: {
                    criaturas: this.obtenerProgresoColeccion('criaturas'),
                    zonas: this.obtenerProgresoColeccion('zonas'),
                    logros: this.obtenerProgresoColeccion('logros'),
                    especiales: this.obtenerProgresoColeccion('especiales')
                }
            },
            rutas: {
                activas: this.rutasTematicas.activas,
                completadas: this.rutasTematicas.completadas.length
            },
            rankings: this.rankings,
            configuracion: this.configuracionPersonal
        };
    }
    
    /**
     * API pública para registrar un evento del usuario
     */
    registrarEvento(tipo, datos = {}) {
        switch (tipo) {
            case 'avistamiento':
                this.procesarAvistamiento(datos);
                break;
            case 'fotografia':
                this.procesarFotografia(datos);
                break;
            case 'identificacion':
                this.procesarIdentificacion(datos);
                break;
            case 'exploracion':
                this.procesarExploracion(datos);
                break;
            case 'colaboracion':
                this.procesarColaboracion(datos);
                break;
            case 'actividad_diaria':
                this.procesarActividadDiaria(datos);
                break;
            default:
                console.warn(`Tipo de evento no reconocido: ${tipo}`);
        }
    }
    
    // ===============================
    // MÉTODOS DE PROCESAMIENTO DE EVENTOS
    // ===============================
    
    /**
     * Procesa evento de avistamiento
     */
    procesarAvistamiento(datos) {
        // Actualizar estadísticas
        this.estadisticas.totalAvistamientos++;
        this.perfil.avistamientosHoy++;
        
        // Otorgar puntos base
        this.otorgarPuntos('avistamiento', 25, {
            zona: datos.zona,
            criatura: datos.criatura,
            clima: datos.clima,
            primeraVez: !this.logros['primera_foto']
        });
        
        // Actualizar racha
        this.actualizarRacha();
        
        // Agregar tarjeta de criatura
        this.agregarTarjetaColeccion('criaturas', datos.criatura, {
            nombre: datos.nombreCriatura,
            calidad: datos.calidad || 'común'
        });
        
        // Actualizar desafíos activos
        this.desafios.activos.forEach(desafio => {
            if (desafio.tipo === 'avistamiento') {
                this.actualizarProgresoDesafio(desafio.id, 1, {
                    criatura: datos.criatura,
                    zona: datos.zona
                });
            }
        });
        
        console.log(`👁️ Avistamiento procesado: ${datos.criatura}`);
    }
    
    /**
     * Procesa evento de fotografía
     */
    procesarFotografia(datos) {
        this.estadisticas.fotosTomadas++;
        
        // Puntos base por fotografía
        let puntos = 15;
        if (datos.calidad === 'alta') {
            puntos = 25;
            this.estadisticas.fotosDeCalidadAlta++;
        }
        
        this.otorgarPuntos('fotografia', puntos, {
            calidadFoto: datos.calidad,
            criatura: datos.criatura
        });
        
        // Actualizar desafíos de fotografía
        this.desafios.activos.forEach(desafio => {
            if (desafio.tipo === 'fotografia') {
                this.actualizarProgresoDesafio(desafio.id, 1, {
                    calidad: datos.calidad,
                    criatura: datos.criatura
                });
            }
        });
        
        // Verificar logro de primera foto
        if (this.estadisticas.fotosTomadas === 1) {
            this.desbloquearLogro('primera_foto', 'Tomar tu primera fotografía mística');
        }
        
        console.log(`📸 Fotografía procesada: ${datos.criatura}`);
    }
    
    /**
     * Procesa evento de identificación
     */
    procesarIdentificacion(datos) {
        this.estadisticas.identificacionesCorrectas++;
        this.estadisticas.precisionIdentificacion = 
            Math.round((this.estadisticas.identificacionesCorrectas / 
            (this.estadisticas.identificacionesCorrectas + this.estadisticas.identificacionesIncorrectas)) * 100);
        
        this.otorgarPuntos('identificacion', 20, {
            correcta: datos.correcta,
            tiempo: datos.tiempo
        });
        
        // Actualizar desafíos de identificación
        this.desafios.activos.forEach(desafio => {
            if (desafio.tipo === 'identificacion') {
                this.actualizarProgresoDesafio(desafio.id, datos.correcta ? 1 : 0, {
                    correcta: datos.correcta,
                    criatura: datos.criatura
                });
            }
        });
        
        console.log(`🔍 Identificación procesada: ${datos.correcta ? 'Correcta' : 'Incorrecta'}`);
    }
    
    /**
     * Procesa evento de exploración
     */
    procesarExploracion(datos) {
        this.estadisticas.zonasVisitadas++;
        this.estadisticas.kilometrosRecorridos += datos.distancia || 0;
        
        this.otorgarPuntos('exploracion', 30, {
            zona: datos.zona,
            distancia: datos.distancia
        });
        
        // Agregar tarjeta de zona
        this.agregarTarjetaColeccion('zonas', datos.zona, {
            nombre: datos.nombreZona,
            primeraVez: true
        });
        
        // Actualizar desafíos de exploración
        this.desafios.activos.forEach(desafio => {
            if (desafio.tipo === 'exploracion') {
                this.actualizarProgresoDesafio(desafio.id, 1, {
                    zona: datos.zona
                });
            }
        });
        
        console.log(`🗺️ Exploración procesada: ${datos.zona}`);
    }
    
    /**
     * Procesa evento de colaboración
     */
    procesarColaboracion(datos) {
        this.estadisticas.comentariosPublicados++;
        this.estadisticas.ayudasBrindadas++;
        
        this.otorgarPuntos('colaboracion', 10, {
            tipo: datos.tipo,
            valoracion: datos.valoracion
        });
        
        console.log(`🤝 Colaboración procesada: ${datos.tipo}`);
    }
    
    /**
     * Procesa actividad diaria
     */
    procesarActividadDiaria(datos) {
        this.estadisticas.diasActivos++;
        this.actualizarRacha();
        
        this.otorgarPuntos('diario', 5);
        
        // Actualizar desafíos de actividad
        this.desafios.activos.forEach(desafio => {
            if (desafio.tipo === 'actividad') {
                this.actualizarProgresoDesafio(desafio.id, 1, {
                    tipo: 'actividad_diaria'
                });
            }
        });
        
        console.log(`📅 Actividad diaria procesada`);
    }
    
    /**
     * Actualiza la racha del usuario
     */
    actualizarRacha() {
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        
        if (this.perfil.fechaUltimoAvistamiento) {
            const fechaUltimo = new Date(this.perfil.fechaUltimoAvistamiento);
            
            // Si es el día siguiente, aumentar racha
            if (this.esMismoDia(fechaUltimo, ayer)) {
                this.perfil.racha++;
            }
            // Si es el mismo día, no cambiar
            else if (this.esMismoDia(fechaUltimo, hoy)) {
                // Ya registró hoy
            }
            // Si hay gap, resetear racha
            else {
                this.perfil.racha = 1;
            }
        } else {
            // Primera vez
            this.perfil.racha = 1;
        }
        
        // Actualizar estadísticas de mayor racha
        if (this.perfil.racha > this.estadisticas.mayorRacha) {
            this.estadisticas.mayorRacha = this.perfil.racha;
        }
        
        this.perfil.fechaUltimoAvistamiento = hoy;
        
        // Verificar logros de racha
        this.verificarLogrosRacha();
    }
    
    /**
     * Verifica si dos fechas son el mismo día
     */
    esMismoDia(fecha1, fecha2) {
        return fecha1.getDate() === fecha2.getDate() &&
               fecha1.getMonth() === fecha2.getMonth() &&
               fecha1.getFullYear() === fecha2.getFullYear();
    }
    
    /**
     * Verifica logros de racha
     */
    verificarLogrosRacha() {
        const logrosRacha = [
            { id: 'racha_3', umbral: 3, nombre: 'Constante' },
            { id: 'racha_7', umbral: 7, nombre: 'Dedicado' },
            { id: 'racha_14', umbral: 14, nombre: 'Perseverante' },
            { id: 'racha_30', umbral: 30, nombre: 'Leyenda de la Constancia' }
        ];
        
        logrosRacha.forEach(logro => {
            if (!this.logros[logro.id] && this.perfil.racha >= logro.umbral) {
                this.desbloquearLogro(logro.id, `Mantener una racha de ${logro.umbral} días`, {
                    puntos: logro.umbral * 15,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    // ===============================
    // MÉTODOS DE CONFIGURACIÓN AVANZADA
    // ===============================
    
    /**
     * Actualiza configuración personal
     */
    actualizarConfiguracion(nuevaConfiguracion) {
        this.configuracionPersonal = {
            ...this.configuracionPersonal,
            ...nuevaConfiguracion
        };
        this.guardarDatosUsuario();
    }
    
    /**
     * Resetea estadísticas del usuario (para testing)
     */
    resetearEstadisticas() {
        if (confirm('¿Estás seguro de que quieres resetear todas las estadísticas de gamificación?')) {
            this.perfil = {
                ...this.perfil,
                nivel: 1,
                experiencia: 0,
                puntosTotales: 0,
                racha: 0
            };
            
            this.logros = {};
            this.desafios = { activos: [], completados: [], fallidos: [] };
            this.coleccionTarjetas = { criaturas: {}, zonas: {}, logros: {}, especiales: {} };
            this.rutasTematicas = { activas: [], completadas: [], progresos: {} };
            
            this.guardarDatosUsuario();
            console.log('🔄 Estadísticas de gamificación reseteadas');
        }
    }
    
    /**
     * Exporta datos del usuario para backup
     */
    exportarDatos() {
        const datosExportacion = {
            version: '1.0.0',
            fechaExportacion: new Date(),
            usuarioId: this.config.usuarioId,
            datos: {
                perfil: this.perfil,
                puntos: this.puntos,
                logros: this.logros,
                desafios: this.desafios,
                coleccionTarjetas: this.coleccionTarjetas,
                rutasTematicas: this.rutasTematicas,
                configuracionPersonal: this.configuracionPersonal,
                estadisticas: this.estadisticas
            }
        };
        
        return JSON.stringify(datosExportacion, null, 2);
    }
    
    /**
     * Importa datos del usuario desde backup
     */
    importarDatos(jsonDatos) {
        try {
            const datos = JSON.parse(jsonDatos);
            
            if (datos.datos && datos.version === '1.0.0') {
                this.perfil = { ...this.perfil, ...datos.datos.perfil };
                this.puntos = { ...this.puntos, ...datos.datos.puntos };
                this.logros = datos.datos.logros || {};
                this.desafios = { ...this.desafios, ...datos.datos.desafios };
                this.coleccionTarjetas = { ...this.coleccionTarjetas, ...datos.datos.coleccionTarjetas };
                this.rutasTematicas = { ...this.rutasTematicas, ...datos.datos.rutasTematicas };
                this.configuracionPersonal = { ...this.configuracionPersonal, ...datos.datos.configuracionPersonal };
                this.estadisticas = { ...this.estadisticas, ...datos.datos.estadisticas };
                
                this.guardarDatosUsuario();
                console.log('📥 Datos de gamificación importados exitosamente');
                return true;
            } else {
                console.error('Formato de datos inválido');
                return false;
            }
        } catch (error) {
            console.error('Error importando datos:', error);
            return false;
        }
    }
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.MotorGamificacionUrukais = MotorGamificacionUrukais;
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MotorGamificacionUrukais;
}