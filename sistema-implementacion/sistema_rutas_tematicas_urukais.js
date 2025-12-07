/**
 * SISTEMA DE RUTAS TEMÁTICAS URUKAIS KLICK
 * Motor para aventuras estructuradas, mapas interactivos y exploración narrativa
 * 
 * Funcionalidades:
 * - Catálogo de rutas temáticas
 * - Mapas interactivos con puntos de interés
 * - Progresión narrativa
 * - Zonas de exploración estructurada
 * - Sistema de descubrimiento
 * - Rutas personalizadas
 * - Mapas colaborativos
 * - Localización GPS y orientación
 * 
 * @author MiniMax Agent
 * @version 1.0.0
 * @date 2025-11-16
 */

class SistemaRutasUrukais {
    constructor(motorGamificacion, opciones = {}) {
        this.motor = motorGamificacion;
        this.opciones = {
            habilitarMapas: opciones.habilitarMapas !== false,
            habilitarGPS: opciones.habilitarGPS !== false,
            habilitarNarrativa: opciones.habilitarNarrativa !== false,
            habilitarPersonalizacion: opciones.habilitarPersonalizacion !== false,
            proveedorMapas: opciones.proveedorMapas || 'openstreetmap', // openstreetmap, google, mapbox
            apiKeyMapas: opciones.apiKeyMapas || null,
            idioma: opciones.idioma || 'es',
            precisionGPS: opciones.precisionGPS || 10 // metros
        };
        
        // Sistemas principales
        this.rutasDisponibles = {};
        this.rutasActivas = {};
        this.mapasPersonalizados = {};
        this.descubrimientos = {};
        this.historialRutas = [];
        
        // Datos de mapas y geolocalización
        this.ubicacionActual = null;
        this.historialUbicaciones = [];
        this.zonasConocidas = {};
        this.puntosInteres = {};
        
        // Configuración de mapas
        this.configuracionMapas = {
            centro: { lat: 40.4168, lng: -3.7038 }, // Madrid por defecto
            zoom: 13,
            estilo: 'mystico', // mystico, oscuro, claro, satelite
            capasVisibles: ['criaturas', 'puntos_interes', 'rutas', 'zonas']
        };
        
        // Inicializar sistemas
        this.inicializarRutasBase();
        this.inicializarZonas();
        this.inicializarPuntosInteres();
        this.configurarEventListeners();
        this.cargarDatosGuardados();
        
        // Inicializar geolocalización si está habilitada
        if (this.opciones.habilitarGPS) {
            this.inicializarGeolocalizacion();
        }
        
        console.log('🗺️ Sistema de Rutas Temáticas inicializado');
    }
    
    // ===============================
    // DATOS BASE Y CONFIGURACIÓN
    // ===============================
    
    /**
     * Inicializa las rutas base del sistema
     */
    inicializarRutasBase() {
        this.rutasDisponibles = {
            'iniciacion_mistica': {
                id: 'iniciacion_mistica',
                nombre: 'Iniciación Mística',
                descripcion: 'Tu primera aventura en el mundo de las criaturas místicas',
                categoria: 'novato',
                dificultad: 1,
                duracionEstimada: { horas: 4, dias: 2 },
                recompensa: {
                    puntos: 500,
                    titulo: 'Explorador Iniciado',
                    badge: 'ruta_iniciacion',
                    acceso: ['rutas_intermedias']
                },
                
                // Puntos de la ruta
                puntos: [
                    {
                        id: 'punto_entrada',
                        nombre: 'Portal de Entrada',
                        descripcion: 'El lugar donde comienza tu aventura mística',
                        lat: 40.4168,
                        lng: -3.7038,
                        tipo: 'entrada',
                        orden: 1,
                        actividades: ['orientacion', 'reconocimiento'],
                        criaturas: ['fantasma_guardian'],
                        elementosInteractivos: ['mensaje_bienvenida', 'mapa_inicial']
                    },
                    {
                        id: 'bosque_encantado',
                        nombre: 'Bosque Encantado',
                        descripcion: 'Un bosque donde los árboles susurran secretos ancestrales',
                        lat: 40.4180,
                        lng: -3.7050,
                        tipo: 'exploracion',
                        orden: 2,
                        actividades: ['avistamiento', 'fotografia'],
                        criaturas: ['hombre_lobo', 'dryade'],
                        elementosInteractivos: ['cruces_antiguas', 'fuente_mistica'],
                        clima: 'niebla_matutina',
                        horario_optimo: { inicio: 6, fin: 10 }
                    },
                    {
                        id: 'lago_reflejos',
                        nombre: 'Lago de los Reflejos',
                        descripcion: 'Un lago donde el agua refleja no solo tu imagen, sino tu destino',
                        lat: 40.4150,
                        lng: -3.7020,
                        tipo: 'observacion',
                        orden: 3,
                        actividades: ['reflexion', 'vision'],
                        criaturas: ['sirena', 'espiritu_agua'],
                        elementosInteractivos: ['altar_reflejos', 'piedras_runas'],
                        condicionesEspeciales: ['luna_creciente', 'tiempo_calma']
                    },
                    {
                        id: 'cuevas_susurros',
                        nombre: 'Cuevas de los Susurros',
                        descripcion: 'Túneles subterráneos donde las voces del pasado aún resuenan',
                        lat: 40.4140,
                        lng: -3.7080,
                        tipo: 'descubrimiento',
                        orden: 4,
                        actividades: ['exploracion_profunda', 'descifrar_mensajes'],
                        criaturas: ['fantasma_ancestral', 'dragón_cuevas'],
                        elementosInteractivos: ['grabados_wall', 'cristales_misticos'],
                        equipamiento: ['linterna', 'proteccion_especial'],
                        dificultadExtra: true
                    },
                    {
                        id: 'templete_cumbre',
                        nombre: 'Templete de la Cumbre',
                        descripcion: 'Un altar sagrado en la cima donde se otorga la sabiduría mística',
                        lat: 40.4200,
                        lng: -3.7100,
                        tipo: 'culminacion',
                        orden: 5,
                        actividades: ['ceremonia', 'transmision_conocimiento'],
                        criaturas: ['sabio_antiguo', 'guardianes_luz'],
                        elementosInteractivos: ['altar_principal', 'libro_sabiduria'],
                        ritual_requerido: true,
                        recompensasEspeciales: ['conocimiento_ancestral', 'vision_futura']
                    }
                ],
                
                // Historia y narrativa
                historia: {
                    inicio: 'Has escuchado rumores sobre una ruta especial donde los iniciados aprenden los secretos de las criaturas místicas...',
                    desarrollo: 'Cada punto de la ruta te revela aspectos ocultos del mundo místico que te rodea...',
                    clímax: 'En el templete final, comprenderás el verdadero propósito de tu viaje...',
                    conclusion: 'Con esta sabiduría, estás preparado para enfrentar los misterios más profundos...'
                },
                
                // Condiciones y requisitos
                requisitos: {
                    nivel: 1,
                    experiencia: 0,
                    logros: [],
                    equipamiento: []
                },
                
                // Estadísticas de la ruta
                estadisticas: {
                    totalCompletados: 0,
                    tasaExito: 0,
                    tiempoPromedio: 0,
                    dificultadPromedio: 1
                }
            },
            
            'leyenda_local': {
                id: 'leyenda_local',
                nombre: 'Leyendas Locales',
                descripcion: 'Descubre las criaturas más famosas de tu región y sus historias',
                categoria: 'regional',
                dificultad: 2,
                duracionEstimada: { horas: 8, dias: 3 },
                recompensa: {
                    puntos: 800,
                    titulo: 'Guardián del Conocimiento Local',
                    badge: 'conocimiento_regional',
                    acceso: ['rutas_avanzadas']
                },
                
                puntos: [
                    {
                        id: 'centro_historico',
                        nombre: 'Centro Histórico',
                        lugar: 'Plaza Mayor',
                        lat: 40.4165,
                        lng: -3.7034,
                        tipo: 'historia',
                        orden: 1,
                        actividades: ['investigacion_historica', 'entrevistas_locales'],
                        criaturas: ['fantasma_ejecutor', 'espiritu_antiguo'],
                        elementosInteractivos: ['monumento_local', 'libro_registros'],
                        tiempo_visita: 60
                    },
                    {
                        id: 'puente_secreto',
                        nombre: 'Puente de los Secretos',
                        lugar: 'Puente Romano',
                        lat: 40.4150,
                        lng: -3.7045,
                        tipo: 'misterio',
                        orden: 2,
                        actividades: ['observacion_nocturna', 'captura_evidencias'],
                        criaturas: ['mujer_blanca', 'fantasma_puente'],
                        elementosInteractivos: ['placa_memorativa', 'rincon_secreto'],
                        horario_optimo: { inicio: 20, fin: 6 },
                        tiempo_visita: 90
                    },
                    {
                        id: 'cementerio_mistico',
                        nombre: 'Cementerio de las Almas Perdidas',
                        lugar: 'Cementerio Municipal',
                        lat: 40.4140,
                        lng: -3.7010,
                        tipo: 'espiritual',
                        orden: 3,
                        actividades: ['rendir_respeto', 'comunicacion_espiritual'],
                        criaturas: ['angel_guardian', 'espiritus_lugar'],
                        elementosInteractivos: ['tumba_antigua', 'capilla_central'],
                        protocolo_respeto: true,
                        tiempo_visita: 120
                    },
                    {
                        id: 'parque_solitario',
                        nombre: 'Parque del Susurro',
                        lugar: 'Parque Central',
                        lat: 40.4175,
                        lng: -3.7060,
                        tipo: 'comunicacion',
                        orden: 4,
                        actividades: ['meditacion', 'espera_paciente'],
                        criaturas: ['espíritu_naturaleza', 'guardián_parque'],
                        elementosInteractivos: ['banco_especial', 'fuente_central'],
                        tiempo_espera: 30,
                        condiciones: ['tiempo_soleado', 'viento_suave']
                    },
                    {
                        id: 'mirador_ciudad',
                        nombre: 'Mirador de los Secretos',
                        lugar: 'Torre de la Ciudad',
                        lat: 40.4185,
                        lng: -3.7090,
                        tipo: 'panoramica',
                        orden: 5,
                        actividades: ['observacion_amplia', 'registro_vista'],
                        criaturas: ['vigilante_aire', 'espiritu_viento'],
                        elementosInteractivos: ['telescopio_antiguo', 'libro_vistas'],
                        altura: 50,
                        visibilidad_maxima: true
                    }
                ],
                
                historia: {
                    inicio: 'Las leyendas de tu ciudad susurran sobre criaturas que han protegido sus calles durante siglos...',
                    desarrollo: 'Cada ubicación guarda secretos que solo un verdadero investigador puede descubrir...',
                    clímax: 'Desde el mirador, verás los patrones de actividad que han permanecido ocultos...',
                    conclusion: 'Tu ciudad nunca volverá a ser la misma ahora que conoces sus verdaderos guardianes...'
                },
                
                requisitos: {
                    nivel: 3,
                    experiencia: 300,
                    logros: ['iniciacion_mistica'],
                    equipamiento: ['grabadora', 'cuaderno_campo']
                },
                
                estadisticas: {
                    totalCompletados: 0,
                    tasaExito: 0,
                    tiempoPromedio: 0,
                    dificultadPromedio: 2
                }
            },
            
            'caminos_antiguos': {
                id: 'caminos_antiguos',
                nombre: 'Caminos Antiguos',
                descripcion: 'Rutas utilizadas por civilizations místicas hace milenios',
                categoria: 'historica',
                dificultad: 4,
                duracionEstimada: { horas: 16, dias: 7 },
                recompensa: {
                    puntos: 1500,
                    titulo: 'Navegador de Tiempos',
                    badge: 'caminos_antiguos',
                    artefacto: 'mapa_ancestral'
                },
                
                puntos: [
                    {
                        id: 'portal_temporal',
                        nombre: 'Portal Temporal',
                        descripcion: 'Una fisura en el tiempo que conecta el presente con el pasado',
                        lat: 40.4130,
                        lng: -3.7120,
                        tipo: 'dimensional',
                        orden: 1,
                        actividades: ['activacion_portal', 'preparacion_viaje'],
                        criaturas: ['guardián_temporal', 'viajero_dimensiones'],
                        elementosInteractivos: ['cristales_temporales', 'consola_activación'],
                        requerido: ['ritual_temporal', 'amuleto_tiempo']
                    },
                    {
                        id: 'ciudad_perdida',
                        nombre: 'Ruinas de la Ciudad Perdida',
                        descripcion: 'Los restos de una civilization que dominaba la magia de las criaturas',
                        lat: 40.4120,
                        lng: -3.7150,
                        tipo: 'arqueologico',
                        orden: 2,
                        actividades: ['excavacion', 'desciframiento_runas'],
                        criaturas: ['fantasmas_civiles', 'espíritu_arquitecto'],
                        elementosInteractivos: ['templos_ruinas', 'biblioteca_oculta'],
                        desafios: ['estructuras_inestables', 'guardianes_mecanismos']
                    },
                    {
                        id: 'valle_dragones',
                        nombre: 'Valle de los Vuelos Antiguos',
                        descripcion: 'Un valle donde los dragones antaño regulaban el clima y la magia',
                        lat: 40.4100,
                        lng: -3.7180,
                        tipo: 'dracónico',
                        orden: 3,
                        actividades: ['seguimiento_rastros', 'interpretación_pliegues'],
                        criaturas: ['eco_dragon', 'espiritus_montana'],
                        elementosInteractivos: ['nidos_abandonados', 'altares_dracónicos'],
                        peligros: ['corrientes_aire', 'temporal_magico']
                    },
                    {
                        id: 'bosque_primordial',
                        nombre: 'Bosque Primordial',
                        descripcion: 'El último vestigio del bosque original antes de la llegada de los humanos',
                        lat: 40.4080,
                        lng: -3.7200,
                        tipo: 'primordial',
                        orden: 4,
                        actividades: ['exploracion_viva', 'comunicacion_ancestral'],
                        criaturas: ['árbol_antiguo', 'espíritu_naturaleza_primigenio'],
                        elementosInteractivos: ['círculos_piedra', 'fuente_vida'],
                        caracteristicas: ['magia_primitiva', 'leyes_naturaleza_diferentes']
                    }
                ],
                
                historia: {
                    inicio: 'Los antiguos mapas revelan rutas que conectan lugares más allá del tiempo actual...',
                    desarrollo: 'Cada paso en estos caminos despierta memorias de civilizaciones perdidas...',
                    clímax: 'En el bosque primordial, verás el origen de toda magia conocida...',
                    conclusion: 'Los caminos antiguos nunca se cierran completamente para aquellos que saben buscarlos...'
                },
                
                requisitos: {
                    nivel: 10,
                    experiencia: 2000,
                    logros: ['leyenda_local', 'explorador_experto'],
                    equipamiento: ['herramientas_arqueologia', 'amuleto_tiempo']
                },
                
                estadisticas: {
                    totalCompletados: 0,
                    tasaExito: 0,
                    tiempoPromedio: 0,
                    dificultadPromedio: 4
                }
            },
            
            'expedicion_nocturna': {
                id: 'expedicion_nocturna',
                nombre: 'Expedición Nocturna',
                descripcion: 'Una aventura nocturna para encontrar las criaturas que solo salen con la oscuridad',
                categoria: 'nocturna',
                dificultad: 3,
                duracionEstimada: { horas: 6, dias: 1 },
                recompensa: {
                    puntos: 1000,
                    titulo: 'Explorador Nocturno',
                    badge: 'maestro_noche',
                    creditos_vision: 10
                },
                
                puntos: [
                    {
                        id: 'parque_sombras',
                        nombre: 'Parque de las Sombras',
                        descripcion: 'Un parque donde las sombras se mueven solas bajo la luna',
                        lat: 40.4190,
                        lng: -3.7010,
                        tipo: 'nocturno',
                        orden: 1,
                        actividades: ['espera_activacion', 'observacion_sombras'],
                        criaturas: ['sombra_viviente', 'fantasma_parque'],
                        elementosInteractivos: ['faroles_antiguos', 'banco_sombras'],
                        horario: { inicio: 21, fin: 5 },
                        equipamiento: ['linterna_roja', 'camara_nocturna']
                    },
                    {
                        id: 'cementerio_lunar',
                        nombre: 'Cementerio del Eclipse',
                        descripcion: 'Un cementerio activo donde los espíritus celebran rituales lunares',
                        lat: 40.4170,
                        lng: -3.6990,
                        tipo: 'espiritual_nocturno',
                        orden: 2,
                        actividades: ['ritual_lunar', 'comunicacion_nocturna'],
                        criaturas: ['sacerdote_fantasma', 'acólitos_espirituales'],
                        elementosInteractivos: ['capilla_lunar', 'cementerio_antiguo'],
                        condiciones: ['luna_llena', 'noche_clara'],
                        precauciones: ['respeto_protocolo', 'proteccion_especial']
                    },
                    {
                        id: 'torrente_mistico',
                        nombre: 'Torrente de las Voces',
                        descripcion: 'Un arroyo donde el agua susurra secretos de medianoche',
                        lat: 40.4200,
                        lng: -3.6970,
                        tipo: 'comunicacion_acuatica',
                        orden: 3,
                        actividades: ['escucha_agua', 'interpretacion_susurros'],
                        criaturas: ['nixie', 'espíritu_agua_nocturno'],
                        elementosInteractivos: ['piedras_runas', 'remolinos_especiales'],
                        peligros: ['corrientes_trajones', 'resbaladizo']
                    },
                    {
                        id: 'mirador_lunar',
                        nombre: 'Mirador de la Luna',
                        descripcion: 'Un punto elevado perfecto para observar la actividad nocturna mística',
                        lat: 40.4210,
                        lng: -3.6950,
                        tipo: 'observacion',
                        orden: 4,
                        actividades: ['observacion_panoramica', 'registro_fenomenos'],
                        criaturas: ['vigilante_lunar', 'mensajero_estrellas'],
                        elementosInteractivos: ['telescopio_astronómico', 'mapa_estelar'],
                        ventajas: ['vista_despejada', 'posicion_estratégica']
                    }
                ],
                
                historia: {
                    inicio: 'La noche despierta a las criaturas que duermen durante el día...',
                    desarrollo: 'Cada ubicación nocturna revela aspectos ocultos del mundo místico...',
                    clímax: 'Desde el mirador lunar, verás patrones de actividad que solo la oscuridad revela...',
                    conclusion: 'Has obtenido la visión nocturna, un don invaluable para futuros exploradores...'
                },
                
                requisitos: {
                    nivel: 5,
                    experiencia: 500,
                    logros: ['iniciacion_mistica'],
                    equipamiento: ['linterna', 'camara_nocturna']
                },
                
                estadisticas: {
                    totalCompletados: 0,
                    tasaExito: 0,
                    tiempoPromedio: 0,
                    dificultadPromedio: 3
                }
            },
            
            'ruta_elemental': {
                id: 'ruta_elemental',
                nombre: 'Ruta de los Elementos',
                descripcion: 'Una expedición para encontrar criaturas vinculadas a los cuatro elementos',
                categoria: 'elemental',
                dificultad: 5,
                duracionEstimada: { horas: 24, dias: 10 },
                recompensa: {
                    puntos: 2500,
                    titulo: 'Maestro Elemental',
                    badge: 'equilibrio_elemental',
                    poder_especial: 'comunicacion_elemental'
                },
                
                puntos: [
                    {
                        id: 'montana_fuego',
                        nombre: 'Montaña del Fuego Eterno',
                        descripcion: 'Un volcán activo donde vive la descendencia del fuego ancestral',
                        lat: 40.4250,
                        lng: -3.7200,
                        tipo: 'fuego',
                        orden: 1,
                        actividades: ['escalada_volcanica', 'oferta_elemental'],
                        criaturas: ['dragón_fuego', 'espíritu_flama'],
                        elementosInteractivos: ['fuente_lava', 'templete_fuego'],
                        peligros: ['lava', 'temperaturas_extremas'],
                        equipamiento: ['traje_resistente', 'amuleto_fuego']
                    },
                    {
                        id: 'oceano_profundidad',
                        nombre: 'Abismos del Océano',
                        descripcion: 'Las profundidades marinas donde residen los guardianes del agua',
                        lat: 40.4100,
                        lng: -3.6800,
                        tipo: 'agua',
                        orden: 2,
                        actividades: ['buceo_profundo', 'ritual_oceánico'],
                        criaturas: ['kraken_guardian', 'espíritu_profundidad'],
                        elementosInteractivos: ['fuente_submarina', 'catedral_agua'],
                        equipamiento: ['equipo_buceo', 'respiracion_agua'],
                        restricciones: ['profundidad_maxima', 'tiempo_limite']
                    },
                    {
                        id: 'tormenta_aerea',
                        nombre: 'Cumbre de la Tormenta',
                        descripcion: 'El punto más alto donde convergen las tormentas más poderosas',
                        lat: 40.4300,
                        lng: -3.7500,
                        tipo: 'aire',
                        orden: 3,
                        actividades: ['climatizacion', 'comunicacion_tormenta'],
                        criaturas: ['grifo_tormenta', 'espíritu_viento'],
                        elementosInteractivos: ['altar_tormenta', 'rune_viento'],
                        fenomenos: ['rayos', 'vientos_extremos'],
                        equipamiento: ['paraguas_místico', 'anclaje_viento']
                    },
                    {
                        id: 'cuevas_tierra',
                        nombre: 'Corazón de la Tierra',
                        descripcion: 'Las profundidades terrestres donde la paciencia crea la magia más sólida',
                        lat: 40.4000,
                        lng: -3.7300,
                        tipo: 'tierra',
                        orden: 4,
                        actividades: ['exploracion_ subterranea', 'meditacion_tierra'],
                        criaturas: ['gegole', 'espíritu_cristal'],
                        elementosInteractivos: ['cristales_gigantes', 'corazon_tierra'],
                        caracteristicas: ['gravedad_aumentada', 'cristales_resonantes'],
                        equipamiento: ['casco_minero', 'linterna_tierra']
                    }
                ],
                
                historia: {
                    inicio: 'Los cuatro elementos guardan secretos que solo los más valientes pueden descubrir...',
                    desarrollo: 'Cada elemento requiere un tipo diferente de respeto y comprensión...',
                    clímax: 'El equilibrio de los cuatro elementos revelará el verdadero poder de la naturaleza...',
                    conclusion: 'Con el dominio elemental, formas parte de los guardianes ancestrales...'
                },
                
                requisitos: {
                    nivel: 15,
                    experiencia: 5000,
                    logros: ['maestro_explorador', 'conocimiento_elemental'],
                    equipamiento: ['amuleto_elemental', ' kit_survival_extremo']
                },
                
                estadisticas: {
                    totalCompletados: 0,
                    tasaExito: 0,
                    tiempoPromedio: 0,
                    dificultadPromedio: 5
                }
            }
        };
    }
    
    /**
     * Inicializa las zonas base del sistema
     */
    inicializarZonas() {
        this.zonasConocidas = {
            'zona_residencial': {
                id: 'zona_residencial',
                nombre: 'Zona Residencial',
                descripcion: 'Barrios habitados donde la magia se mezcla con la vida cotidiana',
                tipo: 'urbana',
                nivelMagia: 2,
                actividadMistica: 'moderada',
                criaturas: ['fantasma_domestico', 'espíritu_familiar', 'guardian_domestico'],
                horarios: { dia: 70, noche: 80, madrugada: 90 },
                climaPreferido: ['soleado', 'nublado'],
                peligros: 'bajo',
                accesibilidad: 'facil',
                caracteristicas: ['vida_cotidiana', 'familias_misticas', 'guardianes_locales']
            },
            
            'zona_comercial': {
                id: 'zona_comercial',
                nombre: 'Distrito Comercial',
                descripcion: 'Centro de la ciudad con alta actividad mágica debido al flujo constante de personas',
                tipo: 'urbana',
                nivelMagia: 3,
                actividadMistica: 'alta',
                criaturas: ['espiritu_comerciante', 'fantasma_cliente', 'guardian_mercado'],
                horarios: { dia: 90, noche: 60, madrugada: 30 },
                climaPreferido: ['cualquiera'],
                peligros: 'moderado',
                accesibilidad: 'facil',
                caracteristicas: ['flujo_personas', 'energia_comercial', 'diversidad_magica']
            },
            
            'zona_industrial': {
                id: 'zona_industrial',
                nombre: 'Zona Industrial',
                descripcion: 'Áreas de producción donde la magia tecnológica crea fenómenos únicos',
                tipo: 'industrial',
                nivelMagia: 4,
                actividadMistica: 'irregular',
                criaturas: ['robot_mistico', 'espíritu_maquina', 'guardián_tecnologico'],
                horarios: { dia: 50, noche: 70, madrugada: 85 },
                climaPreferido: ['lluvia', 'tormenta'],
                peligros: 'alto',
                accesibilidad: 'moderada',
                caracteristicas: ['tecnomagia', 'residuos_magicos', 'maquinaria_sagrada']
            },
            
            'parque_central': {
                id: 'parque_central',
                nombre: 'Parque Central',
                descripcion: 'Pulmón verde de la ciudad con conexión especial a la naturaleza',
                tipo: 'natural_urbano',
                nivelMagia: 5,
                actividadMistica: 'estacional',
                criaturas: ['dryade_urbana', 'espíritu_naturaleza', 'guardian_verde'],
                horarios: { dia: 80, noche: 90, madrugada: 70 },
                climaPreferido: ['soleado', 'brisa'],
                peligros: 'bajo',
                accesibilidad: 'facil',
                caracteristicas: ['naturaleza_urbana', 'conexion_tierra', 'equilibrio_ecologico']
            },
            
            'bosque_proximo': {
                id: 'bosque_proximo',
                nombre: 'Bosque Próximo',
                descripcion: 'Extensión de bosque natural cerca de la ciudad, puerta al mundo salvaje',
                tipo: 'natural',
                nivelMagia: 7,
                actividadMistica: 'alta',
                criaturas: ['espíritu_bosque', 'guardián_árboles', 'criaturas_salvajes'],
                horarios: { dia: 85, noche: 95, madrugada: 90 },
                climaPreferido: ['niebla', 'lluvia_suave'],
                peligros: 'moderado',
                accesibilidad: 'moderada',
                caracteristicas: ['magia_primitiva', 'conexion_natural', 'ciclos_salvajes']
            },
            
            'montana_cercana': {
                id: 'montana_cercana',
                nombre: 'Montaña Cercana',
                descripcion: 'Sistemas montañosos que limitan la ciudad, hogar de criaturas majestuosas',
                tipo: 'montañosa',
                nivelMagia: 8,
                actividadMistica: 'espectral',
                criaturas: ['espíritu_montana', 'guardian_alturas', 'aves_misticas'],
                horarios: { dia: 75, noche: 85, madrugada: 95 },
                climaPreferido: ['ventoso', 'niebla_montana'],
                peligros: 'alto',
                accesibilidad: 'dificil',
                caracteristicas: ['altitud_mistica', 'aire_purificado', 'visiones_panorámicas']
            },
            
            'cementerio_local': {
                id: 'cementerio_local',
                nombre: 'Cementerio Local',
                descripcion: 'Lugar de descanso final con fuerte actividad espiritual',
                tipo: 'espiritual',
                nivelMagia: 9,
                actividadMistica: 'constante',
                criaturas: ['espíritu_ancestral', 'fantasma_respetable', 'angel_guardian'],
                horarios: { dia: 60, noche: 100, madrugada: 95 },
                climaPreferido: ['luna_llena', 'niebla'],
                peligros: 'moderado',
                accesibilidad: 'moderada',
                caracteristicas: ['memoria_past', 'respeto_ancestral', 'paz_eterna']
            },
            
            'ruinas_antiguas': {
                id: 'ruinas_antiguas',
                nombre: 'Ruinas Antiguas',
                descripcion: 'Restos de construcciones místicas de civilizaciones perdidas',
                tipo: 'arqueologico',
                nivelMagia: 10,
                actividadMistica: 'remanente',
                criaturas: ['fantasma_constructor', 'espíritu_arquitecto', 'guardian_ruinas'],
                horarios: { dia: 70, noche: 90, madrugada: 100 },
                climaPreferido: ['antiguo', 'misterioso'],
                peligros: 'alto',
                accesibilidad: 'dificil',
                caracteristicas: ['historia_ancestral', 'magia_residual', 'secretos_ocultos']
            }
        };
    }
    
    /**
     * Inicializa puntos de interés especiales
     */
    inicializarPuntosInteres() {
        this.puntosInteres = {
            'altar_piedra_antigua': {
                id: 'altar_piedra_antigua',
                nombre: 'Altar de Piedra Antigua',
                tipo: 'religioso',
                descripcion: 'Un altar tallado en piedra con runas que aún brillan con magia',
                ubicacion: 'bosque_proximo',
                lat: 40.4200,
                lng: -3.7200,
                efectos: ['mediacion', 'conexion_ancestral'],
                criaturasAtradas: ['espíritu_anciano', 'guardian_piedras'],
                condicionesActivacion: ['luna_creciente', 'mediodia_solsticio'],
                objetosEncontrados: ['runas_antiguas', 'amuleto_ancestral']
            },
            
            'fuente_deseos_mistica': {
                id: 'fuente_deseos_mistica',
                nombre: 'Fuente de Deseos Mística',
                tipo: 'magico',
                descripcion: 'Una fuente donde los deseos se hacen realidad bajo condiciones especiales',
                ubicacion: 'parque_central',
                lat: 40.4150,
                lng: -3.7050,
                efectos: ['deseos_realizados', 'suerte_temporal'],
                criaturasAtradas: ['espíritu_fuente', 'genio_agua'],
                condicionesActivacion: ['medianoche', 'solsticio_verano'],
                objetosEncontrados: ['monedas_misticas', 'cristal_suerte']
            },
            
            'biblioteca_escondida': {
                id: 'biblioteca_escondida',
                nombre: 'Biblioteca Escondida',
                tipo: 'conocimiento',
                descripcion: 'Una biblioteca secreta con libros de magia y criaturas místicas',
                ubicacion: 'zona_residencial',
                lat: 40.4180,
                lng: -3.7100,
                efectos: ['conocimiento_instantaneo', 'sabiduria_temporal'],
                criaturasAtradas: ['espíritu_erudito', 'fantasma_bibliotecario'],
                condicionesActivacion: ['prueba_sabiduria', 'invocación_conocimiento'],
                objetosEncontrados: ['libros_magicos', 'tomos_antiguos']
            },
            
            'mirador_estrellas': {
                id: 'mirador_estrellas',
                nombre: 'Mirador de Estrellas',
                tipo: 'astronomico',
                descripcion: 'Un punto elevado perfecto para observar la actividad astral',
                ubicacion: 'montana_cercana',
                lat: 40.4300,
                lng: -3.7150,
                efectos: ['vision_astronómica', 'conexion_cosmica'],
                criaturasAtradas: ['espíritu_estelar', 'mensajero_galaxia'],
                condicionesActivacion: ['cielo_despejado', 'lluvia_estrellas'],
                objetosEncontrados: ['telescopio_mistico', 'mapa_estelar']
            },
            
            'laboratorio_abandonado': {
                id: 'laboratorio_abandonado',
                nombre: 'Laboratorio Abandonado',
                tipo: 'científico_magico',
                descripcion: 'Un laboratorio donde un mago realizó experimentos secretos',
                ubicacion: 'zona_industrial',
                lat: 40.4080,
                lng: -3.6950,
                efectos: ['experimentacion', 'transformaciones'],
                criaturasAtradas: ['espíritu_científico', 'criaturas_experimentales'],
                condicionesActivacion: ['actividad_temporal', 'poder_residual'],
                objetosEncontrados: ['pociones_experimentales', 'equipos_unicos']
            },
            
            'templo_perdido': {
                id: 'templo_perdido',
                nombre: 'Templo Perdido',
                tipo: 'religioso_perdido',
                descripcion: 'Los restos de un templo dedicado a una deidad antigua',
                ubicacion: 'ruinas_antiguas',
                lat: 40.4050,
                lng: -3.7250,
                efectos: ['poder_divino', 'proteccion_sagrada'],
                criaturasAtradas: ['sacerdote_fantasma', 'ángeles_guardian'],
                condicionesActivacion: ['ritual_sagrado', 'ofrendas_aptas'],
                objetosEncontrados: ['reliquias_sagradas', 'textos_sagrados']
            }
        };
    }
    
    // ===============================
    // GESTIÓN DE RUTAS
    // ===============================
    
    /**
     * Obtiene rutas disponibles para el usuario
     */
    obtenerRutasDisponibles() {
        const rutas = [];
        const perfilUsuario = this.motor.perfil;
        
        Object.values(this.rutasDisponibles).forEach(ruta => {
            if (this.cumpleRequisitos(ruta.requisitos, perfilUsuario)) {
                // Verificar si ya está activa o completada
                if (!this.estaRutaActiva(ruta.id) && !this.estaRutaCompletada(ruta.id)) {
                    rutas.push({
                        ...ruta,
                        disponible: true,
                        dificultadPersonalizada: this.calcularDificultadPersonalizada(ruta, perfilUsuario)
                    });
                }
            }
        });
        
        return rutas.sort((a, b) => a.dificultad - b.dificultad);
    }
    
    /**
     * Verifica si el usuario cumple los requisitos para una ruta
     */
    cumpleRequisitos(requisitos, perfil) {
        if (!requisitos) return true;
        
        if (requisitos.nivel && perfil.nivel < requisitos.nivel) return false;
        if (requisitos.experiencia && perfil.experiencia < requisitos.experiencia) return false;
        if (requisitos.logros && requisitos.logros.length > 0) {
            for (const logro of requisitos.logros) {
                if (!this.motor.logros[logro]) return false;
            }
        }
        if (requisitos.equipamiento && requisitos.equipamiento.length > 0) {
            // TODO: Verificar equipamiento del usuario
        }
        
        return true;
    }
    
    /**
     * Inicia una nueva ruta
     */
    iniciarRuta(idRuta) {
        const template = this.rutasDisponibles[idRuta];
        if (!template) return null;
        
        // Verificar requisitos
        if (!this.cumpleRequisitos(template.requisitos, this.motor.perfil)) {
            console.warn(`No cumple requisitos para la ruta ${idRuta}`);
            return null;
        }
        
        // Verificar si ya está activa o completada
        if (this.estaRutaActiva(idRuta)) {
            console.warn(`La ruta ${idRuta} ya está activa`);
            return this.rutasActivas[idRuta];
        }
        
        if (this.estaRutaCompletada(idRuta)) {
            console.warn(`La ruta ${idRuta} ya fue completada`);
            return null;
        }
        
        // Crear instancia de la ruta
        const rutaActiva = {
            id: this.generarIdRuta(),
            templateId: idRuta,
            nombre: template.nombre,
            descripcion: template.descripcion,
            categoria: template.categoria,
            
            // Estado de la ruta
            estado: 'iniciada', // iniciada, en_progreso, pausada, completada, abandonada
            fechaInicio: new Date(),
            fechaUltimaActividad: new Date(),
            puntosVisitados: [],
            puntoActual: null,
            progresoGeneral: 0,
            
            // Puntos de la ruta
            puntos: this.clonarPuntosRuta(template.puntos),
            
            // Narrativa y progreso
            narrativa: {
                historia: { ...template.historia },
                progresoHistoria: 0,
                eventosActivados: [],
                decisiones: []
            },
            
            // Estadísticas
            estadisticas: this.inicializarEstadisticasRuta(template),
            
            // Configuración personalizada
            configuracion: {
                mostrarNavegacion: true,
                notificacionesProximidad: true,
                modoExploracion: 'guiado', // guiado, libre, descubrimiento
                dificultadPersonalizada: this.calcularDificultadPersonalizada(template, this.motor.perfil),
                mostrarPistas: true
            },
            
            // Recompensas
            recompensa: template.recompensa,
            
            // Metadatos
            usuarioId: this.motor.config.usuarioId,
            nivelUsuarioInicio: this.motor.perfil.nivel,
            tiempoInvertido: 0
        };
        
        // Establecer punto inicial
        const puntoInicial = rutaActiva.puntos.find(p => p.orden === 1);
        if (puntoInicial) {
            rutaActiva.puntoActual = puntoInicial.id;
            rutaActiva.puntosVisitados.push(puntoInicial.id);
        }
        
        // Agregar a rutas activas
        this.rutasActivas[idRuta] = rutaActiva;
        
        // Registrar en motor de gamificación
        if (!this.motor.rutasTematicas.activas) {
            this.motor.rutasTematicas.activas = [];
        }
        this.motor.rutasTematicas.activas.push(rutaActiva);
        this.motor.guardarDatosUsuario();
        
        // Activar eventos narrativos
        this.activarEventoNarrativo(rutaActiva, 'inicio');
        
        console.log(`🗺️ Ruta iniciada: ${rutaActiva.nombre}`);
        return rutaActiva;
    }
    
    /**
     * Actualiza el progreso en una ruta
     */
    actualizarProgresoRuta(idRuta, accion, datos = {}) {
        const ruta = this.rutasActivas[idRuta];
        if (!ruta || ruta.estado === 'completada' || ruta.estado === 'abandonada') return false;
        
        const puntoActual = ruta.puntos.find(p => p.id === ruta.puntoActual);
        if (!puntoActual) return false;
        
        // Validar que la acción es válida para el punto actual
        if (!this.validarAccionEnPunto(accion, puntoActual, datos)) {
            return false;
        }
        
        // Procesar la acción según el tipo
        let progresoActualizado = false;
        
        switch (accion) {
            case 'llegada_punto':
                progresoActualizado = this.procesarLlegadaPunto(ruta, puntoActual, datos);
                break;
            case 'actividad_punto':
                progresoActualizado = this.procesarActividadPunto(ruta, puntoActual, datos);
                break;
            case 'descubrimiento':
                progresoActualizado = this.procesarDescubrimiento(ruta, puntoActual, datos);
                break;
            case 'interaccion_elemento':
                progresoActualizado = this.procesarInteraccionElemento(ruta, puntoActual, datos);
                break;
            case 'encuentro_criatura':
                progresoActualizado = this.procesarEncuentroCriatura(ruta, puntoActual, datos);
                break;
        }
        
        if (progresoActualizado) {
            ruta.fechaUltimaActividad = new Date();
            ruta.estadisticas.actividades++;
            ruta.estadisticas.tiempoTotal += Date.now() - ruta.fechaInicio;
            
            // Verificar si el punto está completado
            if (this.evaluarCompletadoPunto(puntoActual, ruta.estadisticas)) {
                this.completarPuntoRuta(ruta, puntoActual);
            }
            
            // Verificar si la ruta está completada
            if (this.evaluarCompletadoRuta(ruta)) {
                this.completarRuta(ruta);
            }
            
            this.guardarDatosRuta(ruta);
            this.activarEventosProgreso(ruta);
        }
        
        return progresoActualizado;
    }
    
    /**
     * Procesa la llegada a un punto de la ruta
     */
    procesarLlegadaPunto(ruta, punto, datos) {
        // Marcar punto como visitado
        if (!ruta.puntosVisitados.includes(punto.id)) {
            ruta.puntosVisitados.push(punto.id);
        }
        
        ruta.puntoActual = punto.id;
        
        // Otorgar puntos por llegar al punto
        this.motor.otorgarPuntos('exploracion', 20, {
            zona: punto.nombre,
            tipoAccion: 'llegada_punto'
        });
        
        // Actualizar estadísticas
        ruta.estadisticas.puntosVisitados++;
        ruta.estadisticas.distanciasRecorridas += datos.distancia || 0;
        ruta.estadisticas.tiempoExploracion += datos.tiempoExploracion || 0;
        
        // Activar eventos narrativos
        this.activarEventoNarrativo(ruta, 'llegada_punto', { punto: punto });
        
        // Agregar a descubrimientos si es un punto especial
        if (punto.tipo === 'descubrimiento' || punto.tipo === 'culminacion') {
            this.agregarDescubrimiento(punto, 'punto_ruta');
        }
        
        console.log(`📍 Llegada a punto: ${punto.nombre}`);
        return true;
    }
    
    /**
     * Procesa una actividad específica en un punto
     */
    procesarActividadPunto(ruta, punto, datos) {
        const actividad = datos.actividad;
        const esValida = punto.actividades.includes(actividad);
        
        if (!esValida) return false;
        
        // Otorgar puntos por la actividad
        const puntosActividad = this.calcularPuntosActividad(actividad, punto);
        this.motor.otorgarPuntos('exploracion', puntosActividad, {
            zona: punto.nombre,
            tipoAccion: actividad
        });
        
        // Actualizar estadísticas específicas
        if (!ruta.estadisticas.actividadesRealizadas) {
            ruta.estadisticas.actividadesRealizadas = {};
        }
        ruta.estadisticas.actividadesRealizadas[actividad] = 
            (ruta.estadisticas.actividadesRealizadas[actividad] || 0) + 1;
        
        // Verificar logros específicos de actividades
        this.verificarLogrosActividad(ruta, actividad, punto);
        
        // Activar eventos especiales
        this.activarEventosEspeciales(ruta, actividad, punto);
        
        console.log(`✅ Actividad completada: ${actividad} en ${punto.nombre}`);
        return true;
    }
    
    /**
     * Procesa un descubrimiento especial
     */
    procesarDescubrimiento(ruta, punto, datos) {
        const descubrimiento = {
            id: this.generarIdDescubrimiento(),
            tipo: datos.tipo || 'general',
            nombre: datos.nombre || 'Descubrimiento',
            descripcion: datos.descripcion,
            ubicacion: { lat: punto.lat, lng: punto.lng, punto: punto.id },
            fecha: new Date(),
            rareza: datos.rareza || 'comun',
            valorMagico: datos.valorMagico || 1,
            datosExtra: datos.datosExtra || {}
        };
        
        // Agregar a descubrimientos
        if (!this.descubrimientos[ruta.id]) {
            this.descubrimientos[ruta.id] = [];
        }
        this.descubrimientos[ruta.id].push(descubrimiento);
        
        // Otorgar puntos por descubrimiento
        const puntosDescubrimiento = this.calcularPuntosDescubrimiento(descubrimiento);
        this.motor.otorgarPuntos('exploracion', puntosDescubrimiento, {
            zona: punto.nombre,
            tipoAccion: 'descubrimiento'
        });
        
        // Agregar tarjeta de descubrimiento a la colección
        this.motor.agregarTarjetaColeccion('especiales', `descubrimiento_${descubrimiento.id}`, {
            raro: descubrimiento.rareza === 'raro' || descubrimiento.rareza === 'legendario',
            descripcion: descubrimiento.nombre,
            fecha: descubrimiento.fecha,
            valorMagico: descubrimiento.valorMagico
        });
        
        console.log(`🔍 Nuevo descubrimiento: ${descubrimiento.nombre}`);
        return true;
    }
    
    /**
     * Calcula puntos por tipo de actividad
     */
    calcularPuntosActividad(actividad, punto) {
        const valoresBase = {
            'orientacion': 10,
            'reconocimiento': 15,
            'avistamiento': 25,
            'fotografia': 20,
            'exploracion_profunda': 35,
            'descifrar_mensajes': 30,
            'reflexion': 15,
            'vision': 20,
            'meditacion': 15,
            'observacion': 25,
            'espera_paciente': 40,
            'comunicacion': 30,
            'registro_vista': 20,
            'ceremonia': 50,
            'transmision_conocimiento': 45
        };
        
        let puntos = valoresBase[actividad] || 10;
        
        // Multiplicadores por tipo de punto
        if (punto.tipo === 'descubrimiento') puntos *= 1.5;
        if (punto.tipo === 'culminacion') puntos *= 2.0;
        if (punto.dificultadExtra) puntos *= 1.3;
        
        // Multiplicadores por rareza de zona
        const zona = this.zonasConocidas[punto.ubicacion || 'zona_residencial'];
        if (zona) {
            puntos *= (1 + zona.nivelMagia * 0.1);
        }
        
        return Math.round(puntos);
    }
    
    /**
     * Calcula puntos por descubrimiento
     */
    calcularPuntosDescubrimiento(descubrimiento) {
        const valoresRareza = {
            'comun': 25,
            'poco_comun': 50,
            'raro': 100,
            'epico': 200,
            'legendario': 500
        };
        
        let puntos = valoresRareza[descubrimiento.rareza] || 25;
        puntos += descubrimiento.valorMagico * 10;
        
        return puntos;
    }
    
    /**
     * Evalúa si un punto está completado
     */
    evaluarCompletadoPunto(punto, estadisticas) {
        const actividadesRequeridas = punto.actividades;
        const actividadesCompletadas = Object.keys(estadisticas.actividadesRealizadas || {});
        
        // Verificar que todas las actividades requeridas se hayan completado
        return actividadesRequeridas.every(actividad => 
            actividadesCompletadas.includes(actividad)
        );
    }
    
    /**
     * Completa un punto de la ruta
     */
    completarPuntoRuta(ruta, punto) {
        punto.completado = true;
        punto.fechaCompletado = new Date();
        punto.progreso = 100;
        
        // Otorgar bonificación por completar punto
        this.motor.otorgarPuntos('exploracion', 100, {
            zona: punto.nombre,
            tipoAccion: 'completar_punto'
        });
        
        // Calcular progreso general
        const puntosCompletados = ruta.puntos.filter(p => p.completado).length;
        ruta.progresoGeneral = Math.round((puntosCompletados / ruta.puntos.length) * 100);
        
        // Activar evento narrativo
        this.activarEventoNarrativo(ruta, 'punto_completado', { punto: punto });
        
        // Preparar siguiente punto
        const siguientePunto = ruta.puntos.find(p => p.orden === punto.orden + 1);
        if (siguientePunto && !ruta.puntosVisitados.includes(siguientePunto.id)) {
            ruta.puntoActual = siguientePunto.id;
            ruta.puntosVisitados.push(siguientePunto.id);
            
            // Notificar siguiente punto
            this.activarEventoNarrativo(ruta, 'nuevo_punto', { punto: siguientePunto });
        }
        
        console.log(`✅ Punto completado: ${punto.nombre} (${ruta.progresoGeneral}% total)`);
    }
    
    /**
     * Evalúa si la ruta está completada
     */
    evaluarCompletadoRuta(ruta) {
        const puntosCompletados = ruta.puntos.filter(p => p.completado).length;
        return puntosCompletados === ruta.puntos.length;
    }
    
    /**
     * Completa la ruta
     */
    completarRuta(ruta) {
        ruta.estado = 'completada';
        ruta.fechaCompletado = new Date();
        ruta.progresoGeneral = 100;
        ruta.estadisticas.completada = true;
        
        // Otorgar recompensa principal de la ruta
        this.otorgarRecompensaRuta(ruta);
        
        // Mover a rutas completadas
        this.motor.rutasTematicas.completadas.push(ruta);
        delete this.rutasActivas[ruta.templateId];
        
        // Activar evento narrativo final
        this.activarEventoNarrativo(ruta, 'ruta_completada');
        
        // Verificar logros relacionados con rutas
        this.verificarLogrosRutas();
        
        this.motor.guardarDatosUsuario();
        
        console.log(`🏆 Ruta completada: ${ruta.nombre}`);
    }
    
    /**
     * Otorga recompensa por completar ruta
     */
    otorgarRecompensaRuta(ruta) {
        const recompensa = ruta.recompensa;
        
        // Puntos
        if (recompensa.puntos) {
            this.motor.otorgarPuntos('exploracion', recompensa.puntos);
        }
        
        // Título
        if (recompensa.titulo) {
            console.log(`👑 Título obtenido: ${recompensa.titulo}`);
        }
        
        // Badge
        if (recompensa.badge) {
            this.motor.agregarTarjetaColeccion('especiales', `ruta_${ruta.templateId}`, {
                raro: true,
                descripcion: `Completar ruta: ${ruta.nombre}`,
                fecha: new Date(),
                categoria: 'rutas'
            });
        }
        
        // Artefacto especial
        if (recompensa.artefacto) {
            console.log(`🗿 Artefacto obtenido: ${recompensa.artefacto}`);
        }
        
        // Poder especial
        if (recompensa.poder_especial) {
            console.log(`✨ Poder especial obtenido: ${recompensa.poder_especial}`);
        }
        
        // Acceso
        if (recompensa.acceso) {
            console.log(`🔓 Acceso obtenido a: ${recompensa.acceso.join(', ')}`);
        }
    }
    
    // ===============================
    // SISTEMA DE NARRATIVA Y EVENTOS
    // ===============================
    
    /**
     * Activa evento narrativo
     */
    activarEventoNarrativo(ruta, tipoEvento, datos = {}) {
        const narrativa = ruta.narrativa;
        
        switch (tipoEvento) {
            case 'inicio':
                narrativa.progresoHistoria = 0.1;
                console.log(`📖 Historia iniciada: ${narrativa.historia.inicio}`);
                break;
                
            case 'llegada_punto':
                narrativa.progresoHistoria = Math.max(narrativa.progresoHistoria, 0.2);
                console.log(`📍 Llegada a: ${datos.punto.nombre}`);
                break;
                
            case 'punto_completado':
                narrativa.progresoHistoria = Math.max(narrativa.progresoHistoria, 0.5);
                console.log(`✅ Punto completado: ${datos.punto.nombre}`);
                break;
                
            case 'ruta_completada':
                narrativa.progresoHistoria = 1.0;
                console.log(`🎉 Ruta completada: ${ruta.nombre}`);
                console.log(`📖 Historia concluida: ${narrativa.historia.conclusion}`);
                break;
        }
        
        // Registrar evento activado
        narrativa.eventosActivados.push({
            tipo: tipoEvento,
            fecha: new Date(),
            datos: datos,
            progreso: narrativa.progresoHistoria
        });
    }
    
    /**
     * Activa eventos especiales durante el progreso
     */
    activarEventosProgreso(ruta) {
        // Eventos basados en progreso
        if (ruta.progresoGeneral >= 25 && !ruta.eventosActivados.includes('primer_cuarto')) {
            ruta.eventosActivados.push('primer_cuarto');
            this.mostrarEventoEspecial(ruta, 'Un cuarto del camino recorrido...');
        }
        
        if (ruta.progresoGeneral >= 50 && !ruta.eventosActivados.includes('mitad_camino')) {
            ruta.eventosActivados.push('mitad_camino');
            this.mostrarEventoEspecial(ruta, 'Has llegado a la mitad de tu viaje...');
        }
        
        if (ruta.progresoGeneral >= 75 && !ruta.eventosActivados.includes('ultimo_cuarto')) {
            ruta.eventosActivados.push('ultimo_cuarto');
            this.mostrarEventoEspecial(ruta, 'Estás muy cerca del final de tu aventura...');
        }
        
        // Eventos basados en actividades especiales
        const actividades = ruta.estadisticas.actividadesRealizadas || {};
        if (actividades['ceremonia'] && !ruta.eventosActivados.includes('ceremonia_realizada')) {
            ruta.eventosActivados.push('ceremonia_realizada');
            this.mostrarEventoEspecial(ruta, 'La ceremonia ha despertado fuerzas ancestrales...');
        }
    }
    
    /**
     * Muestra evento especial al usuario
     */
    mostrarEventoEspecial(ruta, mensaje) {
        // Crear notificación visual
        if (typeof window !== 'undefined' && window.InterfazGamificacionUrukais) {
            const notificacion = {
                tipo: 'evento_ruta',
                titulo: `🗺️ ${ruta.nombre}`,
                mensaje: mensaje,
                rutaId: ruta.id,
                timestamp: new Date()
            };
            
            // La interfaz de gamificación manejará la visualización
            console.log(`🎭 Evento especial: ${mensaje}`);
        }
    }
    
    /**
     * Activa evento específico
     */
    activarEventoEspecifico(ruta, eventoId, datos = {}) {
        // TODO: Implementar sistema de eventos específicos
        console.log(`🎯 Evento activado: ${eventoId}`);
    }
    
    // ===============================
    // SISTEMA DE MAPAS
    // ===============================
    
    /**
     * Obtiene datos del mapa para una ruta
     */
    obtenerDatosMapaRuta(idRuta) {
        const ruta = this.rutasActivas[idRuta];
        if (!ruta || !this.opciones.habilitarMapas) return null;
        
        const datosMapa = {
            ruta: {
                id: ruta.id,
                nombre: ruta.nombre,
                progreso: ruta.progresoGeneral,
                estado: ruta.estado
            },
            puntos: ruta.puntos.map(punto => ({
                id: punto.id,
                nombre: punto.nombre,
                lat: punto.lat,
                lng: punto.lng,
                tipo: punto.tipo,
                orden: punto.orden,
                completado: punto.completado || false,
                visitada: ruta.puntosVisitados.includes(punto.id),
                puntoActual: ruta.puntoActual === punto.id
            })),
            configuracion: {
                centro: this.calcularCentroMapa(ruta.puntos),
                zoom: this.calcularZoomMapa(ruta.puntos),
                estilo: this.configuracionMapas.estilo
            }
        };
        
        return datosMapa;
    }
    
    /**
     * Calcula el centro del mapa basado en los puntos
     */
    calcularCentroMapa(puntos) {
        if (puntos.length === 0) return this.configuracionMapas.centro;
        
        const lats = puntos.map(p => p.lat);
        const lngs = puntos.map(p => p.lng);
        
        return {
            lat: (Math.min(...lats) + Math.max(...lats)) / 2,
            lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
        };
    }
    
    /**
     * Calcula el zoom apropiado para mostrar todos los puntos
     */
    calcularZoomMapa(puntos) {
        if (puntos.length <= 1) return 15;
        
        const lats = puntos.map(p => p.lat);
        const lngs = puntos.map(p => p.lng);
        
        const latDiff = Math.abs(Math.max(...lats) - Math.min(...lats));
        const lngDiff = Math.abs(Math.max(...lngs) - Math.min(...lngs));
        const maxDiff = Math.max(latDiff, lngDiff);
        
        // Calcular zoom basado en la dispersión de puntos
        if (maxDiff > 0.1) return 10;
        if (maxDiff > 0.05) return 12;
        if (maxDiff > 0.02) return 14;
        return 16;
    }
    
    // ===============================
    // GEOLOCALIZACIÓN
    // ===============================
    
    /**
     * Inicializa el sistema de geolocalización
     */
    inicializarGeolocalizacion() {
        if (!navigator.geolocation) {
            console.warn('Geolocalización no soportada');
            return;
        }
        
        // Obtener ubicación inicial
        this.obtenerUbicacionActual();
        
        // Configurar seguimiento continuo
        this.configurarSeguimientoUbicacion();
        
        console.log('📍 Geolocalización inicializada');
    }
    
    /**
     * Obtiene la ubicación actual del usuario
     */
    obtenerUbicacionActual() {
        if (!navigator.geolocation) return null;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.ubicacionActual = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    precision: position.coords.accuracy,
                    timestamp: new Date()
                };
                
                this.historialUbicaciones.push(this.ubicacionActual);
                
                // Verificar proximidad a puntos de interés
                this.verificarProximidadPuntos(this.ubicacionActual);
                
                console.log('📍 Ubicación actualizada:', this.ubicacionActual);
            },
            (error) => {
                console.warn('Error obteniendo ubicación:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutos
            }
        );
        
        return this.ubicacionActual;
    }
    
    /**
     * Configura el seguimiento continuo de ubicación
     */
    configurarSeguimientoUbicacion() {
        // Actualizar ubicación cada minuto
        setInterval(() => {
            this.obtenerUbicacionActual();
        }, 60000);
        
        // Verificar proximidad cada 30 segundos
        setInterval(() => {
            if (this.ubicacionActual) {
                this.verificarProximidadRutas(this.ubicacionActual);
            }
        }, 30000);
    }
    
    /**
     * Verifica proximidad a puntos de interés
     */
    verificarProximidadPuntos(ubicacion) {
        const precision = this.opciones.precisionGPS;
        
        Object.values(this.puntosInteres).forEach(punto => {
            const distancia = this.calcularDistancia(ubicacion, punto);
            
            if (distancia <= precision) {
                this.notificarProximidadPunto(punto, distancia);
            }
        });
        
        // Verificar proximidad a puntos de rutas activas
        Object.values(this.rutasActivas).forEach(ruta => {
            ruta.puntos.forEach(punto => {
                if (!ruta.puntosVisitados.includes(punto.id)) {
                    const distancia = this.calcularDistancia(ubicacion, punto);
                    if (distancia <= precision * 2) { // Rango más amplio para rutas
                        this.notificarProximidadPuntoRuta(ruta, punto, distancia);
                    }
                }
            });
        });
    }
    
    /**
     * Notifica proximidad a un punto de interés
     */
    notificarProximidadPunto(punto, distancia) {
        console.log(`🎯 Cerca de punto de interés: ${punto.nombre} (${Math.round(distancia)}m)`);
        
        // TODO: Mostrar notificación en la interfaz
    }
    
    /**
     * Notifica proximidad a un punto de ruta
     */
    notificarProximidadPuntoRuta(ruta, punto, distancia) {
        console.log(`🗺️ Punto de ruta cerca: ${punto.nombre} en ${ruta.nombre} (${Math.round(distancia)}m)`);
        
        // TODO: Mostrar notificación con opción de ir al punto
    }
    
    // ===============================
    // UTILIDADES Y HELPERS
    // ===============================
    
    /**
     * Genera un ID único para rutas
     */
    generarIdRuta() {
        return 'ruta_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Genera un ID único para descubrimientos
     */
    generarIdDescubrimiento() {
        return 'desc_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Clona los puntos de una ruta para evitar modificaciones
     */
    clonarPuntosRuta(puntosOriginales) {
        return puntosOriginales.map(punto => ({
            ...punto,
            completado: false,
            fechaInicio: null,
            fechaCompletado: null,
            progreso: 0,
            estadisticas: {}
        }));
    }
    
    /**
     * Verifica si una ruta está activa
     */
    estaRutaActiva(idRuta) {
        return this.rutasActivas[idRuta] !== undefined;
    }
    
    /**
     * Verifica si una ruta ya fue completada
     */
    estaRutaCompletada(idRuta) {
        return this.motor.rutasTematicas.completadas.some(r => r.templateId === idRuta);
    }
    
    /**
     * Calcula la distancia entre dos puntos
     */
    calcularDistancia(punto1, punto2) {
        const R = 6371000; // Radio de la Tierra en metros
        const lat1 = punto1.lat * Math.PI / 180;
        const lat2 = punto2.lat * Math.PI / 180;
        const deltaLat = (punto2.lat - punto1.lat) * Math.PI / 180;
        const deltaLng = (punto2.lng - punto1.lng) * Math.PI / 180;
        
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    /**
     * Inicializa estadísticas para una ruta
     */
    inicializarEstadisticasRuta(template) {
        return {
            inicio: new Date(),
            actividades: 0,
            puntosVisitados: 0,
            tiempoTotal: 0,
            tiempoExploracion: 0,
            distanciasRecorridas: 0,
            criaturasEncontradas: [],
            zonasExploradas: [],
            descubrimientos: 0,
            actividadesRealizadas: {},
            completada: false,
            fallos: 0,
            pausada: 0
        };
    }
    
    /**
     * Guarda datos de la ruta
     */
    guardarDatosRuta(ruta) {
        this.motor.guardarDatosUsuario();
        this.guardarEnStorage();
    }
    
    /**
     * Carga datos guardados
     */
    cargarDatosGuardados() {
        this.cargarDesdeStorage();
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
     * Verifica logros relacionados con rutas
     */
    verificarLogrosRutas() {
        const rutasCompletadas = this.motor.rutasTematicas.completadas.length;
        
        const logrosRutas = [
            { id: 'explorador_ruta_1', umbral: 1, nombre: 'Explorador de Rutas' },
            { id: 'explorador_ruta_3', umbral: 3, nombre: 'Maestro Explorador' },
            { id: 'explorador_ruta_5', umbral: 5, nombre: 'Leyenda de las Rutas' }
        ];
        
        logrosRutas.forEach(logro => {
            if (!this.motor.logros[logro.id] && rutasCompletadas >= logro.umbral) {
                this.motor.desbloquearLogro(logro.id, `Completar ${logro.umbral} rutas`, {
                    puntos: logro.umbral * 100,
                    titulo: logro.nombre
                });
            }
        });
    }
    
    /**
     * API pública para obtener estado del sistema
     */
    obtenerEstadoSistema() {
        return {
            rutasDisponibles: this.obtenerRutasDisponibles(),
            rutasActivas: Object.values(this.rutasActivas),
            rutasCompletadas: this.motor.rutasTematicas.completadas.length,
            mapasPersonalizados: Object.values(this.mapasPersonalizados),
            descubrimientos: Object.values(this.descubrimientos).flat(),
            configuracion: {
                habilitarMapas: this.opciones.habilitarMapas,
                habilitarGPS: this.opciones.habilitarGPS,
                proveedorMapas: this.opciones.proveedorMapas
            },
            ubicacion: this.ubicacionActual,
            estadisticas: {
                totalRutasCompletadas: this.motor.rutasTematicas.completadas.length,
                totalDescubrimientos: Object.values(this.descubrimientos).flat().length,
                tiempoTotalExploracion: this.calcularTiempoTotalExploracion()
            }
        };
    }
    
    /**
     * Calcula el tiempo total de exploración
     */
    calcularTiempoTotalExploracion() {
        let tiempoTotal = 0;
        
        // Tiempo de rutas activas
        Object.values(this.rutasActivas).forEach(ruta => {
            tiempoTotal += Date.now() - ruta.fechaInicio;
        });
        
        // Tiempo de rutas completadas
        this.motor.rutasTematicas.completadas.forEach(ruta => {
            tiempoTotal += ruta.estadisticas.tiempoTotal || 0;
        });
        
        return tiempoTotal;
    }
    
    /**
     * API pública para iniciar una ruta
     */
    iniciarRutaPublica(idRuta) {
        return this.iniciarRuta(idRuta);
    }
    
    /**
     * API pública para actualizar progreso
     */
    actualizarProgresoPublico(idRuta, accion, datos = {}) {
        return this.actualizarProgresoRuta(idRuta, accion, datos);
    }
    
    /**
     * API pública para obtener datos del mapa
     */
    obtenerMapaPublico(idRuta) {
        return this.obtenerDatosMapaRuta(idRuta);
    }
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.SistemaRutasUrukais = SistemaRutasUrukais;
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaRutasUrukais;
}