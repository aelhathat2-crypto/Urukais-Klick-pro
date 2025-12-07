    // Datos de la aplicación
        let contacts = JSON.parse(localStorage.getItem('agendaContacts')) || [];
        let currentContactId = null;
        let isEditing = false;

        // Elementos DOM
        const contactsTableBody = document.getElementById('contacts-table-body');
        const noContactsMessage = document.getElementById('no-contacts-message');
        const contactsCount = document.getElementById('contacts-count');
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const addContactBtn = document.getElementById('add-contact-btn');
        const exportContactsBtn = document.getElementById('export-contacts-btn');
        const importContactsBtn = document.getElementById('import-contacts-btn');
        const clearAllBtn = document.getElementById('clear-all-btn');
        const contactModal = document.getElementById('contact-modal');
        const confirmModal = document.getElementById('confirm-modal');
        const contactForm = document.getElementById('contact-form');
        const modalTitle = document.getElementById('modal-title');
        const closeModalBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const saveBtn = document.getElementById('save-btn');
        const closeConfirmBtn = document.getElementById('close-confirm');
        const confirmCancelBtn = document.getElementById('confirm-cancel');
        const confirmOkBtn = document.getElementById('confirm-ok');
        const confirmMessage = document.getElementById('confirm-message');

        // Expresiones regulares para validación
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\(\)\-\+]+$/;

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            renderContacts();
            setupEventListeners();
        });

        // Configurar event listeners
        function setupEventListeners() {
            // Búsqueda y filtrado
            searchInput.addEventListener('input', filterContacts);
            categoryFilter.addEventListener('change', filterContacts);
            
            // Botones de acción
            addContactBtn.addEventListener('click', openAddContactModal);
            exportContactsBtn.addEventListener('click', exportContacts);
            importContactsBtn.addEventListener('click', importContacts);
            clearAllBtn.addEventListener('click', confirmClearAll);
            
            // Modal de contacto
            closeModalBtn.addEventListener('click', closeContactModal);
            cancelBtn.addEventListener('click', closeContactModal);
            contactForm.addEventListener('submit', saveContact);
            
            // Modal de confirmación
            closeConfirmBtn.addEventListener('click', closeConfirmModal);
            confirmCancelBtn.addEventListener('click', closeConfirmModal);
            confirmOkBtn.addEventListener('click', executeConfirmedAction);
        }

        // Renderizar lista de contactos
        function renderContacts(contactsToRender = contacts) {
            contactsTableBody.innerHTML = '';
            
            if (contactsToRender.length === 0) {
                noContactsMessage.style.display = 'block';
                contactsCount.textContent = '0 contactos';
                return;
            }
            
            noContactsMessage.style.display = 'none';
            contactsCount.textContent = `${contactsToRender.length} contacto${contactsToRender.length !== 1 ? 's' : ''}`;
            
            // Ordenar contactos alfabéticamente
            const sortedContacts = [...contactsToRender].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            
            sortedContacts.forEach(contact => {
                const row = document.createElement('tr');
                
                // Determinar clase de categoría
                let categoryClass = 'category-personal';
                if (contact.category === 'Profesional') categoryClass = 'category-professional';
                else if (contact.category === 'Familia') categoryClass = 'category-family';
                else if (contact.category === 'Amigos') categoryClass = 'category-friends';
                else if (contact.category === 'Trabajo') categoryClass = 'category-professional';
                
                row.innerHTML = `
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td><span class="contact-category ${categoryClass}">${contact.category}</span></td>
                    <td>${contact.company || ''}</td>
                    <td class="contact-actions">
                        <button class="action-btn edit-btn" data-id="${contact.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="action-btn delete-btn" data-id="${contact.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                `;
                
                contactsTableBody.appendChild(row);
            });
            
            // Agregar event listeners a los botones de editar y eliminar
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const contactId = this.getAttribute('data-id');
                    editContact(contactId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const contactId = this.getAttribute('data-id');
                    confirmDeleteContact(contactId);
                });
            });
        }

        // Filtrar contactos
        function filterContacts() {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            
            const filteredContacts = contacts.filter(contact => {
                const matchesSearch = 
                    contact.name.toLowerCase().includes(searchTerm) ||
                    contact.email.toLowerCase().includes(searchTerm) ||
                    contact.phone.toLowerCase().includes(searchTerm) ||
                    (contact.company && contact.company.toLowerCase().includes(searchTerm)) ||
                    (contact.address && contact.address.toLowerCase().includes(searchTerm)) ||
                    (contact.position && contact.position.toLowerCase().includes(searchTerm)) ||
                    (contact.notes && contact.notes.toLowerCase().includes(searchTerm));
                
                const matchesCategory = !category || contact.category === category;
                
                return matchesSearch && matchesCategory;
            });
            
            renderContacts(filteredContacts);
        }

        // Abrir modal para agregar contacto
        function openAddContactModal() {
            isEditing = false;
            currentContactId = null;
            modalTitle.textContent = 'Nuevo Contacto';
            contactForm.reset();
            hideAllErrors();
            contactModal.style.display = 'flex';
        }

        // Cerrar modal de contacto
        function closeContactModal() {
            contactModal.style.display = 'none';
        }

        // Editar contacto
        function editContact(contactId) {
            const contact = contacts.find(c => c.id === contactId);
            if (!contact) return;
            
            isEditing = true;
            currentContactId = contactId;
            modalTitle.textContent = 'Editar Contacto';
            
            // Llenar el formulario con los datos del contacto
            document.getElementById('name').value = contact.name;
            document.getElementById('email').value = contact.email;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('address').value = contact.address || '';
            document.getElementById('birthdate').value = contact.birthdate || '';
            document.getElementById('category').value = contact.category;
            document.getElementById('company').value = contact.company || '';
            document.getElementById('position').value = contact.position || '';
            document.getElementById('notes').value = contact.notes || '';
            
            hideAllErrors();
            contactModal.style.display = 'flex';
        }

        // Guardar contacto (crear o actualizar)
        function saveContact(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const birthdate = document.getElementById('birthdate').value;
            const category = document.getElementById('category').value;
            const company = document.getElementById('company').value.trim();
            const position = document.getElementById('position').value.trim();
            const notes = document.getElementById('notes').value.trim();
            
            // Validar campos
            if (!validateForm(name, email, phone)) {
                return;
            }
            
            // Crear objeto de contacto
            const contact = {
                name,
                email,
                phone,
                address,
                birthdate,
                category,
                company,
                position,
                notes
            };
            
            if (isEditing) {
                // Actualizar contacto existente
                contact.id = currentContactId;
                updateContact(contact);
            } else {
                // Crear nuevo contacto
                contact.id = generateId();
                contacts.push(contact);
            }
            
            // Guardar en localStorage
            saveToLocalStorage();
            
            // Actualizar la vista
            renderContacts();
            filterContacts();
            
            // Cerrar modal
            closeContactModal();
            
            // Mostrar mensaje de éxito
            alert(`Contacto ${isEditing ? 'actualizado' : 'agregado'} correctamente`);
        }

        // Validar formulario
        function validateForm(name, email, phone) {
            let isValid = true;
            hideAllErrors();
            
            if (!name) {
                showError('name-error');
                isValid = false;
            }
            
            if (!email || !emailRegex.test(email)) {
                showError('email-error');
                isValid = false;
            }
            
            if (!phone || !phoneRegex.test(phone)) {
                showError('phone-error');
                isValid = false;
            }
            
            return isValid;
        }

        // Mostrar error de validación
        function showError(errorId) {
            document.getElementById(errorId).style.display = 'block';
        }

        // Ocultar todos los errores
        function hideAllErrors() {
            document.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });
        }

        // Actualizar contacto
        function updateContact(updatedContact) {
            const index = contacts.findIndex(c => c.id === updatedContact.id);
            if (index !== -1) {
                contacts[index] = updatedContact;
            }
        }

        // Confirmar eliminación de contacto
        function confirmDeleteContact(contactId) {
            const contact = contacts.find(c => c.id === contactId);
            if (!contact) return;
            
            currentContactId = contactId;
            confirmMessage.textContent = `¿Está seguro de que desea eliminar el contacto de ${contact.name}?`;
            confirmModal.style.display = 'flex';
        }

        // Eliminar contacto
        function deleteContact(contactId) {
            contacts = contacts.filter(c => c.id !== contactId);
            saveToLocalStorage();
            renderContacts();
            filterContacts();
            alert('Contacto eliminado correctamente');
        }

        // Confirmar limpiar todos los contactos
        function confirmClearAll() {
            if (contacts.length === 0) {
                alert('No hay contactos para eliminar');
                return;
            }
            
            currentContactId = null;
            confirmMessage.textContent = '¿Está seguro de que desea eliminar todos los contactos? Esta acción no se puede deshacer.';
            confirmModal.style.display = 'flex';
        }

        // Limpiar todos los contactos
        function clearAllContacts() {
            contacts = [];
            saveToLocalStorage();
            renderContacts();
            alert('Todos los contactos han sido eliminados');
        }

        // Cerrar modal de confirmación
        function closeConfirmModal() {
            confirmModal.style.display = 'none';
        }

        // Ejecutar acción confirmada
        function executeConfirmedAction() {
            if (currentContactId) {
                deleteContact(currentContactId);
            } else {
                clearAllContacts();
            }
            closeConfirmModal();
        }

        // Exportar contactos
        function exportContacts() {
            if (contacts.length === 0) {
                alert('No hay contactos para exportar');
                return;
            }
            
            const dataStr = JSON.stringify(contacts, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `agenda_contactos_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }

        // Importar contactos
        function importContacts() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        const importedContacts = JSON.parse(event.target.result);
                        
                        if (!Array.isArray(importedContacts)) {
                            throw new Error('El archivo no contiene una lista válida de contactos');
                        }
                        
                        // Validar estructura de cada contacto
                        for (const contact of importedContacts) {
                            if (!contact.name || !contact.email || !contact.phone) {
                                throw new Error('El archivo contiene contactos con estructura inválida');
                            }
                        }
                        
                        const shouldReplace = confirm(
                            '¿Desea reemplazar los contactos actuales o agregar los nuevos?\n\n' +
                            'Aceptar: Reemplazar contactos actuales\nCancelar: Agregar nuevos contactos'
                        );
                        
                        if (shouldReplace) {
                            // Reemplazar contactos
                            contacts = importedContacts;
                        } else {
                            // Agregar contactos (evitando duplicados por nombre)
                            const existingNames = new Set(contacts.map(c => c.name));
                            
                            for (const contact of importedContacts) {
                                if (!existingNames.has(contact.name)) {
                                    contact.id = generateId();
                                    contacts.push(contact);
                                }
                            }
                        }
                        
                        saveToLocalStorage();
                        renderContacts();
                        filterContacts();
                        
                        alert('Contactos importados correctamente');
                    } catch (error) {
                        alert(`Error al importar contactos: ${error.message}`);
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        }

        // Guardar en localStorage
        function saveToLocalStorage() {
            localStorage.setItem('agendaContacts', JSON.stringify(contacts));
        }

        // Generar ID único
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Simular iconos de FontAwesome si no están disponibles
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const style = document.createElement('style');
            style.textContent = `
                .fas:before {
                    content: "✓";
                    margin-right: 5px;
                }
                .fa-search:before { content: "🔍"; }
                .fa-plus:before { content: "+"; }
                .fa-file-export:before { content: "📤"; }
                .fa-file-import:before { content: "📥"; }
                .fa-trash:before { content: "🗑"; }
                .fa-address-book:before { content: "📒"; }
                .fa-edit:before { content: "✏"; }
            `;
            document.head.appendChild(style);
        }