/**
 * BIBLIOTECA DIGITAL - SISTEMA DE GESTIÓN COMPLETO
 * Desarrollado con JavaScript Vanilla
 * Funcionalidades: Libros, Usuarios, Préstamos
 * Persistencia: localStorage
 * Autor: MiniMax Agent
 */

// ==============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ==============================================

const CONFIG = {
    // Claves para localStorage
    STORAGE_KEYS: {
        LIBROS: 'biblioteca_libros',
        USUARIOS: 'biblioteca_usuarios',
        PRESTAMOS: 'biblioteca_prestamos'
    },
    
    // Configuración de préstamos
    PRESTAMO_CONFIG: {
        DIAS_PRESTAMO: 14,
        DIAS_ADVERTENCIA: 3
    },
    
    // Categorías de libros
    CATEGORIAS: [
        'Ficción', 'No Ficción', 'Ciencia', 'Tecnología', 
        'Historia', 'Biografías', 'Infantil'
    ]
};

// Estado global de la aplicación
let estadoApp = {
    libros: [],
    usuarios: [],
    prestamos: [],
    libroEditando: null,
    usuarioEditando: null
};

// ==============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==============================================

/**
 * Inicializa la aplicación cuando se carga el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Biblioteca Digital...');
    
    // Cargar datos desde localStorage
    cargarDatos();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Inicializar fechas en formularios
    inicializarFechas();
    
    // Renderizar contenido inicial
    renderizarContenido();
    
    // Actualizar estadísticas
    actualizarEstadisticas();
    
    console.log('✅ Biblioteca Digital inicializada correctamente');
});

/**
 * Carga todos los datos desde localStorage
 */
function cargarDatos() {
    try {
        // Cargar libros
        const librosGuardados = localStorage.getItem(CONFIG.STORAGE_KEYS.LIBROS);
        estadoApp.libros = librosGuardados ? JSON.parse(librosGuardados) : [];
        
        // Cargar usuarios
        const usuariosGuardados = localStorage.getItem(CONFIG.STORAGE_KEYS.USUARIOS);
        estadoApp.usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
        
        // Cargar préstamos
        const prestamosGuardados = localStorage.getItem(CONFIG.STORAGE_KEYS.PRESTAMOS);
        estadoApp.prestamos = prestamosGuardados ? JSON.parse(prestamosGuardados) : [];
        
        // Si no hay datos, cargar datos de ejemplo
        if (estadoApp.libros.length === 0) {
            cargarDatosEjemplo();
        }
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarNotificacion('Error al cargar los datos guardados', 'error');
    }
}

/**
 * Carga datos de ejemplo para demostrar la funcionalidad
 */
function cargarDatosEjemplo() {
    const librosEjemplo = [
        {
            id: generarId(),
            titulo: "Cien Años de Soledad",
            autor: "Gabriel García Márquez",
            isbn: "978-0307474728",
            anio: 1967,
            categoria: "Ficción",
            descripcion: "Una obra maestra del realismo mágico que narra la historia de la familia Buendía en el pueblo ficticio de Macondo.",
            ubicacion: "Estantería A, Sección 1",
            disponible: true,
            fechaCreacion: new Date().toISOString()
        },
        {
            id: generarId(),
            titulo: "El Ingenioso Hidalgo Don Quijote de la Mancha",
            autor: "Miguel de Cervantes",
            isbn: "978-8420471839",
            anio: 1605,
            categoria: "Ficción",
            descripcion: "La obra cumbre de la literatura española, aventuras del caballero andante Don Quijote.",
            ubicacion: "Estantería A, Sección 2",
            disponible: true,
            fechaCreacion: new Date().toISOString()
        },
        {
            id: generarId(),
            titulo: "1984",
            autor: "George Orwell",
            isbn: "978-0451524935",
            anio: 1949,
            categoria: "Ficción",
            descripcion: "Distopía sobre un futuro totalitario donde el Gran Hermano lo ve todo.",
            ubicacion: "Estantería A, Sección 3",
            disponible: false,
            fechaCreacion: new Date().toISOString()
        },
        {
            id: generarId(),
            titulo: "Sapiens: De Animales a Dioses",
            autor: "Yuval Noah Harari",
            isbn: "978-0062316110",
            anio: 2011,
            categoria: "No Ficción",
            descripcion: "Una breve historia de la humanidad, desde los orígenes hasta la era moderna.",
            ubicacion: "Estantería B, Sección 1",
            disponible: true,
            fechaCreacion: new Date().toISOString()
        },
        {
            id: generarId(),
            titulo: "El Universo en una Cáscara de Nuez",
            autor: "Stephen Hawking",
            isbn: "978-0553802021",
            anio: 2001,
            categoria: "Ciencia",
            descripcion: "Explicación accesible de los misterios del cosmos y la física moderna.",
            ubicacion: "Estantería C, Sección 1",
            disponible: true,
            fechaCreacion: new Date().toISOString()
        }
    ];
    
    const usuariosEjemplo = [
        {
            id: generarId(),
            nombre: "Ana García López",
            identificacion: "12345678A",
            email: "ana.garcia@email.com",
            telefono: "+34 600 123 456",
            direccion: "Calle Mayor 123, Madrid",
            fechaRegistro: new Date().toISOString(),
            prestamosActivos: 2
        },
        {
            id: generarId(),
            nombre: "Carlos Rodríguez Martínez",
            identificacion: "87654321B",
            email: "carlos.rodriguez@email.com",
            telefono: "+34 600 654 321",
            direccion: "Avenida Libertad 45, Barcelona",
            fechaRegistro: new Date().toISOString(),
            prestamosActivos: 1
        }
    ];
    
    estadoApp.libros = librosEjemplo;
    estadoApp.usuarios = usuariosEjemplo;
    
    // Guardar datos de ejemplo
    guardarDatos();
}

/**
 * Configura todos los event listeners
 */
function configurarEventListeners() {
    // Navegación por pestañas
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => cambiarSeccion(e.target.dataset.tab));
    });
    
    // Búsqueda en tiempo real
    const inputBusquedaLibros = document.getElementById('busquedaLibros');
    if (inputBusquedaLibros) {
        inputBusquedaLibros.addEventListener('input', filtrarLibros);
    }
    
    const inputBusquedaUsuarios = document.getElementById('busquedaUsuarios');
    if (inputBusquedaUsuarios) {
        inputBusquedaUsuarios.addEventListener('input', filtrarUsuarios);
    }
    
    // Filtros
    const filtroCategoria = document.getElementById('filtroCategoria');
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', filtrarLibros);
    }
    
    const filtroDisponibilidad = document.getElementById('filtroDisponibilidad');
    if (filtroDisponibilidad) {
        filtroDisponibilidad.addEventListener('change', filtrarLibros);
    }
    
    const filtroEstadoPrestamos = document.getElementById('filtroEstadoPrestamos');
    if (filtroEstadoPrestamos) {
        filtroEstadoPrestamos.addEventListener('change', filtrarPrestamos);
    }
    
    // Formularios
    configurarFormularios();
    
    // Cerrar modales con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });
}

/**
 * Configura los event listeners de los formularios
 */
function configurarFormularios() {
    // Formulario de libro
    const formLibro = document.getElementById('formularioLibro');
    if (formLibro) {
        formLibro.addEventListener('submit', manejarEnvioFormularioLibro);
    }
    
    // Formulario de usuario
    const formUsuario = document.getElementById('formularioUsuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', manejarEnvioFormularioUsuario);
    }
    
    // Formulario de préstamo
    const formPrestamo = document.getElementById('formularioPrestamo');
    if (formPrestamo) {
        formPrestamo.addEventListener('submit', manejarEnvioFormularioPrestamo);
    }
    
    // Configurar fecha mínima para préstamos
    const fechaPrestamo = document.getElementById('fechaPrestamo');
    if (fechaPrestamo) {
        fechaPrestamo.addEventListener('change', () => {
            const fechaDevolucion = document.getElementById('fechaDevolucion');
            if (fechaDevolucion) {
                fechaDevolucion.min = fechaPrestamo.value;
            }
        });
    }
}

/**
 * Inicializa las fechas en los formularios
 */
function inicializarFechas() {
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + CONFIG.PRESTAMO_CONFIG.DIAS_PRESTAMO);
    
    const fechaPrestamo = document.getElementById('fechaPrestamo');
    const fechaDevolucion = document.getElementById('fechaDevolucion');
    
    if (fechaPrestamo) {
        fechaPrestamo.value = hoy.toISOString().split('T')[0];
    }
    
    if (fechaDevolucion) {
        fechaDevolucion.value = mañana.toISOString().split('T')[0];
        fechaDevolucion.min = hoy.toISOString().split('T')[0];
    }
}

// ==============================================
// FUNCIONES DE NAVEGACIÓN
// ==============================================

/**
 * Cambia la sección activa de la aplicación
 * @param {string} seccion - Nombre de la sección a mostrar
 */
function cambiarSeccion(seccion) {
    // Actualizar navegación
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${seccion}"]`).classList.add('active');
    
    // Actualizar contenido
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(seccion).classList.add('active');
    
    // Renderizar contenido específico
    switch(seccion) {
        case 'libros':
            renderizarLibros();
            break;
        case 'usuarios':
            renderizarUsuarios();
            break;
        case 'prestamos':
            renderizarPrestamos();
            break;
    }
    
    // Actualizar estadísticas
    actualizarEstadisticas();
}

/**
 * Renderiza el contenido inicial
 */
function renderizarContenido() {
    renderizarLibros();
    renderizarUsuarios();
    renderizarPrestamos();
}

// ==============================================
// GESTIÓN DE LIBROS
// ==============================================

/**
 * Muestra el formulario para agregar/editar un libro
 * @param {Object} libro - Libro a editar (null para nuevo)
 */
function mostrarFormularioLibro(libro = null) {
    const modal = document.getElementById('modalLibro');
    const titulo = document.getElementById('tituloFormularioLibro');
    const btnGuardar = document.getElementById('btnGuardarLibro');
    
    estadoApp.libroEditando = libro;
    
    if (libro) {
        // Modo edición
        titulo.textContent = 'Editar Libro';
        btnGuardar.innerHTML = '<span class="btn-icon">💾</span>Actualizar Libro';
        
        // Llenar formulario con datos del libro
        document.getElementById('libroTitulo').value = libro.titulo;
        document.getElementById('libroAutor').value = libro.autor;
        document.getElementById('libroIsbn').value = libro.isbn || '';
        document.getElementById('libroAnio').value = libro.anio || '';
        document.getElementById('libroCategoria').value = libro.categoria;
        document.getElementById('libroDescripcion').value = libro.descripcion || '';
        document.getElementById('libroUbicacion').value = libro.ubicacion || '';
    } else {
        // Modo nuevo
        titulo.textContent = 'Agregar Nuevo Libro';
        btnGuardar.innerHTML = '<span class="btn-icon">💾</span>Guardar Libro';
        
        // Limpiar formulario
        document.getElementById('formularioLibro').reset();
    }
    
    mostrarModal('modalLibro');
}

/**
 * Maneja el envío del formulario de libro
 * @param {Event} event - Evento del formulario
 */
function manejarEnvioFormularioLibro(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const libro = {
        titulo: formData.get('libroTitulo') || document.getElementById('libroTitulo').value,
        autor: formData.get('libroAutor') || document.getElementById('libroAutor').value,
        isbn: formData.get('libroIsbn') || document.getElementById('libroIsbn').value,
        anio: parseInt(formData.get('libroAnio') || document.getElementById('libroAnio').value) || null,
        categoria: formData.get('libroCategoria') || document.getElementById('libroCategoria').value,
        descripcion: formData.get('libroDescripcion') || document.getElementById('libroDescripcion').value,
        ubicacion: formData.get('libroUbicacion') || document.getElementById('libroUbicacion').value,
        disponible: true,
        fechaCreacion: new Date().toISOString()
    };
    
    // Validaciones
    if (!libro.titulo || !libro.autor || !libro.categoria) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    try {
        if (estadoApp.libroEditando) {
            // Actualizar libro existente
            const index = estadoApp.libros.findIndex(l => l.id === estadoApp.libroEditando.id);
            if (index !== -1) {
                libro.id = estadoApp.libroEditando.id;
                libro.disponible = estadoApp.libroEditando.disponible;
                estadoApp.libros[index] = { ...estadoApp.libros[index], ...libro };
                mostrarNotificacion('Libro actualizado correctamente', 'exito');
            }
        } else {
            // Agregar nuevo libro
            libro.id = generarId();
            estadoApp.libros.push(libro);
            mostrarNotificacion('Libro agregado correctamente', 'exito');
        }
        
        // Guardar y actualizar
        guardarDatos();
        renderizarLibros();
        cerrarModal('modalLibro');
        actualizarEstadisticas();
        
    } catch (error) {
        console.error('Error al guardar libro:', error);
        mostrarNotificacion('Error al guardar el libro', 'error');
    }
}

/**
 * Renderiza la lista de libros con filtros aplicados
 */
function renderizarLibros() {
    const container = document.getElementById('listaLibros');
    const emptyState = document.getElementById('librosVacios');
    
    if (!container) return;
    
    // Obtener filtros actuales
    const busqueda = document.getElementById('busquedaLibros')?.value.toLowerCase() || '';
    const categoria = document.getElementById('filtroCategoria')?.value || '';
    const disponibilidad = document.getElementById('filtroDisponibilidad')?.value || '';
    
    // Filtrar libros
    let librosFiltrados = estadoApp.libros.filter(libro => {
        const coincideBusqueda = !busqueda || 
            libro.titulo.toLowerCase().includes(busqueda) ||
            libro.autor.toLowerCase().includes(busqueda) ||
            (libro.isbn && libro.isbn.toLowerCase().includes(busqueda));
            
        const coincideCategoria = !categoria || libro.categoria === categoria;
        const coincideDisponibilidad = !disponibilidad || 
            (disponibilidad === 'disponible' && libro.disponible) ||
            (disponibilidad === 'prestado' && !libro.disponible);
            
        return coincideBusqueda && coincideCategoria && coincideDisponibilidad;
    });
    
    // Mostrar estado vacío si no hay libros
    if (librosFiltrados.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Renderizar libros
    container.innerHTML = librosFiltrados.map(libro => crearTarjetaLibro(libro)).join('');
}

/**
 * Crea la HTML para una tarjeta de libro
 * @param {Object} libro - Objeto libro
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaLibro(libro) {
    const estadoClass = libro.disponible ? 'disponible' : 'prestado';
    const estadoText = libro.disponible ? 'Disponible' : 'Prestado';
    
    return `
        <div class="libro-card">
            <div class="libro-header">
                <h3 class="libro-titulo">${escapeHtml(libro.titulo)}</h3>
                <span class="libro-estado ${estadoClass}">${estadoText}</span>
            </div>
            <p class="libro-autor">Por ${escapeHtml(libro.autor)}</p>
            <div class="libro-info">
                <span>📅 ${libro.anio || 'N/A'}</span>
                <span>🏷️ ${escapeHtml(libro.categoria)}</span>
                <span>📍 ${escapeHtml(libro.ubicacion || 'No especificada')}</span>
                <span>📚 ${libro.isbn || 'Sin ISBN'}</span>
            </div>
            <p class="libro-descripcion">${escapeHtml(libro.descripcion || 'Sin descripción disponible')}</p>
            <div class="libro-acciones">
                <button class="btn-secondary btn-sm" onclick="mostrarFormularioLibro(${JSON.stringify(libro).replace(/"/g, '&quot;')})">
                    ✏️ Editar
                </button>
                <button class="btn-danger btn-sm" onclick="eliminarLibro('${libro.id}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;
}

/**
 * Filtra libros en tiempo real
 */
function filtrarLibros() {
    renderizarLibros();
}

/**
 * Elimina un libro del sistema
 * @param {string} libroId - ID del libro a eliminar
 */
function eliminarLibro(libroId) {
    const libro = estadoApp.libros.find(l => l.id === libroId);
    if (!libro) return;
    
    // Verificar si el libro está prestado
    const prestamosActivos = estadoApp.prestamos.filter(p => 
        p.libroId === libroId && p.estado === 'activo'
    );
    
    if (prestamosActivos.length > 0) {
        mostrarNotificacion('No se puede eliminar un libro que está en préstamo', 'error');
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${libro.titulo}"?`)) {
        try {
            estadoApp.libros = estadoApp.libros.filter(l => l.id !== libroId);
            guardarDatos();
            renderizarLibros();
            actualizarEstadisticas();
            mostrarNotificacion('Libro eliminado correctamente', 'exito');
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            mostrarNotificacion('Error al eliminar el libro', 'error');
        }
    }
}

// ==============================================
// GESTIÓN DE USUARIOS
// ==============================================

/**
 * Muestra el formulario para agregar/editar un usuario
 * @param {Object} usuario - Usuario a editar (null para nuevo)
 */
function mostrarFormularioUsuario(usuario = null) {
    const modal = document.getElementById('modalUsuario');
    const titulo = document.getElementById('tituloFormularioUsuario');
    const btnGuardar = document.getElementById('btnGuardarUsuario');
    
    estadoApp.usuarioEditando = usuario;
    
    if (usuario) {
        // Modo edición
        titulo.textContent = 'Editar Usuario';
        btnGuardar.innerHTML = '<span class="btn-icon">💾</span>Actualizar Usuario';
        
        // Llenar formulario con datos del usuario
        document.getElementById('usuarioNombre').value = usuario.nombre;
        document.getElementById('usuarioIdentificacion').value = usuario.identificacion;
        document.getElementById('usuarioEmail').value = usuario.email;
        document.getElementById('usuarioTelefono').value = usuario.telefono || '';
        document.getElementById('usuarioDireccion').value = usuario.direccion || '';
    } else {
        // Modo nuevo
        titulo.textContent = 'Registrar Nuevo Usuario';
        btnGuardar.innerHTML = '<span class="btn-icon">👤</span>Registrar Usuario';
        
        // Limpiar formulario
        document.getElementById('formularioUsuario').reset();
    }
    
    mostrarModal('modalUsuario');
}

/**
 * Maneja el envío del formulario de usuario
 * @param {Event} event - Evento del formulario
 */
function manejarEnvioFormularioUsuario(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const usuario = {
        nombre: formData.get('usuarioNombre') || document.getElementById('usuarioNombre').value,
        identificacion: formData.get('usuarioIdentificacion') || document.getElementById('usuarioIdentificacion').value,
        email: formData.get('usuarioEmail') || document.getElementById('usuarioEmail').value,
        telefono: formData.get('usuarioTelefono') || document.getElementById('usuarioTelefono').value,
        direccion: formData.get('usuarioDireccion') || document.getElementById('usuarioDireccion').value,
        fechaRegistro: new Date().toISOString(),
        prestamosActivos: 0
    };
    
    // Validaciones
    if (!usuario.nombre || !usuario.identificacion || !usuario.email) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Validar email
    if (!validarEmail(usuario.email)) {
        mostrarNotificacion('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Verificar que la identificación no exista
    const identificacionExiste = estadoApp.usuarios.some(u => 
        u.identificacion === usuario.identificacion && 
        (!estadoApp.usuarioEditando || u.id !== estadoApp.usuarioEditando.id)
    );
    
    if (identificacionExiste) {
        mostrarNotificacion('Ya existe un usuario con esa identificación', 'error');
        return;
    }
    
    try {
        if (estadoApp.usuarioEditando) {
            // Actualizar usuario existente
            const index = estadoApp.usuarios.findIndex(u => u.id === estadoApp.usuarioEditando.id);
            if (index !== -1) {
                usuario.id = estadoApp.usuarioEditando.id;
                usuario.prestamosActivos = estadoApp.usuarioEditando.prestamosActivos;
                estadoApp.usuarios[index] = { ...estadoApp.usuarios[index], ...usuario };
                mostrarNotificacion('Usuario actualizado correctamente', 'exito');
            }
        } else {
            // Agregar nuevo usuario
            usuario.id = generarId();
            estadoApp.usuarios.push(usuario);
            mostrarNotificacion('Usuario registrado correctamente', 'exito');
        }
        
        // Guardar y actualizar
        guardarDatos();
        renderizarUsuarios();
        cerrarModal('modalUsuario');
        actualizarEstadisticas();
        actualizarSelectoresUsuarios();
        
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        mostrarNotificacion('Error al registrar el usuario', 'error');
    }
}

/**
 * Renderiza la lista de usuarios
 */
function renderizarUsuarios() {
    const container = document.getElementById('listaUsuarios');
    const emptyState = document.getElementById('usuariosVacios');
    
    if (!container) return;
    
    // Obtener búsqueda
    const busqueda = document.getElementById('busquedaUsuarios')?.value.toLowerCase() || '';
    
    // Filtrar usuarios
    let usuariosFiltrados = estadoApp.usuarios.filter(usuario => {
        return !busqueda || 
            usuario.nombre.toLowerCase().includes(busqueda) ||
            usuario.email.toLowerCase().includes(busqueda) ||
            usuario.identificacion.toLowerCase().includes(busqueda);
    });
    
    // Mostrar estado vacío si no hay usuarios
    if (usuariosFiltrados.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Renderizar usuarios
    container.innerHTML = usuariosFiltrados.map(usuario => crearTarjetaUsuario(usuario)).join('');
}

/**
 * Crea la HTML para una tarjeta de usuario
 * @param {Object} usuario - Objeto usuario
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaUsuario(usuario) {
    return `
        <div class="usuario-card">
            <h3 class="usuario-nombre">${escapeHtml(usuario.nombre)}</h3>
            <div class="usuario-info">
                <span>🆔 ${escapeHtml(usuario.identificacion)}</span>
                <span>📅 ${formatearFecha(usuario.fechaRegistro)}</span>
            </div>
            <div class="usuario-contacto">
                <div class="usuario-email">
                    📧 ${escapeHtml(usuario.email)}
                </div>
                ${usuario.telefono ? `<div class="usuario-telefono">📞 ${escapeHtml(usuario.telefono)}</div>` : ''}
            </div>
            <div class="usuario-prestamos">
                📚 ${usuario.prestamosActivos} préstamo${usuario.prestamosActivos !== 1 ? 's' : ''} activo${usuario.prestamosActivos !== 1 ? 's' : ''}
            </div>
            <div class="libro-acciones">
                <button class="btn-secondary btn-sm" onclick="mostrarFormularioUsuario(${JSON.stringify(usuario).replace(/"/g, '&quot;')})">
                    ✏️ Editar
                </button>
                <button class="btn-danger btn-sm" onclick="eliminarUsuario('${usuario.id}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;
}

/**
 * Filtra usuarios en tiempo real
 */
function filtrarUsuarios() {
    renderizarUsuarios();
}

/**
 * Elimina un usuario del sistema
 * @param {string} usuarioId - ID del usuario a eliminar
 */
function eliminarUsuario(usuarioId) {
    const usuario = estadoApp.usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;
    
    // Verificar si el usuario tiene préstamos activos
    const prestamosActivos = estadoApp.prestamos.filter(p => 
        p.usuarioId === usuarioId && p.estado === 'activo'
    );
    
    if (prestamosActivos.length > 0) {
        mostrarNotificacion('No se puede eliminar un usuario con préstamos activos', 'error');
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar a "${usuario.nombre}"?`)) {
        try {
            estadoApp.usuarios = estadoApp.usuarios.filter(u => u.id !== usuarioId);
            guardarDatos();
            renderizarUsuarios();
            actualizarEstadisticas();
            actualizarSelectoresUsuarios();
            mostrarNotificacion('Usuario eliminado correctamente', 'exito');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            mostrarNotificacion('Error al eliminar el usuario', 'error');
        }
    }
}

// ==============================================
// SISTEMA DE PRÉSTAMOS
// ==============================================

/**
 * Muestra el formulario para registrar un nuevo préstamo
 */
function mostrarFormularioPrestamo() {
    const modal = document.getElementById('modalPrestamo');
    
    // Limpiar formulario
    document.getElementById('formularioPrestamo').reset();
    
    // Inicializar fechas
    inicializarFechas();
    
    // Actualizar selectores
    actualizarSelectorUsuarios();
    actualizarSelectorLibros();
    
    mostrarModal('modalPrestamo');
}

/**
 * Maneja el envío del formulario de préstamo
 * @param {Event} event - Evento del formulario
 */
function manejarEnvioFormularioPrestamo(event) {
    event.preventDefault();
    
    const usuarioId = document.getElementById('prestamoUsuario').value;
    const libroId = document.getElementById('prestamoLibro').value;
    const fechaPrestamo = document.getElementById('fechaPrestamo').value;
    const fechaDevolucion = document.getElementById('fechaDevolucion').value;
    const observaciones = document.getElementById('prestamoObservaciones').value;
    
    // Validaciones
    if (!usuarioId || !libroId || !fechaPrestamo || !fechaDevolucion) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Verificar que el libro esté disponible
    const libro = estadoApp.libros.find(l => l.id === libroId);
    if (!libro || !libro.disponible) {
        mostrarNotificacion('El libro seleccionado no está disponible', 'error');
        return;
    }
    
    // Verificar que el usuario existe
    const usuario = estadoApp.usuarios.find(u => u.id === usuarioId);
    if (!usuario) {
        mostrarNotificacion('El usuario seleccionado no existe', 'error');
        return;
    }
    
    // Crear préstamo
    const prestamo = {
        id: generarId(),
        usuarioId: usuarioId,
        libroId: libroId,
        fechaPrestamo: fechaPrestamo,
        fechaDevolucion: fechaDevolucion,
        fechaDevolucionReal: null,
        estado: 'activo',
        observaciones: observaciones,
        fechaCreacion: new Date().toISOString()
    };
    
    try {
        // Agregar préstamo
        estadoApp.prestamos.push(prestamo);
        
        // Marcar libro como no disponible
        libro.disponible = false;
        
        // Actualizar contador de préstamos activos del usuario
        usuario.prestamosActivos = (usuario.prestamosActivos || 0) + 1;
        
        // Guardar y actualizar
        guardarDatos();
        renderizarPrestamos();
        cerrarModal('modalPrestamo');
        actualizarEstadisticas();
        
        mostrarNotificacion('Préstamo registrado correctamente', 'exito');
        
    } catch (error) {
        console.error('Error al registrar préstamo:', error);
        mostrarNotificacion('Error al registrar el préstamo', 'error');
    }
}

/**
 * Renderiza la lista de préstamos activos
 */
function renderizarPrestamos() {
    const container = document.getElementById('listaPrestamosActivos');
    const emptyState = document.getElementById('prestamosVacios');
    
    if (!container) return;
    
    // Obtener filtro
    const filtro = document.getElementById('filtroEstadoPrestamos')?.value || '';
    
    // Filtrar préstamos
    let prestamosFiltrados = estadoApp.prestamos.filter(prestamo => {
        if (filtro === 'activo') return prestamo.estado === 'activo';
        if (filtro === 'vencido') return prestamo.estado === 'activo' && esPrestamoVencido(prestamo);
        if (filtro === 'devuelto') return prestamo.estado === 'devuelto';
        return true; // Todos
    });
    
    // Ordenar por fecha de creación (más recientes primero)
    prestamosFiltrados.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    
    // Mostrar estado vacío si no hay préstamos
    if (prestamosFiltrados.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Renderizar préstamos
    container.innerHTML = prestamosFiltrados.map(prestamo => crearTarjetaPrestamo(prestamo)).join('');
}

/**
 * Crea la HTML para una tarjeta de préstamo
 * @param {Object} prestamo - Objeto préstamo
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaPrestamo(prestamo) {
    const libro = estadoApp.libros.find(l => l.id === prestamo.libroId);
    const usuario = estadoApp.usuarios.find(u => u.id === prestamo.usuarioId);
    
    if (!libro || !usuario) {
        return '<div class="prestamo-card">Error: Datos inconsistentes</div>';
    }
    
    const esVencido = esPrestamoVencido(prestamo);
    const diasRestantes = calcularDiasRestantes(prestamo);
    const estadoClass = esVencido ? 'vencido' : 'activo';
    const estadoText = esVencido ? 'Vencido' : 'Activo';
    const diasText = esVencido ? `${Math.abs(diasRestantes)} día(s) de retraso` : `${diasRestantes} día(s) restantes`;
    
    return `
        <div class="prestamo-card ${estadoClass}">
            <div class="prestamo-header">
                <h3 class="prestamo-libro">${escapeHtml(libro.titulo)}</h3>
                <span class="prestamo-estado">${estadoText}</span>
            </div>
            <p class="prestamo-usuario">👤 ${escapeHtml(usuario.nombre)}</p>
            <div class="prestamo-fechas">
                <div class="fecha-item">
                    <span class="fecha-label">Préstamo</span>
                    <span class="fecha-valor">${formatearFecha(prestamo.fechaPrestamo)}</span>
                </div>
                <div class="fecha-item">
                    <span class="fecha-label">Devolución</span>
                    <span class="fecha-valor">${formatearFecha(prestamo.fechaDevolucion)}</span>
                </div>
            </div>
            <div class="prestamo-dias ${estadoClass}">
                ${diasText}
            </div>
            ${prestamo.observaciones ? `<p class="prestamo-observaciones">💭 ${escapeHtml(prestamo.observaciones)}</p>` : ''}
            <div class="prestamo-acciones">
                <button class="btn-primary btn-sm" onclick="registrarDevolucion('${prestamo.id}')">
                    📥 Devolver
                </button>
                <button class="btn-secondary btn-sm" onclick="extenderPrestamo('${prestamo.id}')">
                    ⏰ Extender
                </button>
            </div>
        </div>
    `;
}

/**
 * Registra la devolución de un libro
 * @param {string} prestamoId - ID del préstamo
 */
function registrarDevolucion(prestamoId) {
    const prestamo = estadoApp.prestamos.find(p => p.id === prestamoId);
    if (!prestamo) return;
    
    if (confirm('¿Confirmas la devolución de este libro?')) {
        try {
            // Actualizar préstamo
            prestamo.estado = 'devuelto';
            prestamo.fechaDevolucionReal = new Date().toISOString().split('T')[0];
            
            // Marcar libro como disponible
            const libro = estadoApp.libros.find(l => l.id === prestamo.libroId);
            if (libro) {
                libro.disponible = true;
            }
            
            // Actualizar contador de préstamos activos del usuario
            const usuario = estadoApp.usuarios.find(u => u.id === prestamo.usuarioId);
            if (usuario && usuario.prestamosActivos > 0) {
                usuario.prestamosActivos--;
            }
            
            // Guardar y actualizar
            guardarDatos();
            renderizarPrestamos();
            actualizarEstadisticas();
            
            const esTardio = esPrestamoVencido(prestamo);
            const mensaje = esTardio ? 'Devolución registrada (con retraso)' : 'Devolución registrada correctamente';
            mostrarNotificacion(mensaje, esTardio ? 'advertencia' : 'exito');
            
        } catch (error) {
            console.error('Error al registrar devolución:', error);
            mostrarNotificacion('Error al registrar la devolución', 'error');
        }
    }
}

/**
 * Extiende el plazo de un préstamo
 * @param {string} prestamoId - ID del préstamo
 */
function extenderPrestamo(prestamoId) {
    const prestamo = estadoApp.prestamos.find(p => p.id === prestamoId);
    if (!prestamo || prestamo.estado !== 'activo') return;
    
    const extension = prompt('¿Cuántos días deseas extender el préstamo?', '7');
    if (extension && !isNaN(extension) && extension > 0) {
        try {
            const fechaActual = new Date(prestamo.fechaDevolucion);
            fechaActual.setDate(fechaActual.getDate() + parseInt(extension));
            prestamo.fechaDevolucion = fechaActual.toISOString().split('T')[0];
            
            guardarDatos();
            renderizarPrestamos();
            mostrarNotificacion(`Préstamo extendido ${extension} días`, 'exito');
            
        } catch (error) {
            console.error('Error al extender préstamo:', error);
            mostrarNotificacion('Error al extender el préstamo', 'error');
        }
    }
}

/**
 * Muestra el historial completo de préstamos
 */
function mostrarHistorialPrestamos() {
    const modal = document.getElementById('modalHistorial');
    const container = document.getElementById('listaHistorialPrestamos');
    
    if (!container) return;
    
    // Renderizar historial
    const prestamos = [...estadoApp.prestamos].sort((a, b) => 
        new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    );
    
    if (prestamos.length === 0) {
        container.innerHTML = '<p class="text-center">No hay préstamos en el historial</p>';
    } else {
        container.innerHTML = prestamos.map(prestamo => crearItemHistorial(prestamo)).join('');
    }
    
    mostrarModal('modalHistorial');
}

/**
 * Crea un item del historial de préstamos
 * @param {Object} prestamo - Objeto préstamo
 * @returns {string} HTML del item
 */
function crearItemHistorial(prestamo) {
    const libro = estadoApp.libros.find(l => l.id === prestamo.libroId);
    const usuario = estadoApp.usuarios.find(u => u.id === prestamo.usuarioId);
    
    if (!libro || !usuario) return '';
    
    const estado = prestamo.estado;
    const claseEstado = estado === 'devuelto' ? 'devuelto' : (esPrestamoVencido(prestamo) ? 'vencido' : 'activo');
    
    return `
        <div class="historial-item ${claseEstado}">
            <div class="historial-header">
                <strong>${escapeHtml(libro.titulo)}</strong>
                <span class="historial-estado">${estado.toUpperCase()}</span>
            </div>
            <div class="historial-info">
                <span>👤 ${escapeHtml(usuario.nombre)}</span>
                <span>📅 ${formatearFecha(prestamo.fechaPrestamo)} → ${formatearFecha(prestamo.fechaDevolucion)}</span>
                ${prestamo.fechaDevolucionReal ? `<span>📥 Devuelto: ${formatearFecha(prestamo.fechaDevolucionReal)}</span>` : ''}
            </div>
        </div>
    `;
}

/**
 * Filtra préstamos
 */
function filtrarPrestamos() {
    renderizarPrestamos();
}

// ==============================================
// FUNCIONES DE UTILIDAD
// ==============================================

/**
 * Actualiza las estadísticas en el header
 */
function actualizarEstadisticas() {
    document.getElementById('totalLibros').textContent = estadoApp.libros.length;
    document.getElementById('totalUsuarios').textContent = estadoApp.usuarios.length;
    document.getElementById('totalPrestamos').textContent = estadoApp.prestamos.filter(p => p.estado === 'activo').length;
}

/**
 * Actualiza el selector de usuarios en el formulario de préstamo
 */
function actualizarSelectorUsuarios() {
    const selector = document.getElementById('prestamoUsuario');
    if (!selector) return;
    
    const usuariosDisponibles = estadoApp.usuarios;
    selector.innerHTML = '<option value="">Selecciona un usuario</option>' +
        usuariosDisponibles.map(usuario => 
            `<option value="${usuario.id}">${escapeHtml(usuario.nombre)} (${escapeHtml(usuario.identificacion)})</option>`
        ).join('');
}

/**
 * Actualiza el selector de libros en el formulario de préstamo
 */
function actualizarSelectorLibros() {
    const selector = document.getElementById('prestamoLibro');
    if (!selector) return;
    
    const librosDisponibles = estadoApp.libros.filter(libro => libro.disponible);
    selector.innerHTML = '<option value="">Selecciona un libro disponible</option>' +
        librosDisponibles.map(libro => 
            `<option value="${libro.id}">${escapeHtml(libro.titulo)} - ${escapeHtml(libro.autor)}</option>`
        ).join('');
}

/**
 * Actualiza ambos selectores de préstamos
 */
function actualizarSelectoresUsuarios() {
    actualizarSelectorUsuarios();
    actualizarSelectorLibros();
}

/**
 * Verifica si un préstamo está vencido
 * @param {Object} prestamo - Objeto préstamo
 * @returns {boolean} True si está vencido
 */
function esPrestamoVencido(prestamo) {
    if (prestamo.estado !== 'activo') return false;
    const fechaDevolucion = new Date(prestamo.fechaDevolucion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaDevolucion < hoy;
}

/**
 * Calcula los días restantes para un préstamo
 * @param {Object} prestamo - Objeto préstamo
 * @returns {number} Días restantes (negativo si está vencido)
 */
function calcularDiasRestantes(prestamo) {
    if (prestamo.estado !== 'activo') return 0;
    
    const fechaDevolucion = new Date(prestamo.fechaDevolucion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaDevolucion.setHours(0, 0, 0, 0);
    
    const diferencia = fechaDevolucion.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

/**
 * Guarda todos los datos en localStorage
 */
function guardarDatos() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.LIBROS, JSON.stringify(estadoApp.libros));
        localStorage.setItem(CONFIG.STORAGE_KEYS.USUARIOS, JSON.stringify(estadoApp.usuarios));
        localStorage.setItem(CONFIG.STORAGE_KEYS.PRESTAMOS, JSON.stringify(estadoApp.prestamos));
    } catch (error) {
        console.error('Error al guardar datos:', error);
        throw error;
    }
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} texto - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Formatea una fecha para mostrar
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==============================================
// SISTEMA DE MODALES
// ==============================================

/**
 * Muestra un modal
 * @param {string} modalId - ID del modal
 */
function mostrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Cierra un modal
 * @param {string} modalId - ID del modal
 */
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Cierra todos los modales abiertos
 */
function cerrarTodosLosModales() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
}

// ==============================================
// SISTEMA DE NOTIFICACIONES
// ==============================================

/**
 * Muestra una notificación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo: 'exito', 'error', 'advertencia', 'info'
 * @param {number} duracion - Duración en ms (opcional)
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 4000) {
    const container = document.getElementById('notificaciones');
    if (!container) return;
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    const titulo = {
        'exito': '¡Éxito!',
        'error': '¡Error!',
        'advertencia': '¡Advertencia!',
        'info': 'Información'
    }[tipo] || 'Notificación';
    
    notificacion.innerHTML = `
        <div class="notificacion-header">
            <span class="notificacion-titulo">${titulo}</span>
            <button class="notificacion-cerrar" onclick="cerrarNotificacion(this)">&times;</button>
        </div>
        <div class="notificacion-mensaje">${escapeHtml(mensaje)}</div>
    `;
    
    container.appendChild(notificacion);
    
    // Auto-cerrar después de la duración especificada
    setTimeout(() => {
        if (notificacion.parentNode) {
            cerrarNotificacion(notificacion.querySelector('.notificacion-cerrar'));
        }
    }, duracion);
}

/**
 * Cierra una notificación específica
 * @param {Element} boton - Botón de cerrar
 */
function cerrarNotificacion(boton) {
    const notificacion = boton.closest('.notificacion');
    if (notificacion) {
        notificacion.style.animation = 'notificacionSlideOut 0.3s ease-out';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }
}

// Agregar animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes notificacionSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==============================================
// EVENTOS GLOBALES ADICIONALES
// ==============================================

// Cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        cerrarModal(e.target.id);
    }
});

// Limpiar estado de edición al cerrar modales
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        estadoApp.libroEditando = null;
        estadoApp.usuarioEditando = null;
    }
});

console.log('📚 Biblioteca Digital - JavaScript cargado correctamente');