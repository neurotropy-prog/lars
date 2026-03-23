/**
 * NervousSystemEngine — Canvas 2D living nervous system background
 *
 * Renders an abstract neural network: nodes connected by organic bezier curves,
 * with light particles flowing along connections. Evolves through 5 states
 * mapped to gateway progress (fragmented → awakening → flowing → frozen → resolved).
 *
 * All rendering is done in CSS pixels (DPR scaling handled via ctx.scale).
 */

import type { NervousSystemState } from '@/contexts/NervousSystemContext'

// ─── Inline 2D Simplex Noise ─────────────────────────────────────────────────
// Minimal implementation — only needs smooth continuous values for slow drift.

const GRAD2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
]

const PERM = new Uint8Array(512)
const PERM_MOD = new Uint8Array(512)
{
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  // Fisher-Yates with a fixed seed for determinism
  let seed = 42
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647
    const j = seed % (i + 1)
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp
  }
  for (let i = 0; i < 512; i++) {
    PERM[i] = p[i & 255]
    PERM_MOD[i] = PERM[i] % 8
  }
}

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

function noise2D(x: number, y: number): number {
  const s = (x + y) * F2
  const i = Math.floor(x + s)
  const j = Math.floor(y + s)
  const t = (i + j) * G2
  const X0 = i - t
  const Y0 = j - t
  const x0 = x - X0
  const y0 = y - Y0

  const i1 = x0 > y0 ? 1 : 0
  const j1 = x0 > y0 ? 0 : 1

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  const ii = i & 255
  const jj = j & 255

  let n0 = 0, n1 = 0, n2 = 0
  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 >= 0) {
    t0 *= t0
    const g = GRAD2[PERM_MOD[ii + PERM[jj]]]
    n0 = t0 * t0 * (g[0] * x0 + g[1] * y0)
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 >= 0) {
    t1 *= t1
    const g = GRAD2[PERM_MOD[ii + i1 + PERM[jj + j1]]]
    n1 = t1 * t1 * (g[0] * x1 + g[1] * y1)
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 >= 0) {
    t2 *= t2
    const g = GRAD2[PERM_MOD[ii + 1 + PERM[jj + 1]]]
    n2 = t2 * t2 * (g[0] * x2 + g[1] * y2)
  }

  return 70 * (n0 + n1 + n2) // Range [-1, 1]
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Vec2 { x: number; y: number }

interface NSNode {
  baseX: number
  baseY: number
  renderX: number
  renderY: number
  type: 'spine' | 'branch' | 'terminal'
  radius: number
  phase: number        // Random offset for pulse timing
  pulseSpeed: number   // Individual pulse speed multiplier
  brightness: number   // Current glow intensity 0-1
  noiseOffX: number    // Noise seed for X drift
  noiseOffY: number    // Noise seed for Y drift
  spineIndex: number   // Which spine node this belongs to (-1 for spine itself)
}

interface NSConnection {
  a: number           // Index into nodes array
  b: number
  cpX: number         // Bezier control point X (base)
  cpY: number         // Bezier control point Y (base)
  visible: boolean
  drawProgress: number // 0-1 for stroke-draw animation
  priority: number    // Lower = shown earlier (0-1)
}

interface NSParticle {
  connIdx: number     // Index into connections array
  t: number           // Position along bezier 0-1
  speed: number       // Travel speed per ms
  size: number
  brightness: number
  trail: Vec2[]       // Last 5 positions
  active: boolean
}

interface RipplePulse {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  startTime: number
}

interface RGB { r: number; g: number; b: number }

// State target parameters
interface StateTarget {
  coherence: number
  energy: number
  connectionVisibility: number
  particleCount: number
  particleSpeed: number
  color: RGB
  opacity: number
}

const STATE_TARGETS: Record<NervousSystemState, StateTarget> = {
  fragmented: {
    coherence: 0.2, energy: 0.3, connectionVisibility: 0.4,
    particleCount: 10, particleSpeed: 0.002,
    color: { r: 140, g: 142, b: 165 }, // muted lavender-gray — visible on dark teal
    opacity: 0.28,
  },
  awakening: {
    coherence: 0.5, energy: 0.55, connectionVisibility: 0.65,
    particleCount: 20, particleSpeed: 0.003,
    color: { r: 198, g: 200, b: 238 }, // #c6c8ee accent
    opacity: 0.32,
  },
  flowing: {
    coherence: 0.75, energy: 0.7, connectionVisibility: 0.85,
    particleCount: 32, particleSpeed: 0.005,
    color: { r: 198, g: 200, b: 238 }, // #c6c8ee accent
    opacity: 0.38,
  },
  frozen: {
    coherence: 0.75, energy: 0.05, connectionVisibility: 1.0,
    particleCount: 32, particleSpeed: 0,
    color: { r: 198, g: 200, b: 238 }, // #c6c8ee accent
    opacity: 0.30,
  },
  resolved: {
    coherence: 0.5, energy: 0.55, connectionVisibility: 0.65,
    particleCount: 20, particleSpeed: 0.003,
    color: { r: 198, g: 200, b: 238 }, // placeholder, overridden by score
    opacity: 0.30,
  },
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export class NervousSystemEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dpr: number
  private width = 0
  private height = 0
  private isMobile = false

  private nodes: NSNode[] = []
  private connections: NSConnection[] = []
  private particles: NSParticle[] = []
  private ripples: RipplePulse[] = []

  // Current animated values
  private coherence = 0.2
  private energy = 0.3
  private connectionVis = 0.4
  private activeParticleTarget = 10
  private particleSpeed = 0.002
  private currentColor: RGB = { r: 107, g: 114, b: 128 }
  private globalOpacity = 0.15

  // Transition lerp
  private targetCoherence = 0.2
  private targetEnergy = 0.3
  private targetConnectionVis = 0.4
  private targetParticleCount = 10
  private targetParticleSpeed = 0.002
  private targetColor: RGB = { r: 107, g: 114, b: 128 }
  private targetOpacity = 0.15

  // State
  private state: NervousSystemState = 'fragmented'
  private score: number | null = null
  private animFrameId = 0
  private lastTime = 0
  private destroyed = false
  private reducedMotion = false
  private lowPower = false
  private slowFrameCount = 0

  // Mouse/touch
  private pointerX = -1000
  private pointerY = -1000
  private pointerActive = false
  private scrollBoost = 0

  // Frozen state specifics
  private frozenScanPhase = -1  // -1 = no scan, 0-1 = scan progress
  private frozenScanStartTime = 0
  private frozenHeartbeatNode = -1

  // Bound event handlers for cleanup
  private boundMouseMove: (e: MouseEvent) => void
  private boundMouseLeave: () => void
  private boundTouchStart: (e: TouchEvent) => void
  private boundTouchMove: (e: TouchEvent) => void
  private boundTouchEnd: () => void
  private boundScroll: () => void
  private boundVisibility: () => void

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not available')
    this.ctx = ctx
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Check reduced motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Check low power
    this.lowPower = (navigator.hardwareConcurrency || 4) < 4

    // Bind event handlers
    this.boundMouseMove = (e: MouseEvent) => {
      this.pointerX = e.clientX
      this.pointerY = e.clientY
      this.pointerActive = true
    }
    this.boundMouseLeave = () => { this.pointerActive = false }
    this.boundTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0]
        this.emitRipple(t.clientX, t.clientY)
      }
    }
    this.boundTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0]
        this.pointerX = t.clientX
        this.pointerY = t.clientY
        this.pointerActive = true
      }
    }
    this.boundTouchEnd = () => { this.pointerActive = false }

    let lastScrollY = 0
    this.boundScroll = () => {
      const velocity = Math.abs(window.scrollY - lastScrollY)
      this.scrollBoost = Math.min(velocity * 0.01, 0.3)
      lastScrollY = window.scrollY
    }

    this.boundVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animFrameId)
      } else if (!this.destroyed) {
        this.lastTime = performance.now()
        this.animFrameId = requestAnimationFrame(this.loop)
      }
    }

    // Setup
    this.resize(canvas.clientWidth, canvas.clientHeight)
    this.generateNetwork()
    this.spawnParticles()
    this.attachEvents()

    if (this.reducedMotion) {
      this.renderStaticFrame()
    } else {
      this.lastTime = performance.now()
      this.animFrameId = requestAnimationFrame(this.loop)
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────

  transitionTo(newState: NervousSystemState, score?: number) {
    if (this.destroyed) return
    this.state = newState
    if (score !== undefined) this.score = score

    let target: StateTarget

    if (newState === 'resolved' && score !== undefined) {
      target = this.getResolvedTarget(score)
    } else {
      target = STATE_TARGETS[newState]
    }

    this.targetCoherence = target.coherence
    this.targetEnergy = target.energy
    this.targetConnectionVis = target.connectionVisibility
    this.targetParticleCount = this.isMobile
      ? Math.min(target.particleCount, 20)
      : target.particleCount
    this.targetParticleSpeed = target.particleSpeed
    this.targetColor = { ...target.color }
    this.targetOpacity = target.opacity

    // Special handling for frozen
    if (newState === 'frozen') {
      this.frozenScanPhase = -1
      // Schedule scan pulse after freeze completes (~1000ms)
      setTimeout(() => {
        if (this.state === 'frozen' && !this.destroyed) {
          this.frozenScanPhase = 0
          this.frozenScanStartTime = performance.now()
          // Find center node for heartbeat
          this.frozenHeartbeatNode = this.findCenterNode()
        }
      }, 1000)
    } else {
      this.frozenScanPhase = -1
      this.frozenHeartbeatNode = -1
    }

    // If reduced motion, re-render static
    if (this.reducedMotion) {
      // Snap values immediately
      this.coherence = this.targetCoherence
      this.energy = this.targetEnergy
      this.connectionVis = this.targetConnectionVis
      this.currentColor = { ...this.targetColor }
      this.globalOpacity = this.targetOpacity
      this.updateConnectionVisibility()
      this.renderStaticFrame()
    }
  }

  resize(w: number, h: number) {
    this.width = w
    this.height = h
    this.isMobile = w < 768
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = w * this.dpr
    this.canvas.height = h * this.dpr
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.dpr, this.dpr)

    // Regenerate layout for new dimensions
    if (this.nodes.length > 0) {
      this.generateNetwork()
      this.updateConnectionVisibility()
      if (this.reducedMotion) this.renderStaticFrame()
    }
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.animFrameId)
    this.detachEvents()
  }

  // ── Network Generation ───────────────────────────────────────────────────

  private generateNetwork() {
    this.nodes = []
    this.connections = []

    const nodeCount = this.isMobile ? 11 : 16
    const spineCount = this.isMobile ? 5 : 7
    const w = this.width
    const h = this.height

    // Generate spine nodes along a vertical S-curve
    for (let i = 0; i < spineCount; i++) {
      const t = (i + 0.5) / spineCount
      const y = h * (0.08 + t * 0.84)
      // S-curve: sine offset from center
      const xOffset = Math.sin(t * Math.PI * 2) * w * 0.08
      const x = w * 0.5 + xOffset

      this.nodes.push({
        baseX: x, baseY: y, renderX: x, renderY: y,
        type: 'spine', radius: this.isMobile ? 4 : 5,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.8 + Math.random() * 0.4,
        brightness: 0.3,
        noiseOffX: Math.random() * 1000,
        noiseOffY: Math.random() * 1000,
        spineIndex: i,
      })
    }

    // Generate branch nodes from spine
    const branchesNeeded = nodeCount - spineCount
    let branchesCreated = 0
    for (let i = 0; i < spineCount && branchesCreated < branchesNeeded; i++) {
      const spine = this.nodes[i]
      // 1-2 branches per spine node
      const branchCount = (i === 0 || i === spineCount - 1) ? 1 : (branchesCreated < branchesNeeded - 1 ? 2 : 1)

      for (let b = 0; b < branchCount && branchesCreated < branchesNeeded; b++) {
        const side = b === 0 ? -1 : 1
        const angle = (30 + Math.random() * 30) * (Math.PI / 180) * side
        const dist = (this.isMobile ? 40 : 60) + Math.random() * (this.isMobile ? 30 : 50)
        const bx = spine.baseX + Math.cos(angle + Math.PI * 0.5 * side) * dist
        const by = spine.baseY + Math.sin(angle) * dist * 0.5

        // Clamp to viewport
        const clampedX = Math.max(20, Math.min(w - 20, bx))

        this.nodes.push({
          baseX: clampedX, baseY: by, renderX: clampedX, renderY: by,
          type: 'branch', radius: this.isMobile ? 3 : 3.5,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.8 + Math.random() * 0.4,
          brightness: 0.2,
          noiseOffX: Math.random() * 1000,
          noiseOffY: Math.random() * 1000,
          spineIndex: i,
        })
        branchesCreated++
      }
    }

    // Generate connections
    let connPriority = 0

    // Spine-to-spine sequential connections
    for (let i = 0; i < spineCount - 1; i++) {
      this.addConnection(i, i + 1, connPriority / (nodeCount * 2))
      connPriority++
    }

    // Branch-to-parent-spine connections
    for (let i = spineCount; i < this.nodes.length; i++) {
      const node = this.nodes[i]
      this.addConnection(node.spineIndex, i, connPriority / (nodeCount * 2))
      connPriority++
    }

    // Some cross-connections between adjacent branches
    for (let i = spineCount; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const ni = this.nodes[i]
        const nj = this.nodes[j]
        const dist = Math.hypot(ni.baseX - nj.baseX, ni.baseY - nj.baseY)
        if (dist < (this.isMobile ? 100 : 150) && Math.random() < 0.4) {
          this.addConnection(i, j, connPriority / (nodeCount * 2))
          connPriority++
        }
      }
    }

    // Normalize priorities to 0-1
    const maxPriority = connPriority
    for (const conn of this.connections) {
      conn.priority = conn.priority * (nodeCount * 2) / maxPriority
    }

    // Sort connections by priority
    this.connections.sort((a, b) => a.priority - b.priority)

    this.updateConnectionVisibility()
  }

  private addConnection(a: number, b: number, priority: number) {
    const na = this.nodes[a]
    const nb = this.nodes[b]
    const midX = (na.baseX + nb.baseX) / 2
    const midY = (na.baseY + nb.baseY) / 2
    // Perpendicular offset for organic curve
    const dx = nb.baseX - na.baseX
    const dy = nb.baseY - na.baseY
    const perpX = -dy * 0.2
    const perpY = dx * 0.2
    const cpX = midX + perpX + (Math.random() - 0.5) * 20
    const cpY = midY + perpY + (Math.random() - 0.5) * 20

    this.connections.push({
      a, b, cpX, cpY,
      visible: false,
      drawProgress: 0,
      priority,
    })
  }

  private updateConnectionVisibility() {
    for (let i = 0; i < this.connections.length; i++) {
      const conn = this.connections[i]
      const shouldBeVisible = conn.priority < this.connectionVis
      if (shouldBeVisible && !conn.visible) {
        conn.visible = true
        conn.drawProgress = 0 // Will animate in render loop
      } else if (!shouldBeVisible && conn.visible) {
        conn.visible = false
        conn.drawProgress = 0
      }
    }
  }

  // ── Particle System ──────────────────────────────────────────────────────

  private spawnParticles() {
    const maxParticles = this.isMobile ? 20 : 40
    this.particles = []
    for (let i = 0; i < maxParticles; i++) {
      this.particles.push({
        connIdx: Math.floor(Math.random() * Math.max(1, this.connections.length)),
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        size: 1.5 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.4,
        trail: [],
        active: i < this.activeParticleTarget,
      })
    }
  }

  private adjustParticleCount() {
    let activeCount = 0
    for (const p of this.particles) {
      if (p.active) activeCount++
    }
    const target = Math.round(this.activeParticleTarget)

    if (activeCount < target) {
      for (const p of this.particles) {
        if (!p.active) {
          p.active = true
          p.connIdx = Math.floor(Math.random() * Math.max(1, this.connections.length))
          p.t = Math.random()
          p.trail = []
          activeCount++
          if (activeCount >= target) break
        }
      }
    } else if (activeCount > target) {
      for (let i = this.particles.length - 1; i >= 0 && activeCount > target; i--) {
        if (this.particles[i].active) {
          this.particles[i].active = false
          activeCount--
        }
      }
    }
  }

  private getBezierPoint(conn: NSConnection, t: number): Vec2 {
    const a = this.nodes[conn.a]
    const b = this.nodes[conn.b]
    const u = 1 - t
    return {
      x: u * u * a.renderX + 2 * u * t * conn.cpX + t * t * b.renderX,
      y: u * u * a.renderY + 2 * u * t * conn.cpY + t * t * b.renderY,
    }
  }

  // ── Interaction ──────────────────────────────────────────────────────────

  private emitRipple(x: number, y: number) {
    this.ripples.push({
      x, y,
      radius: 0,
      maxRadius: 120,
      opacity: 0.3,
      startTime: performance.now(),
    })
    // Keep max 3 ripples
    if (this.ripples.length > 3) this.ripples.shift()
  }

  private findCenterNode(): number {
    let bestIdx = 0
    let bestDist = Infinity
    const cx = this.width / 2
    const cy = this.height / 2
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i]
      const d = Math.hypot(n.baseX - cx, n.baseY - cy)
      if (d < bestDist) { bestDist = d; bestIdx = i }
    }
    return bestIdx
  }

  // ── Resolved State ───────────────────────────────────────────────────────

  private getResolvedTarget(score: number): StateTarget {
    if (score < 30) {
      return {
        coherence: 0.25, energy: 0.35, connectionVisibility: 0.4,
        particleCount: 12, particleSpeed: 0.002,
        color: { r: 248, g: 113, b: 113 }, // #F87171
        opacity: 0.15,
      }
    } else if (score <= 50) {
      return {
        coherence: 0.5, energy: 0.55, connectionVisibility: 0.65,
        particleCount: 20, particleSpeed: 0.003,
        color: { r: 222, g: 214, b: 134 }, // blend accent/yellow
        opacity: 0.20,
      }
    } else {
      return {
        coherence: 0.85, energy: 0.8, connectionVisibility: 0.95,
        particleCount: 35, particleSpeed: 0.004,
        color: { r: 74, g: 222, b: 128 }, // #4ADE80
        opacity: 0.22,
      }
    }
  }

  // ── Events ───────────────────────────────────────────────────────────────

  private attachEvents() {
    window.addEventListener('mousemove', this.boundMouseMove)
    window.addEventListener('mouseleave', this.boundMouseLeave)
    window.addEventListener('touchstart', this.boundTouchStart, { passive: true })
    window.addEventListener('touchmove', this.boundTouchMove, { passive: true })
    window.addEventListener('touchend', this.boundTouchEnd)
    window.addEventListener('scroll', this.boundScroll, { passive: true })
    document.addEventListener('visibilitychange', this.boundVisibility)
  }

  private detachEvents() {
    window.removeEventListener('mousemove', this.boundMouseMove)
    window.removeEventListener('mouseleave', this.boundMouseLeave)
    window.removeEventListener('touchstart', this.boundTouchStart)
    window.removeEventListener('touchmove', this.boundTouchMove)
    window.removeEventListener('touchend', this.boundTouchEnd)
    window.removeEventListener('scroll', this.boundScroll)
    document.removeEventListener('visibilitychange', this.boundVisibility)
  }

  // ── Animation Loop ───────────────────────────────────────────────────────

  private loop = (now: number) => {
    if (this.destroyed) return

    const dt = Math.min(now - this.lastTime, 50) // Cap delta at 50ms
    this.lastTime = now

    // Performance monitoring
    if (dt > 20) {
      this.slowFrameCount++
      if (this.slowFrameCount > 60 && !this.lowPower) {
        this.lowPower = true
        this.activeParticleTarget = Math.max(5, this.activeParticleTarget * 0.5)
      }
    } else {
      this.slowFrameCount = Math.max(0, this.slowFrameCount - 1)
    }

    this.update(now, dt)
    this.render(now)

    this.animFrameId = requestAnimationFrame(this.loop)
  }

  private update(now: number, dt: number) {
    const lerpSpeed = 0.003 * dt // ~0.18 per frame at 60fps → smooth over ~1s

    // Lerp current values toward targets
    this.coherence += (this.targetCoherence - this.coherence) * lerpSpeed
    this.energy += (this.targetEnergy - this.energy) * lerpSpeed
    this.connectionVis += (this.targetConnectionVis - this.connectionVis) * lerpSpeed
    this.activeParticleTarget += (this.targetParticleCount - this.activeParticleTarget) * lerpSpeed
    this.particleSpeed += (this.targetParticleSpeed - this.particleSpeed) * lerpSpeed
    this.currentColor.r += (this.targetColor.r - this.currentColor.r) * lerpSpeed
    this.currentColor.g += (this.targetColor.g - this.currentColor.g) * lerpSpeed
    this.currentColor.b += (this.targetColor.b - this.currentColor.b) * lerpSpeed
    this.globalOpacity += (this.targetOpacity - this.globalOpacity) * lerpSpeed

    // Update connection visibility
    this.updateConnectionVisibility()

    // Adjust particle count
    this.adjustParticleCount()

    // Scroll boost decay
    this.scrollBoost *= 0.95

    const time = now * 0.001 // seconds

    // Update nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]

      // Drift with noise (skip in low power)
      if (!this.lowPower) {
        const driftX = noise2D(node.noiseOffX + time * 0.3, 0) * 3
        const driftY = noise2D(0, node.noiseOffY + time * 0.3) * 3
        node.renderX = node.baseX + driftX
        node.renderY = node.baseY + driftY
      } else {
        node.renderX = node.baseX
        node.renderY = node.baseY
      }

      // Pulse brightness
      if (this.state === 'frozen') {
        // Frozen: all nodes dim except heartbeat
        if (i === this.frozenHeartbeatNode) {
          // Heartbeat: double-bump pattern
          const hb = Math.abs(Math.sin(time * 1.5)) * 0.6 + 0.2
          node.brightness = hb
        } else {
          node.brightness = 0.1
        }
      } else if (this.coherence < 0.35) {
        // Fragmented: irregular pulse
        node.brightness = 0.2 + Math.sin(time * node.pulseSpeed + node.phase) * 0.15
      } else if (this.coherence < 0.65) {
        // Awakening: converging rhythm
        const shared = Math.sin(time * 1.2)
        const personal = Math.sin(time * node.pulseSpeed + node.phase)
        const blend = (this.coherence - 0.35) / 0.3 // 0-1 within awakening
        node.brightness = 0.25 + (shared * blend + personal * (1 - blend)) * 0.2
      } else {
        // Flowing/Resolved: synchronized wave
        const wavePhase = node.baseY / this.height * Math.PI * 2
        node.brightness = 0.3 + Math.sin(time * 1.2 + wavePhase) * 0.25
      }

      // Mouse proximity boost
      if (this.pointerActive && this.state !== 'frozen') {
        const dist = Math.hypot(node.renderX - this.pointerX, node.renderY - this.pointerY)
        if (dist < 150) {
          const proximity = 1 - dist / 150
          node.brightness += proximity * 0.3
          const baseR = node.type === 'spine'
            ? (this.isMobile ? 4 : 5)
            : node.type === 'branch'
              ? (this.isMobile ? 3 : 3.5)
              : 2.5
          node.radius = baseR + proximity * 2
        } else {
          node.radius = node.type === 'spine'
            ? (this.isMobile ? 4 : 5)
            : node.type === 'branch'
              ? (this.isMobile ? 3 : 3.5)
              : 2.5
        }
      }

      // Scroll boost (mobile)
      if (this.scrollBoost > 0.01) {
        node.brightness += this.scrollBoost * 0.2
      }

      // Clamp brightness
      node.brightness = Math.min(1, Math.max(0, node.brightness))
    }

    // Update connection draw progress
    for (const conn of this.connections) {
      if (conn.visible && conn.drawProgress < 1) {
        conn.drawProgress = Math.min(1, conn.drawProgress + dt * 0.002)
      }
    }

    // Update particles
    const effectiveEnergy = this.energy + this.scrollBoost
    for (const p of this.particles) {
      if (!p.active) continue
      if (p.connIdx >= this.connections.length) {
        p.connIdx = Math.floor(Math.random() * Math.max(1, this.connections.length))
      }
      const conn = this.connections[p.connIdx]
      if (!conn || !conn.visible) {
        // Find a visible connection
        p.connIdx = this.findRandomVisibleConnection()
        p.t = 0
        p.trail = []
        continue
      }

      // Move along path
      const speedMod = this.state === 'frozen' ? 0 : effectiveEnergy
      p.t += p.speed * speedMod * dt * 0.5

      // Mouse proximity acceleration
      if (this.pointerActive && this.state !== 'frozen') {
        const pos = this.getBezierPoint(conn, p.t)
        const dist = Math.hypot(pos.x - this.pointerX, pos.y - this.pointerY)
        if (dist < 150) {
          p.t += p.speed * 0.5 * (1 - dist / 150) * dt
        }
      }

      if (p.t >= 1) {
        p.t = 0
        p.connIdx = this.findRandomVisibleConnection()
        p.trail = []
      }

      // Store trail
      const pos = this.getBezierPoint(conn, p.t)
      p.trail.unshift(pos)
      if (p.trail.length > 5) p.trail.pop()
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i]
      const elapsed = now - r.startTime
      const progress = elapsed / 600 // 600ms duration
      if (progress >= 1) {
        this.ripples.splice(i, 1)
      } else {
        r.radius = r.maxRadius * progress
        r.opacity = 0.3 * (1 - progress)
      }
    }

    // Frozen scan pulse
    if (this.frozenScanPhase >= 0 && this.state === 'frozen') {
      const elapsed = now - this.frozenScanStartTime
      this.frozenScanPhase = elapsed / 2000 // 2s scan duration
      if (this.frozenScanPhase >= 1) {
        this.frozenScanPhase = -1 // Scan complete
      }
    }
  }

  private findRandomVisibleConnection(): number {
    const visible = []
    for (let i = 0; i < this.connections.length; i++) {
      if (this.connections[i].visible) visible.push(i)
    }
    return visible.length > 0
      ? visible[Math.floor(Math.random() * visible.length)]
      : 0
  }

  // ── Render ───────────────────────────────────────────────────────────────

  private render(_now: number) {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    const { r, g, b } = this.currentColor

    // Use globalAlpha for overall opacity control — keeps per-element alphas readable
    ctx.globalAlpha = this.globalOpacity

    // 1. Draw connections
    for (const conn of this.connections) {
      if (!conn.visible || conn.drawProgress <= 0) continue
      const a = this.nodes[conn.a]
      const bNode = this.nodes[conn.b]
      const alpha = 0.4 + (a.brightness + bNode.brightness) / 2 * 0.5

      ctx.beginPath()
      ctx.moveTo(a.renderX, a.renderY)

      if (conn.drawProgress < 1) {
        const endT = conn.drawProgress
        const end = this.getBezierPoint(conn, endT)
        const cpT = endT * 0.5
        const cp = {
          x: a.renderX + (conn.cpX - a.renderX) * cpT * 2,
          y: a.renderY + (conn.cpY - a.renderY) * cpT * 2,
        }
        ctx.quadraticCurveTo(cp.x, cp.y, end.x, end.y)
      } else {
        ctx.quadraticCurveTo(conn.cpX, conn.cpY, bNode.renderX, bNode.renderY)
      }

      ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`
      ctx.lineWidth = 1.2
      ctx.stroke()
    }

    // 2. Draw particles
    if (!this.lowPower) {
      for (const p of this.particles) {
        if (!p.active || p.trail.length === 0) continue

        // Trail
        for (let i = 0; i < p.trail.length; i++) {
          const tp = p.trail[i]
          const trailAlpha = (1 - i / p.trail.length) * p.brightness * 0.7
          const trailSize = p.size * (1 - i * 0.12)
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, Math.max(0.5, trailSize), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${trailAlpha})`
          ctx.fill()
        }

        // Particle head (brightest)
        const head = p.trail[0]
        ctx.beginPath()
        ctx.arc(head.x, head.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${Math.min(1, p.brightness * 1.2)})`
        ctx.fill()

        // Glow
        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, p.size * 6)
        glow.addColorStop(0, `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${p.brightness * 0.4})`)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.beginPath()
        ctx.arc(head.x, head.y, p.size * 6, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    // 3. Draw nodes
    for (const node of this.nodes) {
      // Core dot — highly visible
      const nodeAlpha = 0.6 + node.brightness * 0.4
      ctx.beginPath()
      ctx.arc(node.renderX, node.renderY, node.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${nodeAlpha})`
      ctx.fill()

      // Glow halo for all nodes
      if (!this.lowPower) {
        const glowR = node.radius * 4 + node.brightness * 8
        const glow = ctx.createRadialGradient(
          node.renderX, node.renderY, 0,
          node.renderX, node.renderY, glowR
        )
        glow.addColorStop(0, `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${0.15 + node.brightness * 0.35})`)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.beginPath()
        ctx.arc(node.renderX, node.renderY, glowR, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    // 4. Cursor glow
    if (this.pointerActive && this.state !== 'frozen') {
      const cursorGlow = ctx.createRadialGradient(
        this.pointerX, this.pointerY, 0,
        this.pointerX, this.pointerY, 140
      )
      cursorGlow.addColorStop(0, `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0.15)`)
      cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.beginPath()
      ctx.arc(this.pointerX, this.pointerY, 140, 0, Math.PI * 2)
      ctx.fillStyle = cursorGlow
      ctx.fill()
    }

    // 5. Ripples (mobile touch)
    for (const rp of this.ripples) {
      ctx.beginPath()
      ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${rp.opacity})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Reset globalAlpha for scan pulse (rendered at full strength)
    ctx.globalAlpha = 1

    // 6. Frozen scan pulse
    if (this.frozenScanPhase >= 0 && this.frozenScanPhase < 1) {
      const scanY = this.height * this.frozenScanPhase
      const scanAlpha = 0.15 * (1 - this.frozenScanPhase)
      const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30)
      gradient.addColorStop(0, 'rgba(198, 200, 238, 0)')
      gradient.addColorStop(0.5, `rgba(198, 200, 238, ${scanAlpha})`)
      gradient.addColorStop(1, 'rgba(198, 200, 238, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, scanY - 30, this.width, 60)
    }
  }

  // ── Static Frame (reduced motion) ────────────────────────────────────────

  private renderStaticFrame() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    const { r, g, b } = this.currentColor
    ctx.globalAlpha = this.globalOpacity

    // Draw connections at uniform opacity
    for (const conn of this.connections) {
      if (!conn.visible) continue
      const a = this.nodes[conn.a]
      const bNode = this.nodes[conn.b]
      ctx.beginPath()
      ctx.moveTo(a.baseX, a.baseY)
      ctx.quadraticCurveTo(conn.cpX, conn.cpY, bNode.baseX, bNode.baseY)
      ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0.3)`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw nodes at uniform brightness
    for (const node of this.nodes) {
      ctx.beginPath()
      ctx.arc(node.baseX, node.baseY, node.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0.5)`
      ctx.fill()
    }

    ctx.globalAlpha = 1
  }
}
