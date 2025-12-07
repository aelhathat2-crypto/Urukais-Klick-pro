#!/bin/bash

# =====================================================
# VERIFICADOR DE CONFIGURACIÓN - URUKAIS KLICK
# =====================================================
# Este script verifica que todos los archivos
# necesarios están en su lugar

echo "🔍 VERIFICANDO CONFIGURACIÓN DE URUKAIS KLICK..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de verificaciones
PASS=0
FAIL=0

# Función para verificar archivo
verificar_archivo() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 - EXISTE"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} $1 - NO ENCONTRADO"
        ((FAIL++))
    fi
}

# Función para verificar directorio
verificar_directorio() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/ - EXISTE"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} $1/ - NO ENCONTRADO"
        ((FAIL++))
    fi
}

echo "📁 VERIFICANDO DIRECTORIOS..."
verificar_directorio "javascript"
verificar_directorio "base de datos"
verificar_directorio "css"
verificar_directorio "contenido"
echo ""

echo "📄 VERIFICANDO ARCHIVOS CRÍTICOS..."
verificar_archivo "index.html"
verificar_archivo "javascript/supabase.js"
verificar_archivo "javascript/api.js"
verificar_archivo "autenticacion.html"
echo ""

echo "🔧 VERIFICANDO ARCHIVOS DE CONFIGURACIÓN..."
verificar_archivo ".env.example"
verificar_archivo ".gitignore"
verificar_archivo "package.json"
verificar_archivo "site.webmanifest"
echo ""

echo "📚 VERIFICANDO BASE DE DATOS..."
verificar_archivo "base de datos/setup-database.sql"
echo ""

echo "📖 VERIFICANDO DOCUMENTACIÓN..."
verificar_archivo "CONFIGURACION-RAPIDA.md"
verificar_archivo "SETUP-COMPLETADO.md"
echo ""

echo "==================================================="
echo ""
echo "📊 RESULTADOS:"
echo -e "  ${GREEN}✅ Verificadas: $PASS${NC}"
echo -e "  ${RED}❌ Faltantes: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✨ ¡TODO ESTÁ CORRECTO! Tu proyecto está completamente configurado.${NC}"
    echo ""
    echo "📝 PRÓXIMOS PASOS:"
    echo "  1. Crea el archivo .env.local con tus credenciales de Supabase"
    echo "  2. Ejecuta el script SQL en Supabase"
    echo "  3. Abre autenticacion.html para probar"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  ADVERTENCIA: Faltan $FAIL archivos.${NC}"
    echo ""
    echo "Por favor verifica que todos los archivos están creados."
    echo "Si necesitas ayuda, revisa CONFIGURACION-RAPIDA.md"
    echo ""
    exit 1
fi
