// Base de datos de contenido para el Buscador Urukais Klick
const URUKAIS_DATA = {
    // Animaladas
    animales: [
        {
            title: "Generador de Animales",
            description: "Generador interactivo de animales místicos de Alforja",
            url: "/cabecera/animales/animales.html",
            category: "animales",
            type: "herramienta",
            tags: ["generador", "animales", "místico", "interactivo"],
            icon: "🐸",
            relevance: 95
        },
        {
            title: "App de Mascotas",
            description: "Aplicación completa para el cuidado y gestión de mascotas",
            url: "/cabecera/animales/buscador-de-perros.html",
            category: "animales",
            type: "aplicación",
            tags: ["mascotas", "perros", "cuidado", "gestión"],
            icon: "🐾",
            relevance: 90
        },
        {
            title: "Buscador de Equipos Deportivos",
            description: "Encuentra información sobre equipos deportivos y estadísticas",
            url: "/cabecera/buscadores/deportes.html",
            category: "animales",
            type: "buscador",
            tags: ["deportes", "equipos", "estadísticas", "fútbol"],
            icon: "⚽",
            relevance: 85
        },
        {
            title: "Marketing Digital",
            description: "Herramientas y estrategias de marketing digital moderno",
            url: "/cabecera/animales/Marketing.html",
            category: "animales",
            type: "contenido",
            tags: ["marketing", "digital", "estrategia", "redes sociales"],
            icon: "🤳",
            relevance: 80
        },
        {
            title: "Multiplataforma",
            description: "Soluciones multiplataforma para desarrollo web y móvil",
            url: "/cabecera/animales/multi.html",
            category: "animales",
            type: "herramienta",
            tags: ["multiplataforma", "desarrollo", "web", "móvil"],
            icon: "👏",
            relevance: 85
        },
        {
            title: "Neocron Urukais",
            description: "Sistema de cronología avanzada para el ecosistema Urukais",
            url: "/cabecera/animales/neocron.html",
            category: "animales",
            type: "herramienta",
            tags: ["neocron", "tiempo", "cronología", "sistema"],
            icon: "💋",
            relevance: 90
        },
        {
            title: "Portal Interactivo",
            description: "Portal de navegación interactiva del ecosistema digital",
            url: "/cabecera/animales/portal-interactivo.html",
            category: "animales",
            type: "proyecto",
            tags: ["portal", "interactivo", "navegación", "ecosistema"],
            icon: "✨",
            relevance: 95
        },
        {
            title: "Suit de Productividad",
            description: "Suite completa de herramientas de productividad personal",
            url: "/cabecera/animales/site-de-productividad.html",
            category: "animales",
            type: "herramienta",
            tags: ["productividad", "herramientas", "personal", "gestión"],
            icon: "🌬",
            relevance: 88
        }
    ],

    // Buscadores
    buscadores: [
        {
            title: "Buscador de Libros",
            description: "Encuentra libros, reseñas y recomendaciones literarias",
            url: "/cabecera/buscadores/buscadorurukais.html",
            category: "buscadores",
            type: "buscador",
            tags: ["libros", "literatura", "reseñas", "recomendaciones"],
            icon: "🎁",
            relevance: 95
        },
        {
            title: "Matrix Buscador",
            description: "Buscador avanzado con capacidades de filtrado inteligente",
            url: "/cabecera/buscadores/busqueda.html",
            category: "buscadores",
            type: "buscador",
            tags: ["matrix", "búsqueda", "avanzado", "inteligente"],
            icon: "🐱‍🐉",
            relevance: 90
        },
        {
            title: "Gestor de Tareas",
            description: "Sistema completo de gestión de tareas y proyectos",
            url: "/cabecera/buscadores/gestor-de-tareas.html",
            category: "buscadores",
            type: "herramienta",
            tags: ["tareas", "gestión", "proyectos", "organización"],
            icon: "❤",
            relevance: 88
        },
        {
            title: "Gestor de Proyectos",
            description: "Plataforma integral para la gestión de proyectos complejos",
            url: "/cabecera/buscadores/gestor-de-proyectos.html",
            category: "buscadores",
            type: "herramienta",
            tags: ["proyectos", "gestión", "equipos", "colaboración"],
            icon: "👌",
            relevance: 90
        },
        {
            title: "Barcelona Sostenible",
            description: "Iniciativas y proyectos de sostenibilidad en Barcelona",
            url: "/cabecera/buscadores/barcelona-sustainabitil.html",
            category: "buscadores",
            type: "contenido",
            tags: ["barcelona", "sostenible", "medio ambiente", "ciudad"],
            icon: "🐱‍🚀",
            relevance: 85
        }
    ],

    // Populares
    populares: [
        {
            title: "Películas de Terror",
            description: "Colección de películas de terror con reseñas y análisis",
            url: "/cabecera/cine/buscador-de-peliculas.html",
            category: "populares",
            type: "contenido",
            tags: ["terror", "películas", "cine", "horror"],
            icon: "😎",
            relevance: 92
        },
        {
            title: "Gestor de Citas",
            description: "Sistema para gestionar citas médicas y personales",
            url: "/cabecera/cine/gestor-de-citas.html",
            category: "populares",
            type: "herramienta",
            tags: ["citas", "médicas", "gestión", "calendario"],
            icon: "🥩",
            relevance: 85
        },
        {
            title: "La Nasa Urukais",
            description: "Exploración espacial y astronomía del ecosistema Urukais",
            url: "/cabecera/cine/la-nasa.html",
            category: "populares",
            type: "contenido",
            tags: ["nasa", "espacio", "astronomía", "exploración"],
            icon: "🐸",
            relevance: 88
        },
        {
            title: "Biblioteca de Libros",
            description: "Extensa biblioteca digital con miles de libros",
            url: "/cabecera/cine/libros.html",
            category: "populares",
            type: "biblioteca",
            tags: ["biblioteca", "libros", "digital", "lectura"],
            icon: "🐱‍👤",
            relevance: 95
        },
        {
            title: "Localizador IPES",
            description: "Localizador avanzado de direcciones y coordenadas",
            url: "/cabecera/cine/localizador.html",
            category: "populares",
            type: "herramienta",
            tags: ["localizador", "ip", "direcciones", "geolocalización"],
            icon: "🌬",
            relevance: 82
        },
        {
            title: "Noticias Mundiales",
            description: "Agregador de noticias de todo el mundo",
            url: "/cabecera/cine/noticias.html",
            category: "populares",
            type: "contenido",
            tags: ["noticias", "mundo", "actualidad", "información"],
            icon: "🎈",
            relevance: 85
        },
        {
            title: "SubcatPelículas Urukais",
            description: "Plataforma de streaming y películas bajo demanda",
            url: "/cabecera/cine/peluculas.html",
            category: "populares",
            type: "plataforma",
            tags: ["streaming", "películas", "entretenimiento", "video"],
            icon: "😎",
            relevance: 90
        },
        {
            title: "ProTask",
            description: "Gestor de tareas profesional con funciones avanzadas",
            url: "/cabecera/cine/ProTask.html",
            category: "populares",
            type: "herramienta",
            tags: ["tareas", "profesional", "gestión", "productividad"],
            icon: "⛱",
            relevance: 87
        },
        {
            title: "ReservaPro",
            description: "Sistema de reservas y citas para profesionales",
            url: "/cabecera/cine/ReservaPro.html",
            category: "populares",
            type: "herramienta",
            tags: ["reservas", "citas", "profesionales", "clientes"],
            icon: "😍",
            relevance: 84
        }
    ],

    // Comidas
    comidas: [
        {
            title: "Sistema Auténtico",
            description: "Sistema de recetas y cocina auténtica mediterránea",
            url: "/cabecera/comida/coctel.html",
            category: "comidas",
            type: "contenido",
            tags: ["cocina", "auténtica", "mediterránea", "recetas"],
            icon: "🍽️",
            relevance: 88
        },
        {
            title: "Comida Rica",
            description: "Recetas deliciosas y contenido gastronómico",
            url: "/cabecera/comida/comida.html",
            category: "comidas",
            type: "contenido",
            tags: ["comida", "rico", "gastronomía", "recetas"],
            icon: "🐱🎂",
            relevance: 90
        },
        {
            title: "Comida en Inglés",
            description: "Recetas y contenido gastronómico en inglés",
            url: "/cabecera/comida/cocia-en-inglés.html",
            category: "comidas",
            type: "contenido",
            tags: ["comida", "inglés", "recetas", "gastronomía"],
            icon: "😒",
            relevance: 80
        }
    ],

    // Cómics
    conics: [
        {
            title: "Archivo de Hielo",
            description: "Archivo completo de cómics y novelas gráficas",
            url: "/cabecera/conics/archivo-de-hielo.html",
            category: "conics",
            type: "biblioteca",
            tags: ["cómics", "archivo", "novela gráfica", "colección"],
            icon: "✨",
            relevance: 92
        },
        {
            title: "Chistes",
            description: "Colección de chistes y contenido humorístico",
            url: "/cabecera/conics/chistes.html",
            category: "conics",
            type: "contenido",
            tags: ["chistes", "humor", "comedia", "divertido"],
            icon: "😂",
            relevance: 85
        },
        {
            title: "Morty Dibujos",
            description: "Dibujos y arte de personajes de Rick y Morty",
            url: "/cabecera/conics/Morty.html",
            category: "conics",
            type: "contenido",
            tags: ["morty", "dibujos", "rick", "arte"],
            icon: "🙌",
            relevance: 82
        },
        {
            title: "Generador de Fondos",
            description: "Generador de fondos de pantalla y fondos digitales",
            url: "/cabecera/conics/generador-de-fondos.html",
            category: "conics",
            type: "herramienta",
            tags: ["fondos", "wallpaper", "generador", "imágenes"],
            icon: "😃",
            relevance: 88
        },
        {
            title: "Estado de Ánimo",
            description: "Detector y visualizador de estados de ánimo",
            url: "/cabecera/conics/neocron.html",
            category: "conics",
            type: "herramienta",
            tags: ["ánimo", "emoción", "detector", "psicología"],
            icon: "😁",
            relevance: 85
        },
        {
            title: "Plataforma de Herramientas",
            description: "Plataforma centralizada de herramientas útiles",
            url: "/cabecera/conics/plataforma-de-herattientas.html",
            category: "conics",
            type: "plataforma",
            tags: ["plataforma", "herramientas", "utilidad", "centralizada"],
            icon: "🐱‍👤",
            relevance: 90
        }
    ],

    // Herramientas
    herramientas: [
        {
            title: "Chat bot Urukais",
            description: "Asistente virtual inteligente del ecosistema Urukais",
            url: "/cabecera/herramientas/chat.html",
            category: "herramientas",
            type: "asistente",
            tags: ["chat", "bot", "asistente", "inteligente"],
            icon: "🐸",
            relevance: 95
        },
        {
            title: "Control de Consultas",
            description: "Sistema de control y gestión de consultas",
            url: "/cabecera/herramientas/control-de-consultas.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["consultas", "control", "gestión", "sistema"],
            icon: "🗺",
            relevance: 87
        },
        {
            title: "DevStudio",
            description: "Entorno de desarrollo integrado para programadores",
            url: "/cabecera/herramientas/DevStudio.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["desarrollo", "programación", "studio", "ide"],
            icon: "✔",
            relevance: 92
        },
        {
            title: "FinTech",
            description: "Plataforma de tecnología financiera",
            url: "/cabecera/herramientas/FinTech.html",
            category: "herramientas",
            type: "plataforma",
            tags: ["fintech", "finanzas", "tecnología", "banca"],
            icon: "🌞",
            relevance: 88
        },
        {
            title: "Generador de Contraseñas",
            description: "Generador seguro de contraseñas personalizadas",
            url: "/cabecera/herramientas/generador-contraseñas.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["contraseñas", "seguridad", "generador", "cifrado"],
            icon: "👀",
            relevance: 90
        },
        {
            title: "Genesis Urukais",
            description: "Sistema de creación y generación de contenido",
            url: "/cabecera/herramientas/genesis.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["genesis", "creación", "contenido", "generación"],
            icon: "💖",
            relevance: 86
        },
        {
            title: "Herramientas Generales",
            description: "Colección de herramientas útiles para el día a día",
            url: "/cabecera/herramientas/herramienta.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["herramientas", "utilidad", "general", "diario"],
            icon: "🤷‍♂️",
            relevance: 84
        },
        {
            title: "Hot Urukais Klick",
            description: "Herramienta de análisis de tendencias y popularidad",
            url: "/cabecera/herramientas/hot.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["trends", "popularidad", "análisis", "calor"],
            icon: "🐱‍👓",
            relevance: 83
        },
        {
            title: "IA Educativa",
            description: "Plataforma de inteligencia artificial para educación",
            url: "/cabecera/herramientas/ia-educativa.html",
            category: "herramientas",
            type: "plataforma",
            tags: ["ia", "educación", "inteligencia artificial", "aprendizaje"],
            icon: "🍁",
            relevance: 91
        },
        {
            title: "Prons con Estilo",
            description: "Generador de contenidos con estilo profesional",
            url: "/cabecera/herramientas/listado-de-prons.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["profesional", "estilo", "contenido", "generación"],
            icon: "🐱‍🏍",
            relevance: 85
        },
        {
            title: "Localizador Urukais",
            description: "Sistema de localización y geolocalización avanzada",
            url: "/cabecera/herramientas/localizacion-de-faker.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["localización", "geolocalización", "mapas", "ubicación"],
            icon: "🐱‍🏍",
            relevance: 88
        },
        {
            title: "Más Datos",
            description: "Herramienta de análisis y procesamiento de datos",
            url: "/cabecera/herramientas/mas-datos.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["datos", "análisis", "procesamiento", "estadísticas"],
            icon: "🤦‍♀️",
            relevance: 87
        },
        {
            title: "Pruevas Urukais",
            description: "Suite de pruebas y testing para desarrollos",
            url: "/cabecera/herramientas/pruevas.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["pruebas", "testing", "calidad", "desarrollo"],
            icon: "💋",
            relevance: 84
        },
        {
            title: "Texto a Voz",
            description: "Convertidor de texto a voz con múltiples voces",
            url: "/cabecera/herramientas/texto-voz.html",
            category: "herramientas",
            type: "herramienta",
            tags: ["texto", "voz", "audio", "síntesis"],
            icon: "😎",
            relevance: 89
        },
        {
            title: "Tienda Urukais Klick",
            description: "Tienda online de productos del ecosistema Urukais",
            url: "/cabecera/herramientas/tienda-de-urukais.html",
            category: "herramientas",
            type: "tienda",
            tags: ["tienda", "productos", "comercio", "online"],
            icon: "🛒",
            relevance: 86
        }
    ],

    // Músicas
    musicas: [
        {
            title: "Música Atmosférica",
            description: "Colección de música ambiental y atmosférica",
            url: "/cabecera/musica/hadmed.html",
            category: "musicas",
            type: "contenido",
            tags: ["música", "ambiental", "atmósfera", "relajante"],
            icon: "✨",
            relevance: 88
        },
        {
            title: "Música y Más",
            description: "Plataforma musical con amplia variedad de géneros",
            url: "/cabecera/musica/mas.html",
            category: "musicas",
            type: "plataforma",
            tags: ["música", "géneros", "diversidad", "variedad"],
            icon: "😍",
            relevance: 90
        },
        {
            title: "Música Clásica",
            description: "Biblioteca completa de música clásica",
            url: "/cabecera/musica/musica-clasica.html",
            category: "musicas",
            type: "biblioteca",
            tags: ["clásica", "música", "biblioteca", "orquesta"],
            icon: "👌",
            relevance: 87
        },
        {
            title: "Múltiples Estilos",
            description: "Explorador de múltiples estilos musicales",
            url: "/cabecera/musica/prueva.html",
            category: "musicas",
            type: "contenido",
            tags: ["estilos", "múltiples", "géneros", "diversidad"],
            icon: "👏",
            relevance: 85
        },
        {
            title: "Partituras",
            description: "Biblioteca de partituras musicales",
            url: "/cabecera/musica/tartituras.html",
            category: "musicas",
            type: "biblioteca",
            tags: ["partituras", "música", "notas", "composición"],
            icon: "🎶",
            relevance: 86
        },
        {
            title: "Videos y Más",
            description: "Plataforma de videos musicales y contenido audiovisual",
            url: "/cabecera/musica/videos3.html",
            category: "musicas",
            type: "plataforma",
            tags: ["videos", "música", "audiovisual", "contenido"],
            icon: "🌹",
            relevance: 88
        }
    ],

    // Tierra y Más
    tierra: [
        {
            title: "Ambiental Mundial",
            description: "Plataforma de información ambiental global",
            url: "/cabecera/tierra/ambiental-mundial.html",
            category: "tierra",
            type: "contenido",
            tags: ["ambiental", "mundial", "ecología", "sostenibilidad"],
            icon: "👍",
            relevance: 89
        },
        {
            title: "Busca Ciudades",
            description: "Buscador de información sobre ciudades del mundo",
            url: "/cabecera/tierra/busca-ciudades.html",
            category: "tierra",
            type: "buscador",
            tags: ["ciudades", "búsqueda", "geografía", "urbano"],
            icon: "👀",
            relevance: 85
        },
        {
            title: "Busca Ciudad",
            description: "Buscador específico de información urbana",
            url: "/cabecera/tierra/busca-cuidad.html",
            category: "tierra",
            type: "buscador",
            tags: ["ciudad", "urbano", "información", "local"],
            icon: "🐱‍🐉",
            relevance: 82
        },
        {
            title: "Clima 33",
            description: "Información meteorológica y pronósticos del tiempo",
            url: "/cabecera/tierra/clima.html",
            category: "tierra",
            type: "herramienta",
            tags: ["clima", "tiempo", "meteorología", "pronóstico"],
            icon: "🎁",
            relevance: 88
        },
        {
            title: "Deforestación Mundial",
            description: "Información sobre la deforestación global",
            url: "/cabecera/tierra/deforestacion-mundial.html",
            category: "tierra",
            type: "contenido",
            tags: ["deforestación", "bosques", "medio ambiente", "conservación"],
            icon: "✔",
            relevance: 86
        },
        {
            title: "Guía de Supervivencia",
            description: "Guía completa de técnicas de supervivencia",
            url: "/cabecera/tierra/gia-de-supervivencia.html",
            category: "tierra",
            type: "guía",
            tags: ["supervivencia", "guía", "técnicas", "naturaleza"],
            icon: "🐱‍💻",
            relevance: 90
        },
        {
            title: "Más Recursos",
            description: "Colección adicional de recursos y herramientas",
            url: "/cabecera/tierra/mas.html",
            category: "tierra",
            type: "contenido",
            tags: ["recursos", "herramientas", "adicional", "utilidad"],
            icon: "🤷‍♀️",
            relevance: 80
        },
        {
            title: "Naturaleza",
            description: "Explorador de la naturaleza y biodiversidad",
            url: "/cabecera/tierra/naturaleza.html",
            category: "tierra",
            type: "contenido",
            tags: ["naturaleza", "biodiversidad", "ecosistema", "vida"],
            icon: "🥩",
            relevance: 87
        },
        {
            title: "Renacer Humildad",
            description: "Proyecto de renacimiento y sostenibilidad",
            url: "/cabecera/tierra/renacer.html",
            category: "tierra",
            type: "proyecto",
            tags: ["renacer", "humildad", "sostenibilidad", "regeneración"],
            icon: "🤞",
            relevance: 83
        },
        {
            title: "Sistema HR Inteligente",
            description: "Sistema inteligente de recursos humanos",
            url: "/cabecera/tierra/sistema-reus.html",
            category: "tierra",
            type: "sistema",
            tags: ["hr", "recursos humanos", "inteligente", "gestión"],
            icon: "🤳",
            relevance: 85
        },
        {
            title: "Supervivencia 33",
            description: "Protocolos avanzados de supervivencia",
            url: "/cabecera/tierra/supervivencia33.html",
            category: "tierra",
            type: "guía",
            tags: ["supervivencia", "protocolos", "avanzado", "emergencia"],
            icon: "😜",
            relevance: 84
        }
    ],

    // Proyectos destacados
    destacados: [
        {
            title: "Urukais Klick Pro",
            description: "Aplicación profesional del ecosistema Urukais",
            url: "https://zingy-pavlova-6aa6a6.netlify.app/",
            category: "proyecto",
            type: "aplicación",
            tags: ["profesional", "pro", "ecosistema", "aplicación"],
            icon: "🐸",
            relevance: 98
        },
        {
            title: "Clima Urukais",
            description: "Sistema meteorológico del ecosistema Urukais",
            url: "https://adorable-belekoy-d064de.netlify.app/",
            category: "proyecto",
            type: "aplicación",
            tags: ["clima", "meteorología", "sistema", "datos"],
            icon: "🌤️",
            relevance: 92
        },
        {
            title: "PokéDex Urukais",
            description: "Enciclopedia digital de las criaturas Urukais",
            url: "https://resplendent-faun-6147ea.netlify.app/",
            category: "proyecto",
            type: "enciclopedia",
            tags: ["pokédex", "criaturas", "enciclopedia", "digital"],
            icon: "🌟",
            relevance: 95
        },
        {
            title: "API Urukais Klick",
            description: "API RESTful para acceder a los datos del ecosistema",
            url: "https://cute-pegasus-a3487f.netlify.app/",
            category: "proyecto",
            type: "api",
            tags: ["api", "rest", "datos", "desarrollo"],
            icon: "🔑",
            relevance: 96
        },
        {
            title: "Plataforma Musical",
            description: "Plataforma musical completa del ecosistema",
            url: "https://stately-sherbet-955c30.netlify.app/musica",
            category: "proyecto",
            type: "plataforma",
            tags: ["música", "streaming", "plataforma", "audio"],
            icon: "🎵",
            relevance: 94
        }
    ],

    // Contenido interno
    contenido: [
        {
            title: "Heavy Metal Urukais",
            description: "Contenido musical de heavy metal del ecosistema",
            url: "/contenido/heavy-metal.html",
            category: "contenido",
            type: "contenido",
            tags: ["heavy metal", "música", "rock", "ecossistema"],
            icon: "🎸",
            relevance: 90
        },
        {
            title: "Biblioteca Digital",
            description: "Biblioteca completa de contenido digital",
            url: "/contenido/libros.html",
            category: "contenido",
            type: "biblioteca",
            tags: ["biblioteca", "digital", "libros", "lectura"],
            icon: "📚",
            relevance: 95
        },
        {
            title: "Centro Matrix",
            description: "Centro de búsqueda y filtrado avanzado",
            url: "/contenido/matrix.html",
            category: "contenido",
            type: "buscador",
            tags: ["matrix", "búsqueda", "filtrado", "avanzado"],
            icon: "🔍",
            relevance: 92
        },
        {
            title: "Ecosistema de Alforja",
            description: "Información sobre el ecosistema natural de Alforja",
            url: "/contenido/montanas.html",
            category: "contenido",
            type: "contenido",
            tags: ["alforja", "ecosistema", "montañas", "naturaleza"],
            icon: "🏔️",
            relevance: 88
        }
    ],

    // Portal Sagrado
    portales: [
        {
            title: "Base de Datos Urukais Klick",
            description: "Base de datos principal del ecosistema Urukais",
            url: "/enlaces/base-de-datos.html",
            category: "portales",
            type: "base de datos",
            tags: ["base de datos", "principal", "ecosistema", "información"],
            icon: "🏛️",
            relevance: 96
        },
        {
            title: "Inteligencia Artificial Urukais",
            description: "Sistema de IA del ecosistema Urukais",
            url: "/enlaces/accesible.html",
            category: "portales",
            type: "ia",
            tags: ["inteligencia artificial", "ia", "sistema", "automatización"],
            icon: "📚",
            relevance: 94
        },
        {
            title: "Aprendo en Público",
            description: "Plataforma de aprendizaje y desarrollo personal",
            url: "/enlaces/aprende.html",
            category: "portales",
            type: "educación",
            tags: ["aprendizaje", "desarrollo", "personal", "educación"],
            icon: "🔐",
            relevance: 89
        },
        {
            title: "Chat Bot Urukais",
            description: "Asistente virtual del ecosistema",
            url: "/enlaces/chat-bot.html",
            category: "portales",
            type: "asistente",
            tags: ["chat", "bot", "asistente", "virtual"],
            icon: "✨",
            relevance: 93
        },
        {
            title: "Biblioteca Ancestral",
            description: "Biblioteca de conocimiento ancestral",
            url: "/enlaces/portal-sagrado.html",
            category: "portales",
            type: "biblioteca",
            tags: ["biblioteca", "ancestral", "conocimiento", "sabiduría"],
            icon: "📖",
            relevance: 91
        }
    ]
};

// Función para obtener todos los datos
function getAllData() {
    const allData = [];
    Object.keys(URUKAIS_DATA).forEach(category => {
        allData.push(...URUKAIS_DATA[category]);
    });
    return allData;
}

// Función para obtener datos por categoría
function getDataByCategory(category) {
    return URUKAIS_DATA[category] || [];
}

// Función para buscar en los datos
function searchInData(query, category = 'all', type = 'all') {
    const allData = getAllData();
    const searchTerm = query.toLowerCase().trim();
    
    let filteredData = allData;
    
    // Filtrar por categoría
    if (category !== 'all') {
        filteredData = filteredData.filter(item => item.category === category);
    }
    
    // Filtrar por tipo
    if (type !== 'all') {
        filteredData = filteredData.filter(item => item.type === type);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
        filteredData = filteredData.filter(item => {
            const searchableText = [
                item.title,
                item.description,
                ...(item.tags || [])
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
        
        // Ordenar por relevancia
        filteredData.sort((a, b) => {
            const aRelevance = calculateRelevance(a, searchTerm);
            const bRelevance = calculateRelevance(b, searchTerm);
            return bRelevance - aRelevance;
        });
    }
    
    return filteredData;
}

// Función para calcular relevancia
function calculateRelevance(item, searchTerm) {
    let score = item.relevance || 50;
    
    const titleMatch = item.title.toLowerCase().includes(searchTerm);
    const descMatch = item.description.toLowerCase().includes(searchTerm);
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    
    if (titleMatch) score += 30;
    if (descMatch) score += 15;
    if (tagMatch) score += 10;
    
    return score;
}

// Sugerencias de búsqueda
const SEARCH_SUGGESTIONS = [
    'generador', 'animales', 'mascotas', 'deportes', 'marketing',
    'libros', 'matrix', 'tareas', 'proyectos', 'sostenible',
    'terror', 'nasa', 'biblioteca', 'noticias', 'streaming',
    'cocina', 'comida', 'cómics', 'chistes', 'arte',
    'chat bot', 'desarrollo', 'fintech', 'contraseñas', 'educación',
    'música', 'ambiental', 'clásica', 'videos', 'partituras',
    'ambiental', 'clima', 'supervivencia', 'naturaleza',
    'api', 'clima', 'pokédex', 'inteligencia artificial'
];

// Búsquedas recientes (se pueden almacenar en localStorage)
const RECENT_SEARCHES_KEY = 'urukais_recent_searches';

function getRecentSearches() {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
}

function addRecentSearch(searchTerm) {
    if (!searchTerm.trim()) return;
    
    const recent = getRecentSearches();
    const updated = [searchTerm, ...recent.filter(s => s !== searchTerm)].slice(0, 10);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function clearRecentSearches() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
}