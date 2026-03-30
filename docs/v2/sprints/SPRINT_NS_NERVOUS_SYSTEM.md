# SPRINT NS — The Living Nervous System

> **Priority:** CRITICAL — this is the VISUAL SOUL of the entire experience.
> **Read first:** `docs/v2/EXPERIENCE_STANDARDS.md` (all sections)
> **Depends on:** Sprint 2 (zones must exist), Sprint 3 (hero structure must exist)
> **Runs AFTER:** Sprint 3 (hero + progress bar), BEFORE Sprint 4a (bisagra)
> **Estimated effort:** 1 dedicated session (complex canvas work)

---

## THE VISION

The nervous system is not a background decoration. It is **the visual protagonist** of the entire gateway — a living, breathing organism that mirrors the user's journey from fragmentation to clarity.

When the user arrives, they see a nervous system that is **desregulated**: fragmented connections, irregular pulses, low energy. As they progress through the gateway answering questions, the system **responds** — connections form, pulses stabilize, energy flows. By the bisagra, the system **freezes** in anticipation. At the result, it reflects their score — still fragmented if critical, or flowing if healthy.

The nervous system IS the user. The metaphor is literal. And the user will feel it without anyone telling them.

**Reference level:** Stripe's animated gradient background (WebGL mesh that feels alive), combined with the organic flowing quality of ambient canvas animations (Codrops), but serving a NARRATIVE purpose — not just aesthetics.

---

## TECHNICAL APPROACH: Canvas, not SVG

The current SVG implementation is too limited. We need:

- **Canvas 2D** for the nervous system rendering (performance, particle count, smooth animation)
- The canvas sits as a full-viewport background layer behind all content (`position: fixed, z-index: 0`)
- All gateway UI layers sit on top (`z-index: 1+`)
- The canvas renders at device pixel ratio for crisp lines on retina
- Uses `requestAnimationFrame` for 60fps animation loop
- Respects `prefers-reduced-motion` → static simplified version

**Why Canvas over SVG:**
- We need 50-100+ particles flowing along paths — SVG can't handle this smoothly
- Real-time interaction (cursor/scroll response) is smoother in Canvas
- The organic, flowing aesthetic requires continuous redraw, not DOM manipulation

**Performance budget:**
- < 5% CPU on idle animation
- < 15% CPU during active interaction
- Canvas resolution can drop on low-power devices (detect via `navigator.hardwareConcurrency`)

---

## ARCHITECTURE: The Neural Network Object

### Data Structure
```javascript
class NervousSystem {
  constructor(canvas) {
    this.nodes = [];          // 12-18 primary nodes (nerve centers)
    this.connections = [];    // Paths between nodes (nerve pathways)
    this.particles = [];      // Light particles flowing along connections
    this.state = 'fragmented'; // fragmented | awakening | flowing | frozen | resolved
    this.energy = 0.3;        // 0-1, controls overall system vitality
    this.coherence = 0.2;     // 0-1, controls how orderly the pulses are
    this.mouseInfluence = { x: 0, y: 0, radius: 150, active: false };
  }
}
```

### The 5 States (mapped to gateway progress)

```
STATE 1: FRAGMENTED (Landing → P2)
├── Visible connections: 40% of total (gaps in the network)
├── Node pulse: irregular (random timing 2-5s, random amplitude)
├── Particles: few (8-12), slow, sometimes stalling mid-path
├── Color: text-muted (#6B7280) at 15% opacity
├── Coherence: 0.2
├── Energy: 0.3
├── Feeling: "Something is not working right"
│
STATE 2: AWAKENING (P3 → P6)
├── Visible connections: 65% (new connections drawing on)
├── Node pulse: semi-regular (3-4s, converging rhythm)
├── Particles: moderate (15-25), gaining speed
├── Color: transitioning muted → accent (#6B7280 → #c6c8ee at 20%)
├── Coherence: 0.5
├── Energy: 0.55
├── Feeling: "Something is starting to connect"
│
STATE 3: FLOWING (P7 → P8)
├── Visible connections: 85% (nearly complete network)
├── Node pulse: rhythmic (3s cycle, synchronized wave)
├── Particles: many (25-40), flowing smoothly along paths
├── Color: accent (#c6c8ee) at 25% opacity
├── Coherence: 0.75
├── Energy: 0.7
├── Feeling: "The system is reading me, it's alive"
│
STATE 4: FROZEN (Bisagra — "Calculando tu perfil...")
├── ALL animation stops over 800ms
├── Particles freeze mid-path
├── Nodes hold at current brightness
├── A single pulse radiates outward from center (the "scan")
├── Color: holds at current state
├── Coherence: N/A (frozen)
├── Energy: 0 → building
├── Feeling: "Everything is holding its breath"
│
STATE 5: RESOLVED (Score reveal → Email → Result)
├── Score < 30 (CRITICAL): connections fragment again, red tint
│   pulses (#F87171 at 10%), energy 0.35 — "Your system IS this"
├── Score 30-50 (MODERATE): partial connections, yellow-accent mix
│   (#FACC15 blending to #c6c8ee at 20%), energy 0.55
├── Score > 50 (HEALTHY): full network, calm green-accent flow
│   (#4ADE80 blending to #c6c8ee at 20%), energy 0.8
├── Feeling: "This IS my nervous system. I can see it."
```

---

## PART A: The Canvas Foundation

### Canvas Setup
```javascript
// Canvas fills entire viewport, fixed behind content
const canvas = document.createElement('canvas');
canvas.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;
document.body.prepend(canvas);

// Retina support
const dpr = Math.min(window.devicePixelRatio || 1, 2);
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);
```

### Node Layout (responsive)
```
DESKTOP (>768px): 15-18 nodes
- Nodes arranged in a loose vertical spine (center of viewport)
- with branching connections left and right
- Overall shape suggests a spinal column with branching nerves
- Nodes are positioned using a parametric curve + noise offset
- The spine runs from 15% to 85% of viewport height

MOBILE (375px): 10-12 nodes
- Same spine concept but fewer branches
- Nodes are larger (compensate for smaller screen)
- More vertically compressed
- Touch interaction replaces mouse hover

Layout algorithm:
1. Generate spine centerline (slight S-curve using sine wave)
2. Place primary nodes along spine at irregular intervals
3. For each primary node, generate 0-2 branch nodes offset horizontally
4. Connect nodes with cubic bezier curves (organic, not straight lines)
5. Add noise to node positions each frame (subtle drift, amplitude 1-3px)
```

### Node Object
```javascript
class Node {
  constructor(x, y, type) {
    this.x = x;              // Base x position
    this.y = y;              // Base y position
    this.type = type;         // 'spine' | 'branch' | 'terminal'
    this.radius = type === 'spine' ? 4 : type === 'branch' ? 3 : 2;
    this.phase = Math.random() * Math.PI * 2;  // For pulse timing
    this.pulseSpeed = 0.8 + Math.random() * 0.4; // Irregularity
    this.brightness = 0;      // Current glow (0-1)
    this.noiseOffsetX = Math.random() * 1000;
    this.noiseOffsetY = Math.random() * 1000;
  }

  update(time, systemState) {
    // Drift position with Perlin/simplex noise
    const drift = noise2D(this.noiseOffsetX + time * 0.0003, this.noiseOffsetY);
    this.renderX = this.x + drift * 2;
    this.renderY = this.y + drift * 2;

    // Pulse based on system coherence
    if (systemState.coherence < 0.3) {
      // FRAGMENTED: irregular, random pulse
      this.brightness = 0.3 + Math.sin(time * 0.001 * this.pulseSpeed + this.phase) * 0.2;
    } else if (systemState.coherence < 0.6) {
      // AWAKENING: converging toward shared rhythm
      const shared = Math.sin(time * 0.001);
      const personal = Math.sin(time * 0.001 * this.pulseSpeed + this.phase);
      this.brightness = 0.4 + (shared * systemState.coherence + personal * (1 - systemState.coherence)) * 0.3;
    } else {
      // FLOWING: synchronized wave propagation
      const wavePhase = this.y * 0.003; // Wave travels along spine
      this.brightness = 0.5 + Math.sin(time * 0.0015 + wavePhase) * 0.3;
    }
  }
}
```

### Connection Object
```javascript
class Connection {
  constructor(nodeA, nodeB) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.visible = false;     // Starts hidden, reveals with state progression
    this.drawProgress = 0;    // 0-1, for stroke-draw animation
    this.controlPoints = this.generateBezierControl(); // Organic curve
  }

  generateBezierControl() {
    // Generate a control point that creates an organic curve
    // Offset perpendicular to the line between nodes
    const midX = (this.nodeA.x + this.nodeB.x) / 2;
    const midY = (this.nodeA.y + this.nodeB.y) / 2;
    const perpX = -(this.nodeB.y - this.nodeA.y) * 0.2;
    const perpY = (this.nodeB.x - this.nodeA.x) * 0.2;
    return {
      cp1x: midX + perpX + (Math.random() - 0.5) * 30,
      cp1y: midY + perpY + (Math.random() - 0.5) * 30,
    };
  }
}
```

### Particle Object (the flowing light signals)
```javascript
class Particle {
  constructor(connection) {
    this.connection = connection;
    this.t = 0;                // Position along bezier (0-1)
    this.speed = 0.003 + Math.random() * 0.004; // Travel speed
    this.size = 1.5 + Math.random() * 1.5;
    this.brightness = 0.4 + Math.random() * 0.4;
    this.trail = [];           // Last 5 positions for trailing glow
  }

  update(systemEnergy) {
    this.t += this.speed * systemEnergy;
    if (this.t > 1) {
      this.t = 0; // Loop back
      // Optionally: transfer to a connecting path for network traversal
    }

    // Store trail positions
    const pos = this.getPosition();
    this.trail.unshift(pos);
    if (this.trail.length > 5) this.trail.pop();
  }

  getPosition() {
    // Calculate position on bezier curve at parameter t
    return bezierPoint(
      this.connection.nodeA,
      this.connection.controlPoints,
      this.connection.nodeB,
      this.t
    );
  }
}
```

---

## PART B: Mouse/Touch Interaction

### Desktop — Cursor Proximity
```
When cursor moves over the canvas area:
1. Detect cursor position relative to viewport
2. Nodes within 150px radius of cursor:
   - Brightness increases by 0.3 (additive)
   - Radius increases by 1.5px
   - Connections between activated nodes glow brighter
3. Particles near cursor accelerate slightly (speed × 1.5)
4. A subtle radial glow follows the cursor (rgba accent, 0.05 opacity, 100px radius)
5. When cursor leaves the area, everything fades back over 600ms

This creates the feeling: "my presence activates the system"
— reinforcing the product-philosophy principle that the user DOES
before they SEE. Their cursor IS the first interaction.
```

### Mobile — Scroll Reactivity
```
On mobile, there's no hover. Instead:
1. Scroll velocity affects system energy:
   - Scrolling: energy temporarily boosts by 0.2
   - Stopped: energy returns to state baseline over 1000ms
2. Touch on the viewport area:
   - Nodes near touch point brighten (same as cursor)
   - Single ripple pulse radiates from touch point
   - 200ms duration, accent color, expanding ring
3. Scroll position affects which nodes are most visible:
   - Nodes near the center of the viewport are brighter
   - Creates a "spotlight" effect that follows scroll position
```

### Interaction Code
```javascript
// Desktop
document.addEventListener('mousemove', (e) => {
  nervousSystem.mouseInfluence.x = e.clientX;
  nervousSystem.mouseInfluence.y = e.clientY;
  nervousSystem.mouseInfluence.active = true;
});

document.addEventListener('mouseleave', () => {
  nervousSystem.mouseInfluence.active = false;
});

// Mobile
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const velocity = Math.abs(window.scrollY - lastScrollY);
  nervousSystem.scrollBoost = Math.min(velocity * 0.01, 0.3);
  lastScrollY = window.scrollY;
});

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  nervousSystem.emitPulse(touch.clientX, touch.clientY);
});
```

---

## PART C: State Transitions (mapped to gateway)

### When to Transition

```javascript
const STATE_MAP = {
  // Landing + early questions = FRAGMENTED
  'landing': 'fragmented',
  'p1': 'fragmented',
  'p2': 'fragmented',
  'first-truth': 'fragmented',  // stays fragmented but First Truth text contrast

  // Mid questions = AWAKENING
  'p3': 'awakening',
  'p4': 'awakening',
  'micro-mirror-1': 'awakening',
  'p5': 'awakening',
  'p6': 'awakening',
  'micro-mirror-2': 'awakening',

  // Late questions = FLOWING
  'p7': 'flowing',
  'p8': 'flowing',

  // Bisagra = FROZEN
  'bisagra': 'frozen',

  // Result = RESOLVED (sub-state depends on score)
  'email': 'resolved',
  'result': 'resolved',
};
```

### Transition Animation

```javascript
transitionTo(newState, duration = 1200) {
  const startCoherence = this.coherence;
  const startEnergy = this.energy;
  const targetCoherence = STATE_TARGETS[newState].coherence;
  const targetEnergy = STATE_TARGETS[newState].energy;

  // Animate over duration with easeInOut
  animateValue(startCoherence, targetCoherence, duration, (v) => {
    this.coherence = v;
  });
  animateValue(startEnergy, targetEnergy, duration, (v) => {
    this.energy = v;
  });

  // Reveal/hide connections based on new state
  const targetVisibility = STATE_TARGETS[newState].connectionVisibility;
  this.connections.forEach((conn, i) => {
    const shouldBeVisible = i / this.connections.length < targetVisibility;
    if (shouldBeVisible && !conn.visible) {
      // Draw-on animation for new connection
      conn.visible = true;
      animateValue(0, 1, 800 + i * 50, (v) => { conn.drawProgress = v; });
    }
  });

  // Spawn/remove particles based on new particle count target
  this.adjustParticleCount(STATE_TARGETS[newState].particleCount);

  this.state = newState;
}
```

### The FREEZE Moment (Bisagra)

This is the most dramatic transition. When the bisagra begins:

```javascript
freezeSystem(duration = 800) {
  // 1. All particles decelerate to zero over duration
  this.particles.forEach(p => {
    animateValue(p.speed, 0, duration, (v) => { p.speed = v; });
  });

  // 2. Node pulse amplitude decreases to near-zero
  animateValue(this.energy, 0.05, duration, (v) => { this.energy = v; });

  // 3. After freeze: single scanning pulse from center
  setTimeout(() => {
    this.emitScanPulse(); // Expanding ring from center, accent color
  }, duration + 200);

  // 4. During "Calculando..." typing: subtle heartbeat on center node only
  // One node pulses slowly (2s cycle) while everything else is frozen
  // This is the "the system is processing" signal
}
```

### The RESOLVE Moment (Score Reveal)

When the score counter animation completes:

```javascript
resolveSystem(score, duration = 2000) {
  let targetColor, targetEnergy, targetCoherence;

  if (score < 30) {
    // CRITICAL: System fragments BACK — "this is how your body feels"
    targetColor = '#F87171';  // Red tint
    targetEnergy = 0.35;
    targetCoherence = 0.25;
    // Hide 40% of connections (fragmentation)
    this.fragmentConnections(0.4, duration);
  } else if (score <= 50) {
    // MODERATE: Partial system — some connections, mixed energy
    targetColor = '#c6c8ee';  // Accent with warm tint
    targetEnergy = 0.55;
    targetCoherence = 0.5;
  } else {
    // HEALTHY: Full flowing system — calm, rhythmic
    targetColor = '#4ADE80';  // Green tint blending to accent
    targetEnergy = 0.8;
    targetCoherence = 0.85;
    // All connections visible, synchronized pulse
  }

  // Transition all properties smoothly
  this.transitionColor(targetColor, duration);
  animateValue(this.energy, targetEnergy, duration, (v) => { this.energy = v; });
  animateValue(this.coherence, targetCoherence, duration, (v) => { this.coherence = v; });
}
```

---

## PART D: Rendering

### Main Render Loop
```javascript
function render(time) {
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  // 1. Draw connections (paths between nodes)
  nervousSystem.connections.forEach(conn => {
    if (!conn.visible) return;
    ctx.beginPath();
    ctx.moveTo(conn.nodeA.renderX, conn.nodeA.renderY);
    ctx.quadraticCurveTo(
      conn.controlPoints.cp1x, conn.controlPoints.cp1y,
      conn.nodeB.renderX, conn.nodeB.renderY
    );
    const alpha = 0.08 + (conn.nodeA.brightness + conn.nodeB.brightness) / 2 * 0.12;
    ctx.strokeStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${alpha})`;
    ctx.lineWidth = 1;

    // Partial draw for newly appearing connections
    if (conn.drawProgress < 1) {
      ctx.setLineDash([conn.length * conn.drawProgress, conn.length]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // 2. Draw particles (light flowing along connections)
  nervousSystem.particles.forEach(p => {
    const pos = p.getPosition();

    // Trail (fading dots behind the particle)
    p.trail.forEach((trailPos, i) => {
      const trailAlpha = (1 - i / p.trail.length) * p.brightness * 0.3;
      ctx.beginPath();
      ctx.arc(trailPos.x, trailPos.y, p.size * (1 - i * 0.15), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${trailAlpha})`;
      ctx.fill();
    });

    // Particle head (brighter)
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${p.brightness * 0.6})`;
    ctx.fill();

    // Glow around particle
    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 4);
    gradient.addColorStop(0, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${p.brightness * 0.15})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, p.size * 4, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });

  // 3. Draw nodes (nerve centers)
  nervousSystem.nodes.forEach(node => {
    // Core dot
    ctx.beginPath();
    ctx.arc(node.renderX, node.renderY, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${node.brightness * 0.5})`;
    ctx.fill();

    // Pulse glow (when brightness > threshold)
    if (node.brightness > 0.4) {
      const glowRadius = node.radius * 3 + node.brightness * 4;
      const glow = ctx.createRadialGradient(
        node.renderX, node.renderY, 0,
        node.renderX, node.renderY, glowRadius
      );
      glow.addColorStop(0, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${node.brightness * 0.2})`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(node.renderX, node.renderY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  });

  // 4. Draw cursor glow (desktop only)
  if (nervousSystem.mouseInfluence.active) {
    const { x, y } = nervousSystem.mouseInfluence;
    const cursorGlow = ctx.createRadialGradient(x, y, 0, x, y, 120);
    cursorGlow.addColorStop(0, `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.04)`);
    cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(x, y, 120, 0, Math.PI * 2);
    ctx.fillStyle = cursorGlow;
    ctx.fill();
  }

  requestAnimationFrame(render);
}
```

---

## PART E: Noise Library

For organic movement, use a simplex noise implementation (lightweight, no dependencies):

```
Option 1: Import simplex-noise npm package (~2KB gzipped)
Option 2: Inline a minimal 2D Perlin noise function (~40 lines)

The noise is used for:
- Node drift (subtle position oscillation, 1-3px)
- Connection curve variation (control points shift slightly over time)
- Particle speed variation (not constant — organic feel)

IMPORTANT: The noise seed should be deterministic per session
so the layout doesn't jump on re-render.
```

---

## PART F: Performance Optimization

```
1. OFFSCREEN DETECTION:
   - Only render nodes/connections within viewport + 100px margin
   - Skip particles on invisible connections

2. FRAME BUDGET:
   - If frame time > 20ms, reduce particle count by 20%
   - If frame time > 30ms, reduce to static mode (no particles, only node pulse)

3. VISIBILITY API:
   - Pause animation when tab is hidden (document.hidden)
   - Resume when visible

4. LOW-POWER MODE:
   - Detect via navigator.hardwareConcurrency < 4
   - Reduce: node count to 8, particle count to 5, skip glow effects

5. PREFERS-REDUCED-MOTION:
   - No particles, no drift
   - Static node positions at average brightness
   - Connections visible at base opacity
   - State changes happen instantly (no transition animation)
   - The system is still VISIBLE but not animated
```

---

## PART G: Integration with Gateway Component

The nervous system must be controlled by the gateway's step manager:

```javascript
// In the gateway component, when step changes:
function onGatewayStepChange(newStep) {
  const targetState = STATE_MAP[newStep];
  if (targetState !== nervousSystem.state) {
    nervousSystem.transitionTo(targetState);
  }

  // Special cases:
  if (newStep === 'bisagra') {
    nervousSystem.freezeSystem();
  }
  if (newStep === 'bisagra-score-reveal') {
    nervousSystem.resolveSystem(computedScore);
  }
}

// Expose the nervous system instance globally or via context
// so other components can trigger specific behaviors:
// nervousSystem.emitPulse(x, y) — for touch feedback
// nervousSystem.freezeSystem() — for bisagra
// nervousSystem.resolveSystem(score) — for score reveal
```

---

## IMPLEMENTATION ORDER

```
Step 1: Canvas setup + node layout + basic rendering (no animation)
        → Verify: nodes visible as static dots with connections

Step 2: Node pulse animation + noise drift
        → Verify: nodes pulse, drift slightly, feels organic

Step 3: Particle system along connections
        → Verify: light particles flow along paths

Step 4: Mouse/touch interaction
        → Verify: cursor proximity brightens nearby nodes

Step 5: State system (fragmented → awakening → flowing)
        → Verify: calling transitionTo() changes visible behavior

Step 6: Freeze + resolve (bisagra integration)
        → Verify: system freezes during bisagra, resolves with score

Step 7: Performance optimization + reduced-motion
        → Verify: smooth on mobile, respects accessibility

Step 8: Integration with gateway step manager
        → Verify: full walkthrough shows progressive state changes
```

---

## VERIFICATION CHECKLIST

### Visual
- [ ] On landing: nervous system is visible but fragmented (irregular pulse, gaps, few particles)
- [ ] Cursor proximity brightens nearby nodes and connections (desktop)
- [ ] Touch emits a subtle pulse ring (mobile)
- [ ] Answering P3 triggers visible transition: new connections draw on, more particles appear
- [ ] By P7-P8: the system is clearly MORE alive than on landing — noticeable difference
- [ ] During bisagra "Calculando...": system FREEZES (dramatic stillness)
- [ ] Score reveal: system RESPONDS to the number (red fragmentation for low, green flow for high)
- [ ] The nervous system is BEHIND all content, never competes for attention
- [ ] At 20-25% opacity it's atmospheric, not distracting

### Emotional
- [ ] A first-time visitor would notice "something is alive in the background" within 5 seconds
- [ ] The freeze moment during bisagra creates a perceptible "holding breath" feeling
- [ ] After the score reveals and the system responds, the user feels "that's ME" (Product Philosophy: results are personal)
- [ ] The progressive awakening creates unconscious anticipation (Gateway: gradiente creciente)
- [ ] The interaction (cursor/touch) creates "the system knows I'm here" (Product Philosophy: hacer > ver > oír)

### Technical
- [ ] Canvas renders at device pixel ratio (crisp on retina)
- [ ] Smooth 60fps on modern desktop and 30fps+ on mobile
- [ ] `prefers-reduced-motion`: static version with no animation
- [ ] Low-power detection: reduced particle count, no glow effects
- [ ] Tab visibility API: pauses when hidden
- [ ] No layout shift or flicker on load
- [ ] Canvas pointer-events: none (doesn't interfere with UI)
- [ ] Mobile 375px: system is visible and not overwhelming

### Integration
- [ ] State transitions are triggered by gateway step changes
- [ ] Freeze is triggered by bisagra start
- [ ] Resolve is triggered by score reveal with correct score value
- [ ] The old SVG nervous system is REMOVED (replaced by canvas)
- [ ] Canvas is positioned fixed, covers viewport, z-index: 0
