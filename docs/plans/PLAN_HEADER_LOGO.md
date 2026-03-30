# PLAN: Header + Logo en todas las páginas

**Prioridad:** Alta — identidad visual básica
**Dependencia:** Ninguna (se puede hacer en paralelo con los otros planes)
**Estimación:** 1 sesión

---

## ESTADO ACTUAL

- **No existe header.** La landing arranca directamente con el hero section.
- **No existe componente de navegación.** El layout.tsx solo tiene `<body>{children}</body>`.
- **El logo SVG existe** en `public/svg/Sin título-3 copia.svg` pero no se usa en ningún sitio.
- **Páginas afectadas:** Landing (`/`), Showcase (`/showcase`), Mapa Vivo (`/mapa/[hash]`), Pago Éxito (`/pago/exito`), Admin (`/admin/*`).

---

## DISEÑO DEL HEADER

### Especificación visual (según DESIGN.md)

```
Nav bar:
  Background: --color-bg-primary (#FFFBEF)
  Border-bottom: 1px solid rgba(30, 19, 16, 0.06)
  Height: 72px
  Position: sticky, top: 0, z-index: 100
```

### Comportamiento por página

| Página | Header | Logo | Extras |
|--------|--------|------|--------|
| **Landing (/)** | Sticky, transparente → opaco al scroll | Centrado | Sin nav links — nada que distraiga de P1 |
| **Showcase (/showcase)** | Sticky, opaco | Centrado | Opcional: link "← Volver" |
| **Mapa Vivo (/mapa/[hash])** | Sticky, opaco | Centrado | Sin nav — la persona está en SU espacio |
| **Pago Éxito** | Sticky, opaco | Centrado | Sin nav |
| **Admin** | Sticky, opaco | Izquierda o centrado | Links de admin a la derecha |

### Variante Landing — Comportamiento especial

La landing tiene un requisito del FEATURE_LANDING_DESIGN.md:

> "Mobile-first: 375px. Todo centrado. **Sin logo prominente.** Sin menú. Sin distracciones."

**Solución:** El header existe pero es **transparente** inicialmente, sin border-bottom. El logo aparece con opacity reducida (0.5) y al hacer scroll (>100px), el header adquiere fondo sólido + border + logo a opacity completa. Cuando el gateway se activa (usuario responde P1), el header se vuelve completamente opaco para dar contexto.

```
Estado inicial (hero visible):
  background: transparent
  border-bottom: none
  logo opacity: 0.5

Estado scroll (>100px):
  background: var(--color-bg-primary)
  border-bottom: 1px solid rgba(30, 19, 16, 0.06)
  logo opacity: 1
  transition: all 300ms ease

Estado gateway activo:
  background: var(--color-bg-primary)
  border-bottom: 1px solid rgba(30, 19, 16, 0.06)
  logo opacity: 1
```

---

## IMPLEMENTACIÓN

### Paso 1: Renombrar el SVG

El archivo actual se llama `Sin título-3 copia.svg` — nombre inaceptable para producción.

```
public/svg/Sin título-3 copia.svg → public/svg/logo-instituto-epigenetico.svg
```

### Paso 2: Componente `SiteHeader.tsx`

**Ubicación:** `src/components/SiteHeader.tsx`

```tsx
// Props:
interface SiteHeaderProps {
  variant?: 'default' | 'landing' | 'admin'
  // 'default' = opaco siempre (mapa, pago, showcase)
  // 'landing' = transparente → opaco al scroll/gateway
  // 'admin' = con links de admin
}
```

**Estructura:**
```
<header> (sticky, z-100)
  <div> (container, max-width, centered)
    <img src="/svg/logo-instituto-epigenetico.svg" />
      // Centrado con margin auto
      // Altura: ~28-32px (proporcional al header de 72px)
      // Color: hereda del SVG (verificar que el SVG use currentColor o sea compatible con tema claro)
  </div>
</header>
```

### Paso 3: Integrar en Layout

**Opción A (recomendada):** Añadir `SiteHeader` directamente en cada página que lo necesite, pasando la variante correcta. Esto da control granular.

```tsx
// page.tsx (landing)
<SiteHeader variant="landing" />
<ClientShell>...</ClientShell>

// mapa/[hash]/page.tsx
<SiteHeader variant="default" />
<MapaClient />

// showcase/page.tsx
<SiteHeader variant="default" />
<main>...</main>
```

**Opción B:** Ponerlo en `layout.tsx` con detección de ruta. Menos flexible pero más DRY.

**Recomendación:** Opción A. Son pocas páginas y cada una tiene requisitos diferentes.

### Paso 4: Verificar el SVG

El SVG del logo necesita revisión:
- ¿Usa `fill` con colores fijos o `currentColor`?
- ¿Es compatible con el fondo crema (#FFFBEF)?
- Si tiene colores fijos oscuros, funciona tal cual.
- Si tiene colores fijos claros (del tema anterior), hay que ajustar.
- Optimizar con SVGO si es pesado.

### Paso 5: Responsive

```
Mobile (375px):
  Header height: 56px
  Logo height: 24px
  Padding: 0 var(--container-padding-mobile)

Tablet (768px):
  Header height: 64px
  Logo height: 28px

Desktop (1024px+):
  Header height: 72px
  Logo height: 32px
```

---

## INTERACCIÓN CON EL GATEWAY

Cuando el usuario responde P1 y el gateway se activa como overlay fullscreen:

1. El header **se mantiene visible** encima del overlay del gateway.
2. El z-index del header (100) debe ser mayor que el del gateway overlay.
3. El logo da contexto: "estoy en un espacio del Instituto Epigenético."
4. **No hay botón de cerrar en el header.** El botón de cerrar del gateway ya existe dentro de cada bloque.

---

## CONSIDERACIONES

- **Performance:** El SVG debe ser inline o `<img>` según peso. Si < 5KB, inline. Si > 5KB, `<img>` con `loading="eager"`.
- **Accesibilidad:** El logo debe ser un `<a href="/">` con `aria-label="Instituto Epigenético — Ir al inicio"`.
- **Print:** `@media print { header { display: none; } }`

---

## CHECKLIST DE ENTREGA

- [ ] SVG renombrado a nombre de producción
- [ ] SVG verificado con tema claro (contraste sobre #FFFBEF)
- [ ] Componente `SiteHeader` creado con 3 variantes
- [ ] Landing: header transparente → opaco al scroll
- [ ] Landing: header opaco cuando gateway se activa
- [ ] Mapa vivo: header opaco con logo centrado
- [ ] Showcase: header opaco con logo centrado
- [ ] Pago éxito: header opaco con logo centrado
- [ ] Admin: header con variante admin
- [ ] Responsive verificado en 375px, 768px, 1024px+
- [ ] z-index superior al gateway overlay
- [ ] Logo clickable → vuelve a `/`
- [ ] prefers-reduced-motion: sin transición de opacidad

---

*Plan creado: 23 Marzo 2026*
