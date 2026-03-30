# FASE 0 — SETUP DEL PROYECTO
**Sesión 1 de Claude Code**

---

## Contexto

Estamos construyendo el sistema de adquisición del Programa L.A.R.S.© — un gateway-landing para ejecutivos con burnout. Lee CLAUDE.md, docs/VISION.md y docs/DESIGN.md antes de hacer nada.

## Qué se hace

1. Lee CLAUDE.md + todos los docs del proyecto
2. Elige el stack técnico completo y justifica cada decisión
3. Configura el proyecto desde cero
4. Implementa el sistema de diseño completo de DESIGN.md como variables CSS y componentes base
5. Configura base de datos (estructura del FEATURE_GATEWAY_DESIGN.md, sección "Datos que se almacenan por usuario")
6. Configura deploy (Vercel o similar)
7. Genera docs/STACK.md, docs/ARCHITECTURE.md, docs/DATABASE.md, docs/SECURITY.md

## Entregable

- Proyecto corriendo en local y desplegado en staging
- docs/STACK.md generado con justificación de cada tecnología
- docs/ARCHITECTURE.md generado
- docs/DATABASE.md generado con schema del usuario
- docs/SECURITY.md generado
- Todos los tokens de diseño implementados (colores, tipografía, espaciado, breakpoints) como variables CSS
- Componentes base creados:
  - Botón (3 variantes: primario pill, secundario, ghost)
  - Card (bg-secondary, borde sutil, border-radius 16px)
  - Input (campo de email)
  - Badge (estados: nuevo, actualizado, disponible)
  - Separador sutil
  - Barra de progreso (3px, comportamiento no lineal)
  - Componente micro-espejo (borde izquierdo verde, fondo bg-secondary)
  - Componente bisagra (fondo con gradiente sutil, borde verde tenue)
- Fuentes cargadas: Cormorant Garamond + Inter + Inter Tight
- Base de datos con schema lista
- URL de staging funcionando

## Criterio de cierre

- [ ] El proyecto despliega sin errores
- [ ] Los componentes base se ven exactamente como describe DESIGN.md
- [ ] La base de datos acepta un registro de prueba
- [ ] Las 3 fuentes cargan correctamente
- [ ] Variables CSS centralizadas, ningún valor suelto
- [ ] Mobile-first: todo se ve correcto en 375px
- [ ] PROGRESS.md actualizado
