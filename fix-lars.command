#!/bin/bash
# ============================================
# SCRIPT DE REPARACIÓN - Proyecto LARS
# Haz doble clic en este archivo para ejecutar
# ============================================

clear
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   REPARACIÓN DEL PROYECTO LARS           ║"
echo "║   No cierres esta ventana                ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Ir a la carpeta del script (= carpeta del proyecto)
cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"
echo "📁 Carpeta del proyecto: $PROJECT_DIR"
echo ""

# ============================================
# PASO 1: Limpiar basura de npm en home
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 1/5: Limpiando paquetes basura del home..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d "$HOME/node_modules" ]; then
    echo "  → Encontrada carpeta node_modules en home (no debería estar ahí)"
    rm -rf "$HOME/node_modules"
    echo "  ✓ Eliminada"
else
    echo "  ✓ No hay basura en home"
fi
if [ -f "$HOME/package-lock.json" ]; then
    rm -f "$HOME/package-lock.json"
    echo "  ✓ Eliminado package-lock.json de home"
fi
if [ -f "$HOME/package.json" ] && grep -q '"name": "lars-project"' "$HOME/package.json" 2>/dev/null; then
    echo "  ⚠ Hay un package.json en home - NO lo borro por seguridad"
fi
echo ""

# ============================================
# PASO 2: Comprobar espacio en disco
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 2/5: Comprobando espacio en disco..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
AVAILABLE=$(df -h / | tail -1 | awk '{print $4}')
echo "  → Espacio disponible: $AVAILABLE"
echo ""

# ============================================
# PASO 3: Borrar .next y node_modules
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 3/5: Limpiando build anterior..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  → Borrando .next (caché del build)..."
rm -rf "$PROJECT_DIR/.next" 2>/dev/null
echo "  ✓ .next eliminado"
echo "  → Borrando node_modules (dependencias)..."
rm -rf "$PROJECT_DIR/node_modules" 2>/dev/null
echo "  ✓ node_modules eliminado"
echo ""

# ============================================
# PASO 4: Reinstalar dependencias
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 4/5: Instalando dependencias (1-2 min)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm install 2>&1
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error instalando dependencias."
    echo "   Comprueba tu conexión a internet e inténtalo de nuevo."
    echo ""
    echo "Pulsa cualquier tecla para cerrar..."
    read -n 1
    exit 1
fi
echo "  ✓ Dependencias instaladas correctamente"
echo ""

# ============================================
# PASO 5: Build
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 5/5: Haciendo build (2-3 min)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build 2>&1
BUILD_RESULT=$?
echo ""

if [ $BUILD_RESULT -eq 0 ]; then
    echo "╔══════════════════════════════════════════╗"
    echo "║  ✅ ¡TODO CORRECTO!                      ║"
    echo "║                                          ║"
    echo "║  El proyecto compila sin errores.         ║"
    echo "║  Puedes hacer deploy con:                 ║"
    echo "║    npx vercel --prod                      ║"
    echo "║  O simplemente hacer push a GitHub        ║"
    echo "║  y Vercel lo despliega automáticamente.   ║"
    echo "╚══════════════════════════════════════════╝"
else
    echo "╔══════════════════════════════════════════╗"
    echo "║  ❌ HAY ERRORES EN EL BUILD               ║"
    echo "║                                          ║"
    echo "║  Revisa los errores de arriba.            ║"
    echo "║  Copia esta ventana y compártela          ║"
    echo "║  para que pueda ayudarte.                 ║"
    echo "╚══════════════════════════════════════════╝"
fi

echo ""
echo "Pulsa cualquier tecla para cerrar..."
read -n 1
