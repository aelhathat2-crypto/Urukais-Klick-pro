/**
 * SISTEMA DE DESAFÍOS Y COMPETENCIAS URUKAIS KLICK
 * Motor avanzado para desafíos, competencias y eventos especiales
 * 
 * Funcionalidades:
 * - Catálogo completo de desafíos
 * - Competencias por equipos y individuales
 * - Eventos especiales temporales
 * - Sistema de recompensas dinámicas
 * - Ranking de competencias
 * - Desafíos comunitarios
 * - Modo cooperativo y competitivo
 * 
 * @author MiniMax Agent
 * @version 1.0.0
 * @date 2025-11-16
 */

class SistemaDesafiosUrukais {
    constructor(motorGamificacion, opciones = {}) {
        this.motor = motorGamificacion;
        this.opciones = {
            habilitarCompetencias: opciones.habilitarCompetencias !== false,
            habilitarEventos: opciones.habilitarEventos !== false,
            habilitarEquipos: opciones.habilitarEquipos !== false,
            eventosAutomaticos: opciones.eventosAutomaticos !== false,
            dificultadAdaptativa: opciones.dificultadAdaptativa !== false,
            idioma: opciones.idioma || 'es'
        };
        
        // Sistemas principales
        this.desafiosPersonalizados = {};
        this.competenciasActivas = {};
        this.eventosEspeciales = {};
        this.equipos = {};
        this.historialDesafios = [];
        
        // Configuración de dificultad
        this.configuracionDificultad = {
            adaptativa: this.opciones.dificultadAdaptativa,
            nivelUsuario: this.motor?.perfil?.nivel || 1,
            preferenciaDificultad: 'normal', // facil, normal, difícil, extremo
            historialExitosos: [],
            historialFallidos: []
        };
        
        // Generadores y templates
        this.templatesDesafios = this.inicializarTemplates();
        this.eventosEspecialesDisponibles = this.inicializarEventosEspeciales();
        this.tiposCompetencias = this.inicializarTiposCompetencias();
        
        // Inicializar sistema
        this.cargarDatosGuardados();
        this.configurarEventListeners();
        
        // Eventos automáticos si están habilitados
        if (this.opciones.eventosAutomaticos) {
            this.iniciarEventosAutomaticos();
        }
        
        console.log('🎯 Sistema de Desafíos y Competencias inicializado');
    }
    
    // ===============================
    // TEMPLATES Y CONFIGURACIÓN INICIAL
    // ===============================
    
    /**
     * Inicializa los templates de desafíos
     */
    inicializarTemplates() {
        return {
            // Desafíos Individuales
            'avistamiento_basico': {
                nombre: 'Primer Encuentro',
                descripcion: 'Realiza tu primer avistamiento de una criatura mística',
                tipo: 'individual',
                categoria: 'avistamiento',
                configuracion: {
                    objetivo: 1,
                    criaturasElegibles: ['fantasma', 'dragon', 'vampiro', 'hombre_lobo'],
                    zonasElegibles: [],
                    horario: null,
                    clima: null
                },
                dificultad: 'facil',
                duracion: { tipo: 'dias', valor: 7 },
                recompensa: {
                    puntos: 100,
                    titulo: 'Explorador Novato',
                    tarjeta_especial: true
                },
                requisitos: {
                    nivel: 1,
                    experiencia: 0
                }
            },
            
            'fotografo_serie': {
                nombre: 'Serie Fotográfica',
                descripcion: 'Toma 15 fotos de alta calidad de diferentes criaturas',
                tipo: 'individual',
                categoria: 'fotografia',
                configuracion: {
                    objetivo: 15,
                    calidadMinima: 'alta',
                    criaturasDiferentes: true,
                    zonasDiferentes: false
                },
                dificultad: 'normal',
                duracion: { tipo: 'dias', valor: 14 },
                recompensa: {
                    puntos: 300,
                    titulo: 'Fotógrafo Místico',
                    creditos_camara: 5
                },
                requisitos: {
                    nivel: 5,
                    experiencia: 500
                }
            },
            
            'explorador_zona': {
                nombre: 'Explorador de Territorios',
                descripcion: 'Visita 8 zonas diferentes y documenta la actividad mística',
                tipo: 'individual',
                categoria: 'exploracion',
                configuracion: {
                    objetivo: 8,
                    zonasElegibles: [],
                    actividadesRequeridas: ['avistamiento', 'fotografia'],
                    tiempoMinimoZona: 10 // minutos
                },
                dificultad: 'normal',
                duracion: { tipo: 'dias', valor: 21 },
                recompensa: {
                    puntos: 500,
                    titulo: 'Explorador Místico',
                    mapa_zonas: true
                },
                requisitos: {
                    nivel: 8,
                    experiencia: 800
                }
            },
            
            'identificador_experto': {
                nombre: 'Identificador Experto',
                descripcion: 'Realiza 25 identificaciones correctas consecutivas',
                tipo: 'individual',
                categoria: 'identificacion',
                configuracion: {
                    objetivo: 25,
                    precisionMinima: 90,
                    errorMaximo: 0,
                    tiempoMaximoIdentificacion: 300 // segundos
                },
                dificultad: 'dificil',
                duracion: { tipo: 'dias', valor: 10 },
                recompensa: {
                    puntos: 750,
                    titulo: 'Identificador Experto',
                    acceso_premium: 7 // días
                },
                requisitos: {
                    nivel: 15,
                    experiencia: 1500
                }
            },
            
            'racha_explorador': {
                nombre: 'Leyenda de la Constancia',
                descripcion: 'Mantén una racha de 30 días con actividad diaria',
                tipo: 'individual',
                categoria: 'persistencia',
                configuracion: {
                    objetivo: 30,
                    actividadMinima: 'avistamiento',
                    diasConsecutivos: true
                },
                dificultad: 'extremo',
                duracion: { tipo: 'dias', valor: 30 },
                recompensa: {
                    puntos: 1500,
                    titulo: 'Leyenda de la Constancia',
                    status_especial: true,
                    acceso_permanente: 'premium'
                },
                requisitos: {
                    nivel: 20,
                    experiencia: 2500
                }
            },
            
            // Desafíos de Fotografía
            'fotografia_nocturna': {
                nombre: 'Cazador Nocturno',
                descripcion: 'Toma 5 fotos excepcionales durante las horas nocturnas',
                tipo: 'individual',
                categoria: 'fotografia_especial',
                configuracion: {
                    objetivo: 5,
                    horario: { inicio: 20, fin: 6 },
                    calidad: 'excepcional',
                    criaturas: ['fantasma', 'vampiro', 'bruja_nocturna']
                },
                dificultad: 'dificil',
                duracion: { tipo: 'dias', valor: 7 },
                recompensa: {
                    puntos: 600,
                    titulo: 'Cazador Nocturno',
                    filtros_especiales: ['nocturno', 'misterioso']
                },
                requisitos: {
                    nivel: 10,
                    experiencia: 1000
                }
            },
            
            'fotografia_climatica': {
                nombre: 'Momentos Místicos',
                descripcion: 'Captura 8 fotos durante fenómenos climáticos especiales',
                tipo: 'individual',
                categoria: 'fotografia_especial',
                configuracion: {
                    objetivo: 8,
                    climaElegible: ['niebla', 'tormenta', 'lluvia_intensa'],
                    calidad: 'alta',
                    criaturas: ['dragon_tormenta', 'bruja_lluvia']
                },
                dificultad: 'normal',
                duracion: { tipo: 'dias', valor: 14 },
                recompensa: {
                    puntos: 400,
                    titulo: 'Cazador de Momentos',
                    prediccion_climatica: 3 // usos
                },
                requisitos: {
                    nivel: 6,
                    experiencia: 600
                }
            },
            
            // Desafíos Colaborativos
            'caza_comunitaria': {
                nombre: 'Caza Comunitaria',
                descripcion: 'Colabora con otros exploradores para avistar 50 criaturas en total',
                tipo: 'comunitario',
                categoria: 'colaboracion',
                configuracion: {
                    objetivo: 50,
                    participantesMinimos: 5,
                    colaboradoresRequeridos: 3,
                    tiempoLimite: 168 // horas
                },
                dificultad: 'normal',
                duracion: { tipo: 'horas', valor: 72 },
                recompensa: {
                    puntos: 800,
                    titulo: 'Colaborador Comunitario',
                    badge_especial: 'cazador_comunitario'
                },
                requisitos: {
                    nivel: 8,
                    experiencia: 800
                }
            },
            
            'evento_regional': {
                nombre: 'Evento Regional',
                descripcion: 'Participa en el evento especial de tu región',
                tipo: 'regional',
                categoria: 'evento_especial',
                configuracion: {
                    objetivo: 25,
                    regionElegible: 'automática',
                    criaturasEventos: [],
                    actividadesVariadas: true
                },
                dificultad: 'adaptativa',
                duracion: { tipo: 'dias', valor: 7 },
                recompensa: {
                    puntos: 600,
                    titulo: 'Participante del Evento',
                    item_exclusivo: true
                },
                requisitos: {
                    nivel: 5,
                    experiencia: 400
                }
            },
            
            // Desafíos de Tiempo
            'sprint_exploracion': {
                nombre: 'Sprint de Exploración',
                descripcion: 'Completa 12 actividades en 24 horas',
                tipo: 'tiempo_limitado',
                categoria: 'velocidad',
                configuracion: {
                    objetivo: 12,
                    actividadesVariadas: true,
                    tiempoLimite: 24,
                    descansoMinimo: 0
                },
                dificultad: 'dificil',
                duracion: { tipo: 'horas', valor: 24 },
                recompensa: {
                    puntos: 500,
                    titulo: 'Sprinter Místico',
                    multiplicador_bonus: 1.5
                },
                requisitos: {
                    nivel: 12,
                    experiencia: 1200
                }
            },
            
            'maraton_fotografia': {
                nombre: 'Maratón Fotográfico',
                descripcion: 'Toma 50 fotos de calidad durante un fin de semana',
                tipo: 'tiempo_limitado',
                categoria: 'fotografia_maraton',
                configuracion: {
                    objetivo: 50,
                    finDeSemana: true,
                    calidadMinima: 'buena',
                    variedadCriaturas: 10
                },
                dificultad: 'normal',
                duracion: { tipo: 'horas', valor: 48 },
                recompensa: {
                    puntos: 700,
                    titulo: 'Maratonista Fotográfico',
                    creditos_tardos: 10
                },
                requisitos: {
                    nivel: 10,
                    experiencia: 1000
                }
            },
            
            // Desafíos de Colección
            'maestro_coleccionista': {
                nombre: 'Maestro Coleccionista',
                descripcion: 'Colecciona 30 tarjetas diferentes de criaturas y zonas',
                tipo: 'coleccion',
                categoria: 'coleccion',
                configuracion: {
                    objetivo: 30,
                    categorias: ['criaturas', 'zonas', 'logros'],
                    tarjetasDiferentes: true,
                    calidadMinima: 'comun'
                },
                dificultad: 'dificil',
                duracion: { tipo: 'dias', valor: 30 },
                recompensa: {
                    puntos: 1000,
                    titulo: 'Maestro Coleccionista',
                    album_ilimitado: true
                },
                requisitos: {
                    nivel: 15,
                    experiencia: 1500
                }
            },
            
            'cazador_raro': {
                nombre: 'Cazador de Especies Raras',
                descripcion: 'Encuentra y documenta 5 criaturas legendarias',
                tipo: 'coleccion_especial',
                categoria: 'criaturas_raras',
                configuracion: {
                    objetivo: 5,
                    criaturasRaras: ['dragon_antiguo', 'fantasma_ancestral', 'vampiro_principe'],
                    calidad: 'excepcional',
                    pruebasAdicionales: true
                },
                dificultad: 'extremo',
                duracion: { tipo: 'dias', valor: 60 },
                recompensa: {
                    puntos: 2000,
                    titulo: 'Cazador de Leyendas',
                    reconocimiento_oficial: true
                },
                requisitos: {
                    nivel: 25,
                    experiencia: 3000
                }
            }
        };
    }
    
    /**
     * Inicializa eventos especiales disponibles
     */
    inicializarEventosEspeciales() {
        return {
            'noche_de_halloween': {
                nombre: 'Noche de Halloween',
                descripcion: 'Evento especial durante Halloween con criaturas exclusivas',
                fechaInicio: '2025-10-31',
                fechaFin: '2025-11-01',
                tipo: 'estacional',
                criaturasExclusivas: ['fantasma_halloween', 'vampiro_count', 'bruja_halloween'],
                zonasEspeciales: ['cementerio_halloween', 'calabaza_mistica'],
                multiplicadorPuntos: 2.0,
                desafiosExclusivos: ['caza_fantasmas_halloween', 'maraton_brujas'],
                recompensasEspeciales: ['traje_halloween', 'filtro_fantasma']
            },
            
            'luna_llena_mistica': {
                nombre: 'Luna Llena Mística',
                descripcion: 'Durante la luna llena, las criaturas místicas son más activas',
                fechaInicio: '2025-11-15',
                fechaFin: '2025-11-16',
                tipo: 'astronomico',
                criaturaBonus: 'hombre_lobo',
                multiplicadorActividad: 1.5,
                zonasActivas: ['bosque_llena', 'montana_llena'],
                desafiosExclusivos: ['lobo_de_luna'],
                recompensasEspeciales: ['amuleto_lunar']
            },
            
            'semana_de_los_fantasmas': {
                nombre: 'Semana de los Fantasmas',
                descripcion: 'Una semana dedicada a los fantasmas y entidades espectrales',
                fechaInicio: '2025-11-01',
                fechaFin: '2025-11-07',
                tipo: 'tematico',
                criaturaPrincipal: 'fantasma',
                multiplicadorPuntosFantasmas: 3.0,
                zonasEspeciales: ['casa_embrujada', 'escuela_abandonada'],
                desafiosExclusivos: ['conversacion_fantasma', 'historia_familiar'],
                recompensasEspeciales: ['medidor_actividad_espectral']
            },
            
            'festival_dragones': {
                nombre: 'Festival de Dragones',
                descripcion: 'Dragones de todo el mundo se reúnen para mostrar su poder',
                fechaInicio: '2025-06-21',
                fechaFin: '2025-06-23',
                tipo: 'fantasia',
                criaturaPrincipal: 'dragon',
                multiplicadorPuntosDragones: 2.5,
                zonasEspeciales: ['montana_dragon', 'cueva_tesoros'],
                desafiosExclusivos: ['domador_dragones', 'coleccionador_escamas'],
                recompensasEspeciales: ['dragon_mascota', 'montura_dragón']
            },
            
            'equinoccio_primavera': {
                nombre: 'Equinoccio de Primavera',
                descripcion: 'El equinoccio despierta la magia más antigua',
                fechaInicio: '2025-03-20',
                fechaFin: '2025-03-22',
                tipo: 'astronomico',
                elementoPrincipal: 'naturaleza',
                multiplicadorMagia: 1.8,
                criaturasDespertadas: ['dryade', 'unicornio', 'fenix'],
                zonasRenovadas: ['jardines_antiguos', 'bosque_primordial'],
                desafiosExclusivos: ['renacimiento_natural'],
                recompensasEspeciales: ['semilla_mistica']
            },
            
            'tormenta_electrica': {
                nombre: 'Tormenta Eléctrica',
                descripcion: 'Una tormenta mágica activa criaturas eléctricas',
                fechaInicio: 'variable',
                fechaFin: 'variable',
                tipo: 'climatico',
                elementoPrincipal: 'electrico',
                criaturaActiva: 'dragon_electrico',
                multiplicadorTormenta: 2.0,
                zonasElectrizadas: ['cielo_tormenta', 'laboratorio_magic'],
                desafiosExclusivos: ['capturador_rayos'],
                recompensasEspeciales: ['baston_electrico']
            }
        };
    }
    
    /**
     * Inicializa tipos de competencias
     */
    inicializarTiposCompetencias() {
        return {
            'individual_sprint': {
                nombre: 'Sprint Individual',
                descripcion: 'Competencia individual de 24 horas',
                duracion: { tipo: 'horas', valor: 24 },
                participantesMaximos: 100,
                tipoRanking: 'puntuacion',
                reglas: {
                    objetivoPuntuacion: 1000,
                    perdidaPenalizacion: -100,
                    bonusTiempo: true
                },
                recompensas: {
                    primerLugar: { puntos: 500, titulo: 'Sprint Champion' },
                    topTres: { puntos: 300, titulo: 'Finalista Sprint' },
                    participacion: { puntos: 100 }
                }
            },
            
            'equipos_regionales': {
                nombre: 'Competencia Regional',
                descripcion: 'Equipos de diferentes regiones compiten',
                duracion: { tipo: 'dias', valor: 7 },
                participantesMinimos: 10,
                equipoMaximo: 5,
                regiones: ['norte', 'sur', 'este', 'oeste', 'centro'],
                tipoRanking: 'regional',
                reglas: {
                    avistamientosRegionales: true,
                    colaboracionEquipos: true,
                    bonusRegion: true
                },
                recompensas: {
                    equipoGanador: { puntos: 1000, titulo: 'Campeón Regional' },
                    segundoLugar: { puntos: 750 },
                    tercerLugar: { puntos: 500 }
                }
            },
            
            'maraton_mensual': {
                nombre: 'Maratón Mensual',
                descripcion: 'Competencia de todo el mes',
                duracion: { tipo: 'dias', valor: 30 },
                participantesMaximos: 500,
                tipoRanking: 'puntuacion',
                reglas: {
                    objetivoPuntuacion: 10000,
                    categoriasMultiples: true,
                    bonusConsistencia: true
                },
                recompensas: {
                    primerLugar: { puntos: 2000, titulo: 'Maratonista Legend' },
                    topDiez: { puntos: 1000, badge: 'top_ten' },
                    participacion: { puntos: 500 }
                }
            },
            
            'especializacion_criaturas': {
                nombre: 'Especialista en Criaturas',
                descripcion: 'Competencia enfocada en una criatura específica',
                duracion: { tipo: 'dias', valor: 14 },
                participantesMaximos: 200,
                criaturaEspecializada: 'variable',
                tipoRanking: 'especializacion',
                reglas: {
                    criaturaEspecifica: true,
                    calidadDocumentacion: true,
                    historiasAsociadas: true
                },
                recompensas: {
                    especialista: { puntos: 1500, titulo: 'Especialista' },
                    experto: { puntos: 1000 },
                    novato: { puntos: 500 }
                }
            },
            
            'cooperativo_comunitario': {
                nombre: 'Misión Cooperativa',
                descripcion: 'Toda la comunidad debe completar un objetivo conjunto',
                duracion: { tipo: 'dias', valor: 14 },
                participantesMaximos: 'ilimitado',
                objetivoGlobal: 'avistamientos_totales',
                tipoRanking: 'comunitario',
                reglas: {
                    objetivoComunitario: true,
                    colaboracionGlobal: true,
                    progresoCompartido: true
                },
                recompensas: {
                    objetivoAlcanzado: { puntos: 500, titulo: 'Colaborador Global' },
                    contribuciones: { puntos: 200 },
                    participacion: { puntos: 100 }
                }
            }
        };
    }
    
    // ===============================
    // GESTIÓN DE DESAFÍOS
    // ===============================
    
    /**
     * Obtiene desafíos disponibles para el usuario
     */
    obtenerDesafiosDisponibles() {
        const desafiosDisponibles = [];
        const perfilUsuario = this.motor.perfil;
        
        Object.entries(this.templatesDesafios).forEach(([id, template]) => {
            if (this.cumpleRequisitos(template.requisitos, perfilUsuario)) {
                // Verificar si ya está activo o completado
                if (!this.estaDesafioActivo(id) && !this.estaDesafioCompletado(id)) {
                    desafiosDisponibles.push({
                        id: id,
                        ...template,
                        disponible: true,
                        dificultadPersonalizada: this.calcularDificultadPersonalizada(template, perfilUsuario)
                    });
                }
            }
        });
        
        return desafiosDisponibles.sort((a, b) => {
            // Ordenar por dificultad y requisitos
            const ordenDificultad = { facil: 1, normal: 2, dificil: 3, extremo: 4 };
            return ordenDificultad[a.dificultad] - ordenDificultad[b.dificultad];
        });
    }
    
    /**
     * Verifica si el usuario cumple los requisitos
     */
    cumpleRequisitos(requisitos, perfil) {
        if (!requisitos) return true;
        
        if (requisitos.nivel && perfil.nivel < requisitos.nivel) return false;
        if (requisitos.experiencia && perfil.experiencia < requisitos.experiencia) return false;
        if (requisitos.puntos && perfil.puntosTotales < requisitos.puntos) return false;
        if (requisitos.logros) {
            const logrosRequeridos = Array.isArray(requisitos.logros) ? requisitos.logos : [requisitos.logros];
            for (const logro of logrosRequeridos) {
                if (!this.motor.logros[logro]) return false;
            }
        }
        
        return true;
    }
    
    /**
     * Activa un desafío personalizado
     */
    activarDesafio(idTemplate, configuracionPersonalizada = {}) {
        const template = this.templatesDesafios[idTemplate];
        if (!template) return null;
        
        // Verificar requisitos
        if (!this.cumpleRequisitos(template.requisitos, this.motor.perfil)) {
            console.warn(`No cumple requisitos para el desafío ${idTemplate}`);
            return null;
        }
        
        // Crear instancia del desafío
        const desafio = {
            id: this.generarIdDesafio(),
            templateId: idTemplate,
            nombre: template.nombre,
            descripcion: template.descripcion,
            tipo: template.tipo,
            categoria: template.categoria,
            
            // Configuración base del template
            configuracionBase: template.configuracion,
            configuracionPersonalizada: configuracionPersonalizada,
            
            // Configuración resuelta
            configuracion: this.resolverConfiguracion(template.configuracion, configuracionPersonalizada),
            
            // Estado del desafío
            fechaInicio: new Date(),
            fechaLimite: this.calcularFechaLimite(template.duracion),
            progreso: 0,
            completado: false,
            fallido: false,
            pausado: false,
            
            // Estadísticas y tracking
            estadisticas: this.inicializarEstadisticasDesafio(template.categoria),
            historialProgreso: [],
            intentos: 0,
            
            // Recompensas
            recompensa: this.calcularRecompensaPersonalizada(template.recompensa),
            
            // Metadatos
            dificultad: template.dificultad,
            eventoEspecial: this.obtenerEventoEspecialActivo(),
            usuarioId: this.motor.config.usuarioId,
            nivelUsuarioInicio: this.motor.perfil.nivel
        };
        
        // Agregar a desafíos activos del motor
        this.motor.desafios.activos.push(desafio);
        this.motor.guardarDatosUsuario();
        
        // Verificar si es parte de una competencia
        if (this.opciones.habilitarCompetencias && this.estaEnCompetenciaActiva()) {
            this.registrarEnCompetencia(desafio);
        }
        
        console.log(`🎯 Desafío activado: ${desafio.nombre}`);
        return desafio;
    }
    
    /**
     * Resuelve la configuración base y personalizada
     */
    resolverConfiguracion(configuracionBase, configuracionPersonalizada) {
        const configuracion = { ...configuracionBase };
        
        // Fusionar configuraciones
        Object.keys(configuracionPersonalizada).forEach(key => {
            if (typeof configuracionPersonalizada[key] === 'object' && !Array.isArray(configuracionPersonalizada[key])) {
                configuracion[key] = { ...configuracion[key], ...configuracionPersonalizada[key] };
            } else {
                configuracion[key] = configuracionPersonalizada[key];
            }
        });
        
        // Aplicar ajustes de dificultad adaptativa
        if (this.opciones.dificultadAdaptativa) {
            configuracion = this.aplicarDificultadAdaptativa(configuracion);
        }
        
        return configuracion;
    }
    
    /**
     * Calcula la dificultad personalizada basada en el historial del usuario
     */
    calcularDificultadPersonalizada(template, perfil) {
        if (!this.opciones.dificultadAdaptativa) return template.dificultad;
        
        // Obtener estadísticas del usuario para esta categoría
        const estadisticasCategoria = this.obtenerEstadisticasCategoria(template.categoria);
        const exito = estadisticasCategoria.exito || 0;
        const intentos = estadisticasCategoria.intentos || 0;
        
        if (intentos === 0) return template.dificultad;
        
        const tasaExito = exito / intentos;
        const diferenciaNivel = perfil.nivel - (template.requisitos?.nivel || 1);
        
        // Ajustar dificultad basada en rendimiento
        if (tasaExito > 0.8 && diferenciaNivel >= 5) {
            return this.incrementarDificultad(template.dificultad);
        } else if (tasaExito < 0.3 || diferenciaNivel < 0) {
            return this.decrementarDificultad(template.dificultad);
        }
        
        return template.dificultad;
    }
    
    /**
     * Incrementa la dificultad en un nivel
     */
    incrementarDificultad(dificultadActual) {
        const orden = { facil: 'normal', normal: 'dificil', dificil: 'extremo', extremo: 'extremo' };
        return orden[dificultadActual] || dificultadActual;
    }
    
    /**
     * Decrementa la dificultad en un nivel
     */
    decrementarDificultad(dificultadActual) {
        const orden = { extremo: 'dificil', dificil: 'normal', normal: 'facil', facil: 'facil' };
        return orden[dificultadActual] || dificultadActual;
    }
    
    /**
     * Aplica ajustes de dificultad adaptativa
     */
    aplicarDificultadAdaptativa(configuracion) {
        const historial = this.configuracionDificultad.historialExitosos;
        const nivelDificultad = this.configuracionDificultad.preferenciaDificultad;
        
        // Ajustar objetivo basado en rendimiento reciente
        if (historial.length >= 3) {
            const exitoReciente = historial.slice(-3).every(h => h.exito);
            if (exitoReciente && nivelDificultad !== 'extremo') {
                configuracion.objetivo = Math.ceil(configuracion.objetivo * 1.2);
            } else if (!exitoReciente && nivelDificultad !== 'facil') {
                configuracion.objetivo = Math.ceil(configuracion.objetivo * 0.8);
            }
        }
        
        return configuracion;
    }
    
    /**
     * Actualiza el progreso de un desafío
     */
    actualizarProgresoDesafio(idDesafio, incremento = 1, datosEvento = {}) {
        const desafio = this.motor.desafios.activos.find(d => d.id === idDesafio);
        if (!desafio || desafio.completado || desafio.fallido) return false;
        
        // Verificar si está dentro del tiempo límite
        if (new Date() > desafio.fechaLimite) {
            this.marcaraDesafioVencido(idDesafio);
            return false;
        }
        
        // Verificar si el evento es válido para este desafío
        if (!this.validarEventoParaDesafio(datosEvento, desafio)) {
            return false;
        }
        
        // Actualizar progreso
        desafio.progreso += incremento;
        desafio.intentos++;
        desafio.fechaUltimaActividad = new Date();
        
        // Actualizar estadísticas específicas
        this.actualizarEstadisticasDesafio(desafio, datosEvento);
        
        // Agregar al historial
        desafio.historialProgreso.push({
            fecha: new Date(),
            incremento: incremento,
            progresoTotal: desafio.progreso,
            evento: datosEvento
        });
        
        // Verificar si está completado
        if (desafio.progreso >= desafio.configuracion.objetivo) {
            this.completarDesafio(idDesafio);
        }
        
        // Actualizar motor de gamificación
        this.motor.guardarDatosUsuario();
        
        console.log(`📈 Progreso actualizado: ${desafio.nombre} - ${desafio.progreso}/${desafio.configuracion.objetivo}`);
        return true;
    }
    
    /**
     * Valida si un evento es válido para un desafío específico
     */
    validarEventoParaDesafio(datosEvento, desafio) {
        const config = desafio.configuracion;
        
        // Validar criatura
        if (config.criaturasElegibles && config.criaturasElegibles.length > 0) {
            if (!config.criaturasElegibles.includes(datosEvento.criatura)) {
                return false;
            }
        }
        
        // Validar zona
        if (config.zonasElegibles && config.zonasElegibles.length > 0) {
            if (!config.zonasElegibles.includes(datosEvento.zona)) {
                return false;
            }
        }
        
        // Validar horario
        if (config.horario) {
            const hora = new Date().getHours();
            if (hora < config.horario.inicio || hora > config.horario.fin) {
                return false;
            }
        }
        
        // Validar clima
        if (config.clima && datosEvento.clima) {
            if (!Array.isArray(config.clima) ? config.clima !== datosEvento.clima : !config.clima.includes(datosEvento.clima)) {
                return false;
            }
        }
        
        // Validar calidad
        if (config.calidadMinima && datosEvento.calidad) {
            const ordenCalidad = { mala: 1, baja: 2, buena: 3, alta: 4, excelente: 5 };
            if (ordenCalidad[datosEvento.calidad] < ordenCalidad[config.calidadMinima]) {
                return false;
            }
        }
        
        // Validar que sea diferente para desafíos que lo requieren
        if (config.criaturasDiferentes && desafio.estadisticas.criaturasVistas) {
            if (desafio.estadisticas.criaturasVistas.includes(datosEvento.criatura)) {
                return false;
            }
        }
        
        return true;
    }
    
    // ===============================
    // SISTEMA DE COMPETENCIAS
    // ===============================
    
    /**
     * Inicia una nueva competencia
     */
    iniciarCompetencia(idTipo, configuracion = {}) {
        const tipo = this.tiposCompetencias[idTipo];
        if (!tipo) return null;
        
        // Verificar si ya hay una competencia activa
        if (this.estaCompetenciaActiva()) {
            console.warn('Ya hay una competencia activa');
            return null;
        }
        
        const competencia = {
            id: this.generarIdCompetencia(),
            tipo: idTipo,
            nombre: tipo.nombre,
            descripcion: tipo.descripcion,
            
            // Configuración
            configuracion: { ...tipo, ...configuracion },
            
            // Estado
            estado: 'preparacion', // preparacion, activa, finalizada
            fechaInicio: null,
            fechaFin: null,
            participantes: [],
            equipos: [],
            
            // Rankings y puntuaciones
            puntuaciones: {},
            ranking: [],
            ganador: null,
            
            // Estadísticas
            estadisticas: this.inicializarEstadisticasCompetencia(),
            
            // Recompensas
            recompensas: tipo.recompensas
        };
        
        this.competenciasActivas[competencia.id] = competencia;
        
        console.log(`🏆 Competencia iniciada: ${competencia.nombre}`);
        return competencia;
    }
    
    /**
     * Registra un usuario en una competencia
     */
    registrarEnCompetencia(idCompetencia, datosUsuario = {}) {
        const competencia = this.competenciasActivas[idCompetencia];
        if (!competencia || competencia.estado !== 'preparacion') return false;
        
        const usuario = {
            id: this.motor.config.usuarioId,
            nombre: datosUsuario.nombre || 'Explorador Anónimo',
            fechaRegistro: new Date(),
            desafios: [],
            puntuacion: 0,
            estadisticas: {
                actividadesCompletadas: 0,
                puntosObtenidos: 0,
                tiempoActivo: 0,
                rango: 'novato'
            },
            equipo: datosUsuario.equipo || null
        };
        
        competencia.participantes.push(usuario);
        competencia.puntuaciones[usuario.id] = 0;
        
        console.log(`👤 Usuario registrado en competencia: ${competencia.nombre}`);
        return true;
    }
    
    /**
     * Inicia una competencia
     */
    iniciarCompetenciaActiva(idCompetencia) {
        const competencia = this.competenciasActivas[idCompetencia];
        if (!competencia || competencia.participantes.length === 0) return false;
        
        competencia.estado = 'activa';
        competencia.fechaInicio = new Date();
        competencia.fechaFin = this.calcularFechaLimite(competencia.configuracion.duracion);
        
        console.log(`🚀 Competencia iniciada oficialmente: ${competencia.nombre}`);
        return true;
    }
    
    /**
     * Actualiza la puntuación de un participante
     */
    actualizarPuntuacionCompetencia(idCompetencia, idUsuario, incremento, tipoActividad = 'general') {
        const competencia = this.competenciasActivas[idCompetencia];
        if (!competencia || competencia.estado !== 'activa') return false;
        
        // Aplicar multiplicadores según el tipo
        let puntuacionFinal = incremento;
        
        // Bonus por tiempo restante (últimas 24h)
        const tiempoRestante = competencia.fechaFin - new Date();
        if (tiempoRestante < 24 * 60 * 60 * 1000) { // 24 horas
            puntuacionFinal *= 1.5;
        }
        
        // Bonus por evento especial activo
        const eventoEspecial = this.obtenerEventoEspecialActivo();
        if (eventoEspecial) {
            puntuacionFinal *= eventoEspecial.multiplicadorPuntos || 1.0;
        }
        
        // Bonus por completar desafíos de competencia
        if (tipoActividad === 'desafio_competencia') {
            puntuacionFinal *= 2.0;
        }
        
        // Actualizar puntuación
        competencia.puntuaciones[idUsuario] = (competencia.puntuaciones[idUsuario] || 0) + puntuacionFinal;
        
        // Actualizar estadísticas del participante
        const participante = competencia.participantes.find(p => p.id === idUsuario);
        if (participante) {
            participante.puntuacion = competencia.puntuaciones[idUsuario];
            participante.estadisticas.puntosObtenidos += incremento;
            participante.estadisticas.actividadesCompletadas++;
        }
        
        // Actualizar ranking
        this.actualizarRankingCompetencia(idCompetencia);
        
        console.log(`📊 Puntuación actualizada: ${idUsuario} +${puntuacionFinal} (${tipoActividad})`);
        return true;
    }
    
    /**
     * Actualiza el ranking de una competencia
     */
    actualizarRankingCompetencia(idCompetencia) {
        const competencia = this.competenciasActivas[idCompetencia];
        if (!competencia) return;
        
        // Ordenar participantes por puntuación
        competencia.ranking = competencia.participantes
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .map((participante, index) => ({
                ...participante,
                posicion: index + 1,
                porcentaje: competencia.participantes.length > 1 ? 
                    ((competencia.participantes.length - index) / competencia.participantes.length) * 100 : 100
            }));
    }
    
    // ===============================
    // EVENTOS ESPECIALES
    // ===============================
    
    /**
     * Inicia eventos automáticos si están habilitados
     */
    iniciarEventosAutomaticos() {
        // Verificar eventos cada hora
        setInterval(() => {
            this.verificarEventosAutomaticos();
        }, 60 * 60 * 1000);
        
        // Verificar eventos especiales inmediatamente
        this.verificarEventosAutomaticos();
        
        console.log('🔄 Eventos automáticos iniciados');
    }
    
    /**
     * Verifica qué eventos automáticos deben activarse
     */
    verificarEventosAutomaticos() {
        const ahora = new Date();
        
        Object.entries(this.eventosEspecialesDisponibles).forEach(([id, evento]) => {
            if (this.estaEventoActivo(id)) return; // Ya activo
            
            // Verificar si debe iniciarse
            if (this.debeIniciarseEvento(evento, ahora)) {
                this.activarEventoEspecial(id);
            }
        });
    }
    
    /**
     * Determina si un evento debe iniciarse
     */
    debeIniciarseEvento(evento, fechaActual) {
        // Eventos de fecha fija
        if (evento.fechaInicio && evento.fechaFin) {
            const inicio = new Date(evento.fechaInicio);
            const fin = new Date(evento.fechaFin);
            return fechaActual >= inicio && fechaActual <= fin;
        }
        
        // Eventos climáticos
        if (evento.tipo === 'climatico') {
            return this.verificarCondicionesClimaticas(evento);
        }
        
        // Eventos astronómicos
        if (evento.tipo === 'astronomico') {
            return this.verificarEventosAstronomicos(evento);
        }
        
        // Eventos estacionales
        if (evento.tipo === 'estacional') {
            return this.verificarEstacion(evento);
        }
        
        return false;
    }
    
    /**
     * Activa un evento especial
     */
    activarEventoEspecial(idEvento) {
        const evento = this.eventosEspecialesDisponibles[idEvento];
        if (!evento || this.eventosActivos[idEvento]) return false;
        
        this.eventosActivos[idEvento] = {
            ...evento,
            fechaActivacion: new Date(),
            participantes: 0,
            actividad: 0,
            estado: 'activo'
        };
        
        // Crear desafíos especiales para el evento
        this.crearDesafiosEventoEspecial(idEvento);
        
        console.log(`🎉 Evento especial activado: ${evento.nombre}`);
        return true;
    }
    
    /**
     * Crea desafíos especiales para un evento
     */
    crearDesafiosEventoEspecial(idEvento) {
        const evento = this.eventosActivos[idEvento];
        if (!evento || !evento.desafiosExclusivos) return;
        
        evento.desafiosExclusivos.forEach(desafioId => {
            if (!this.templatesDesafios[desafioId]) {
                // Crear desafío dinámicamente basado en el evento
                this.crearDesafioDinamicoEvento(evento, desafioId);
            }
        });
    }
    
    // ===============================
    // UTILIDADES Y HELPERS
    // ===============================
    
    /**
     * Genera un ID único para desafíos
     */
    generarIdDesafio() {
        return 'desafio_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Genera un ID único para competencias
     */
    generarIdCompetencia() {
        return 'comp_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Calcula la fecha límite para un desafío
     */
    calcularFechaLimite(duracion) {
        const ahora = new Date();
        switch (duracion.tipo) {
            case 'horas':
                return new Date(ahora.getTime() + (duracion.valor * 60 * 60 * 1000));
            case 'dias':
                return new Date(ahora.getTime() + (duracion.valor * 24 * 60 * 60 * 1000));
            case 'semanas':
                return new Date(ahora.getTime() + (duracion.valor * 7 * 24 * 60 * 60 * 1000));
            default:
                return new Date(ahora.getTime() + (7 * 24 * 60 * 60 * 1000)); // Default 7 días
        }
    }
    
    /**
     * Inicializa estadísticas para un desafío
     */
    inicializarEstadisticasDesafio(categoria) {
        const estadisticas = {
            inicio: new Date(),
            actividades: 0,
            exitosos: 0,
            fallidos: 0,
            tiempo: 0,
            zonasVisitadas: [],
            criaturasVistas: [],
            horariosActividad: [],
            climas: [],
            calidades: []
        };
        
        // Agregar estadísticas específicas por categoría
        switch (categoria) {
            case 'fotografia':
                estadisticas.fotosTomadas = [];
                estadisticas.equipamientoUsado = [];
                break;
            case 'identificacion':
                estadisticas.identificacionesCorrectas = 0;
                estadisticas.identificacionesIncorrectas = 0;
                estadisticas.tiemposIdentificacion = [];
                break;
            case 'exploracion':
                estadisticas.distanciasRecorridas = [];
                estadisticas.tiempoPorZona = {};
                break;
            case 'colaboracion':
                estadisticas.colaboradores = [];
                estadisticas.ayudasRecibidas = 0;
                estadisticas.ayudasBrindadas = 0;
                break;
        }
        
        return estadisticas;
    }
    
    /**
     * Actualiza estadísticas específicas del desafío
     */
    actualizarEstadisticasDesafio(desafio, datosEvento) {
        if (!desafio.estadisticas) return;
        
        desafio.estadisticas.actividades++;
        
        // Registrar criatura vista
        if (datosEvento.criatura && !desafio.estadisticas.criaturasVistas.includes(datosEvento.criatura)) {
            desafio.estadisticas.criaturasVistas.push(datosEvento.criatura);
        }
        
        // Registrar zona visitada
        if (datosEvento.zona && !desafio.estadisticas.zonasVisitadas.includes(datosEvento.zona)) {
            desafio.estadisticas.zonasVisitadas.push(datosEvento.zona);
        }
        
        // Registrar horario
        const hora = new Date().getHours();
        if (!desafio.estadisticas.horariosActividad.includes(hora)) {
            desafio.estadisticas.horariosActividad.push(hora);
        }
        
        // Registrar clima
        if (datosEvento.clima && !desafio.estadisticas.climas.includes(datosEvento.clima)) {
            desafio.estadisticas.climas.push(datosEvento.clima);
        }
        
        // Registrar calidad
        if (datosEvento.calidad && !desafio.estadisticas.calidades.includes(datosEvento.calidad)) {
            desafio.estadisticas.calidades.push(datosEvento.calidad);
        }
        
        // Estadísticas específicas por categoría
        this.actualizarEstadisticasEspecificas(desafio, datosEvento);
    }
    
    /**
     * Actualiza estadísticas específicas por categoría
     */
    actualizarEstadisticasEspecificas(desafio, datosEvento) {
        switch (desafio.categoria) {
            case 'fotografia':
                if (datosEvento.tipo === 'fotografia') {
                    desafio.estadisticas.fotosTomadas.push({
                        fecha: new Date(),
                        criatura: datosEvento.criatura,
                        calidad: datosEvento.calidad,
                        zona: datosEvento.zona
                    });
                }
                break;
                
            case 'identificacion':
                if (datosEvento.tipo === 'identificacion') {
                    if (datosEvento.correcta) {
                        desafio.estadisticas.identificacionesCorrectas++;
                        desafio.estadisticas.exitosos++;
                    } else {
                        desafio.estadisticas.identificacionesIncorrectas++;
                        desafio.estadisticas.fallidos++;
                    }
                    
                    if (datosEvento.tiempo) {
                        desafio.estadisticas.tiemposIdentificacion.push(datosEvento.tiempo);
                    }
                }
                break;
                
            case 'exploracion':
                if (datosEvento.tipo === 'exploracion') {
                    if (datosEvento.distancia) {
                        desafio.estadisticas.distanciasRecorridas.push(datosEvento.distancia);
                    }
                    
                    if (datosEvento.zona && datosEvento.tiempoZona) {
                        if (!desafio.estadisticas.tiempoPorZona[datosEvento.zona]) {
                            desafio.estadisticas.tiempoPorZona[datosEvento.zona] = 0;
                        }
                        desafio.estadisticas.tiempoPorZona[datosEvento.zona] += datosEvento.tiempoZona;
                    }
                }
                break;
                
            case 'colaboracion':
                if (datosEvento.tipo === 'colaboracion') {
                    if (datosEvento.colaborador) {
                        if (!desafio.estadisticas.colaboradores.includes(datosEvento.colaborador)) {
                            desafio.estadisticas.colaboradores.push(datosEvento.colaborador);
                        }
                    }
                    
                    if (datosEvento.ayudaRecibida) {
                        desafio.estadisticas.ayudasRecibidas++;
                    }
                    
                    if (datosEvento.ayudaBrindada) {
                        desafio.estadisticas.ayudasBrindadas++;
                    }
                }
                break;
        }
    }
    
    /**
     * Verifica si un desafío está activo
     */
    estaDesafioActivo(idTemplate) {
        return this.motor.desafios.activos.some(d => d.templateId === idTemplate);
    }
    
    /**
     * Verifica si un desafío ya fue completado
     */
    estaDesafioCompletado(idTemplate) {
        return this.motor.desafios.completados.some(d => d.templateId === idTemplate);
    }
    
    /**
     * Marca un desafío como completado
     */
    completarDesafio(idDesafio) {
        const desafio = this.motor.desafios.activos.find(d => d.id === idDesafio);
        if (!desafio) return;
        
        // Marcar como completado
        desafio.completado = true;
        desafio.fechaCompletado = new Date();
        desafio.estadisticas.exitosos++;
        
        // Mover a completados
        this.motor.desafios.completados.push(desafio);
        this.motor.desafios.activos = this.motor.desafios.activos.filter(d => d.id !== idDesafio);
        
        // Otorgar recompensa
        this.otorgarRecompensaDesafio(desafio);
        
        // Actualizar estadísticas del usuario
        this.actualizarEstadisticasUsuarioDesafio(desafio);
        
        // Verificar logros relacionados
        this.verificarLogrosDesafios(desafio);
        
        // Actualizar motor
        this.motor.guardarDatosUsuario();
        
        console.log(`✅ Desafío completado: ${desafio.nombre}`);
    }
    
    /**
     * Marca un desafío como vencido
     */
    marcaraDesafioVencido(idDesafio) {
        const desafio = this.motor.desafios.activos.find(d => d.id === idDesafio);
        if (!desafio) return;
        
        desafio.fallido = true;
        desafio.fechaVencimiento = new Date();
        desafio.estadisticas.fallidos++;
        
        // Mover a fallidos
        this.motor.desafios.fallidos.push(desafio);
        this.motor.desafios.activos = this.motor.desafios.activos.filter(d => d.id !== idDesafio);
        
        // Actualizar motor
        this.motor.guardarDatosUsuario();
        
        console.log(`⏰ Desafío vencido: ${desafio.nombre}`);
    }
    
    /**
     * Otorga recompensa por completar desafío
     */
    otorgarRecompensaDesafio(desafio) {
        const recompensa = desafio.recompensa;
        
        // Puntos
        if (recompensa.puntos) {
            this.motor.otorgarPuntos('desafios', recompensa.puntos);
        }
        
        // Título
        if (recompensa.titulo) {
            // TODO: Implementar sistema de títulos
            console.log(`👑 Título obtenido: ${recompensa.titulo}`);
        }
        
        // Tarjeta especial
        if (recompensa.tarjeta_especial) {
            this.motor.agregarTarjetaColeccion('especiales', `desafio_${desafio.templateId}`, {
                raro: true,
                descripcion: `Completar desafío: ${desafio.nombre}`,
                fecha: new Date()
            });
        }
        
        // Otros beneficios
        if (recompensa.creditos_camara) {
            console.log(`📸 Créditos de cámara obtenidos: ${recompensa.creditos_camara}`);
        }
        
        if (recompensa.acceso_premium) {
            console.log(`⭐ Acceso premium obtenido: ${recompensa.acceso_premium} días`);
        }
        
        if (recompensa.badge_especial) {
            console.log(`🏆 Badge especial obtenido: ${recompensa.badge_especial}`);
        }
    }
    
    /**
     * Calcula recompensa personalizada
     */
    calcularRecompensaPersonalizada(recompensaBase) {
        // TODO: Implementar sistema de recompensas dinámicas
        return { ...recompensaBase };
    }
    
    /**
     * Actualiza estadísticas del usuario relacionadas con desafíos
     */
    actualizarEstadisticasUsuarioDesafio(desafio) {
        if (!this.motor.estadisticas.desafiosCompletados) {
            this.motor.estadisticas.desafiosCompletados = 0;
        }
        this.motor.estadisticas.desafiosCompletados++;
        
        // Actualizar racha de desafíos completados
        if (!this.motor.estadisticas.rachaDesafios) {
            this.motor.estadisticas.rachaDesafios = 0;
        }
        this.motor.estadisticas.rachaDesafios++;
        
        // Actualizar historial de éxitos/fallos
        this.configuracionDificultad.historialExitosos.push({
            fecha: new Date(),
            exito: true,
            categoria: desafio.categoria,
            dificultad: desafio.dificultad
        });
        
        // Mantener solo los últimos 10 registros
        if (this.configuracionDificultad.historialExitosos.length > 10) {
            this.configuracionDificultad.historialExitosos = 
                this.configuracionDificultad.historialExitosos.slice(-10);
        }
    }
    
    /**
     * Verifica logros relacionados con desafíos
     */
    verificarLogrosDesafios(desafioCompletado) {
        const totalCompletados = this.motor.estadisticas.desafiosCompletados || 0;
        
        const logrosDesafios = [
            { id: 'desafiante_principiante', umbral: 1, nombre: 'Primer Desafío' },
            { id: 'desafiante_competente', umbral: 5, nombre: 'Competente' },
            { id: 'desafiante_experto', umbral: 10, nombre: 'Experto en Desafíos' },
            { id: 'desafiante_maestro', umbral: 25, nombre: 'Maestro de Desafíos' },
            { id: 'desafiante_leyenda', umbral: 50, nombre: 'Leyenda de los Desafíos' }
        ];
        
        logrosDesafios.forEach(logro => {
            if (!this.motor.logros[logro.id] && totalCompletados >= logro.umbral) {
                this.motor.desbloquearLogro(logro.id, `Completar ${logro.umbral} desafíos`, {
                    puntos: logro.umbral * 25,
                    titulo: logro.nombre
                });
            }
        });
        
        // Logros específicos por categoría
        const logrosPorCategoria = this.verificarLogrosPorCategoria(desafioCompletado);
        logrosPorCategoria.forEach(logro => {
            if (!this.motor.logros[logro.id]) {
                this.motor.desbloquearLogro(logro.id, logro.descripcion, logro.recompensa);
            }
        });
    }
    
    /**
     * Verifica logros por categoría específica
     */
    verificarLogrosPorCategoria(desafio) {
        const logros = [];
        
        switch (desafio.categoria) {
            case 'fotografia':
                const fotosCompletadas = this.motor.desafios.completados
                    .filter(d => d.categoria === 'fotografia').length;
                if (fotosCompletadas === 1) {
                    logros.push({
                        id: 'fotografo_desafios',
                        descripcion: 'Completar primer desafío fotográfico',
                        recompensa: { puntos: 100, titulo: 'Desafiante Fotográfico' }
                    });
                }
                break;
                
            case 'identificacion':
                const identificacionesCompletadas = this.motor.desafios.completados
                    .filter(d => d.categoria === 'identificacion').length;
                if (identificacionesCompletadas === 1) {
                    logros.push({
                        id: 'identificador_desafios',
                        descripcion: 'Completar primer desafío de identificación',
                        recompensa: { puntos: 100, titulo: 'Desafiante Identificador' }
                    });
                }
                break;
                
            case 'exploracion':
                const exploracionesCompletadas = this.motor.desafios.completados
                    .filter(d => d.categoria === 'exploracion').length;
                if (exploracionesCompletadas === 1) {
                    logros.push({
                        id: 'explorador_desafios',
                        descripcion: 'Completar primer desafío de exploración',
                        recompensa: { puntos: 100, titulo: 'Desafiante Explorador' }
                    });
                }
                break;
        }
        
        return logros;
    }
    
    /**
     * Obtiene estadísticas de una categoría específica
     */
    obtenerEstadisticasCategoria(categoria) {
        const desafiasCategoria = [
            ...this.motor.desafios.completados.filter(d => d.categoria === categoria),
            ...this.motor.desafios.activos.filter(d => d.categoria === categoria)
        ];
        
        const exitosos = desafiasCategoria.filter(d => d.completado).length;
        const intentos = desafiasCategoria.length;
        
        return {
            exitosos: exitosos,
            intentos: intentos,
            tasaExito: intentos > 0 ? exitosos / intentos : 0
        };
    }
    
    /**
     * Verifica si hay una competencia activa
     */
    estaCompetenciaActiva() {
        return Object.values(this.competenciasActivas).some(c => c.estado === 'activa');
    }
    
    /**
     * Verifica si el usuario está en una competencia activa
     */
    estaEnCompetenciaActiva() {
        const competenciaActiva = Object.values(this.competenciasActivas).find(c => c.estado === 'activa');
        return competenciaActiva && competenciaActiva.participantes.some(p => p.id === this.motor.config.usuarioId);
    }
    
    /**
     * Obtiene el evento especial activo actualmente
     */
    obtenerEventoEspecialActivo() {
        const ahora = new Date();
        return Object.values(this.eventosActivos).find(evento => {
            const fechaFin = evento.fechaFin ? new Date(evento.fechaFin) : null;
            return (!fechaFin || ahora <= fechaFin) && evento.estado === 'activo';
        }) || null;
    }
    
    /**
     * Carga datos guardados del sistema
     */
    cargarDatosGuardados() {
        // TODO: Implementar carga desde storage
        this.eventosActivos = {};
        this.cargarDesdeStorage();
    }
    
    /**
     * Guarda datos en storage
     */
    guardarDatos() {
        this.guardarEnStorage();
    }
    
    /**
     * Guarda en storage
     */
    guardarEnStorage() {
        // TODO: Implementar guardado en localStorage/IndexedDB
    }
    
    /**
     * Carga desde storage
     */
    cargarDesdeStorage() {
        // TODO: Implementar carga desde localStorage/IndexedDB
    }
    
    /**
     * API pública para obtener estado del sistema
     */
    obtenerEstadoSistema() {
        return {
            desafiosDisponibles: this.obtenerDesafiosDisponibles(),
            desafiosActivos: this.motor.desafios.activos,
            competenciasActivas: Object.values(this.competenciasActivas),
            eventosActivos: Object.values(this.eventosActivos),
            configuracion: {
                dificultadAdaptativa: this.opciones.dificultadAdaptativa,
                eventosAutomaticos: this.opciones.eventosAutomaticos,
                habilitareCompetencias: this.opciones.habilitarCompetencias
            },
            estadisticas: {
                totalDesafiosCompletados: this.motor.estadisticas.desafiosCompletados || 0,
                tasaExito: this.calcularTasaExitoGeneral(),
                categoriaFavorita: this.obtenerCategoriaFavorita()
            }
        };
    }
    
    /**
     * Calcula la tasa de éxito general del usuario
     */
    calcularTasaExitoGeneral() {
        const total = this.motor.desafios.completados.length + this.motor.desafios.fallidos.length;
        return total > 0 ? this.motor.desafios.completados.length / total : 0;
    }
    
    /**
     * Obtiene la categoría favorita del usuario
     */
    obtenerCategoriaFavorita() {
        const categorias = {};
        
        [...this.motor.desafios.completados, ...this.motor.desafios.activos].forEach(desafio => {
            categorias[desafio.categoria] = (categorias[desafio.categoria] || 0) + 1;
        });
        
        const maxCategoria = Object.entries(categorias)
            .sort(([,a], [,b]) => b - a)[0];
        
        return maxCategoria ? maxCategoria[0] : null;
    }
    
    /**
     * API pública para activar un desafío
     */
    activarDesafioPublico(idTemplate, configuracion = {}) {
        return this.activarDesafio(idTemplate, configuracion);
    }
    
    /**
     * API pública para registrar actividad en desafío
     */
    registrarActividadDesafio(idDesafio, datosEvento) {
        return this.actualizarProgresoDesafio(idDesafio, 1, datosEvento);
    }
    
    /**
     * API pública para iniciar competencia
     */
    iniciarCompetenciaPublica(idTipo, configuracion = {}) {
        return this.iniciarCompetencia(idTipo, configuracion);
    }
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.SistemaDesafiosUrukais = SistemaDesafiosUrukais;
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaDesafiosUrukais;
}