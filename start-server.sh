#!/bin/bash
# Inicia el servidor estático en puerto 5000

echo "🚀 Iniciando servidor Urukais Klick..."
echo "📍 URL: http://localhost:5000"
echo "🔧 Configuración: http://localhost:5000/configurar-credenciales.html"
echo "🌐 Autenticación: http://localhost:5000/autenticacion.html"
echo ""
echo "Presiona CTRL+C para detener el servidor"
echo ""

node start-static-server.cjs 5000
