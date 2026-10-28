import { dynoLabels, motorsportWin } from '../../content/ui'

/**
 * One-shot neon effects for the Parcours details panel: line drawings with a glow, drawn on a canvas.
 * All coordinates are in scene units: the scene is H units high, the ground is at GROUND, the width varies with the panel.
 * Each effect draws its frame at `ms` since the start and says how long it lasts.
 */
export const H = 108
const GROUND = 92
const ORANGE = '#f97316'
const KHAKI = '#a3a86a'
const WIRE = '#9ca3af'

type Ctx = CanvasRenderingContext2D
type Pt = [number, number]
type Effect = {
  duration: (w: number) => number
  draw: (c: Ctx, w: number, ms: number) => void
  /** Drawn over the whole details panel, `h` units high (the scene stays along its bottom). */
  overlay?: (c: Ctx, w: number, h: number, ms: number) => void
}

const glow = (c: Ctx, color: string) => {
  c.strokeStyle = color
  c.fillStyle = color
  c.shadowColor = color
  c.shadowBlur = 10
}
const poly = (c: Ctx, pts: Pt[]) => {
  c.beginPath()
  c.moveTo(...pts[0]!)
  pts.slice(1).forEach((p) => c.lineTo(...p))
  c.closePath()
}
/** Fade in over the first 200 ms, out over the last 300 ms. */
const fade = (ms: number, total: number) => Math.max(0, Math.min(1, ms / 200, (total - ms) / 300))
const ground = (c: Ctx, w: number, alpha: number) => {
  c.save()
  c.globalAlpha = alpha * 0.35
  c.strokeStyle = WIRE
  c.lineWidth = 1
  c.beginPath()
  c.moveTo(0, GROUND + 0.5)
  c.lineTo(w, GROUND + 0.5)
  c.stroke()
  c.restore()
}

// ---------- LMP2 #26 (local units 0..200 × 0..56, front to the right): rear fender, canopy, shark fin, front fender, low nose
const BODY: Pt[] = [[6, 43], [6, 30], [28, 29], [38, 25], [56, 25], [66, 27], [86, 24], [98, 14], [116, 13], [130, 22], [140, 27], [150, 23], [170, 23], [180, 29], [197, 35], [198, 41], [186, 45]]
const FIN: Pt[] = [[38, 26], [38, 8], [46, 8], [100, 14], [86, 24], [66, 27], [56, 25]]
const GLASS: Pt[] = [[101, 16], [115, 15], [126, 21.5], [104, 22.5]]
const STRIPE: Pt[] = [[66, 37], [80, 27], [88, 27], [74, 37]]
const WING: Pt[] = [[-2, 3], [32, 3], [32, 7], [-2, 7]]
const PLATE: Pt[] = [[-3, 0], [1, 0], [1, 18], [-3, 18]]
const PYLON: Pt[] = [[22, 7], [26, 7], [40, 20], [36, 20]]

function wheel(c: Ctx, x: number, rot: number) {
  const y = 43
  c.beginPath()
  c.arc(x, y, 13, 0, 7)
  c.stroke()
  c.beginPath()
  c.arc(x, y, 7.5, 0, 7)
  c.stroke()
  for (let i = 0; i < 5; i++) {
    const a = rot + i * 1.2566
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x + Math.cos(a) * 7.5, y + Math.sin(a) * 7.5)
    c.stroke()
  }
}
function car(c: Ctx, rot: number) {
  for (const p of [PYLON, WING, PLATE, BODY, FIN, GLASS, STRIPE]) {
    poly(c, p)
    c.stroke()
  }
  c.beginPath()
  c.moveTo(6, 37)
  c.lineTo(198, 37)
  c.stroke()
  c.font = 'bold 11px Inter, sans-serif'
  c.fillText('26', 53, 22)
  wheel(c, 46, rot)
  wheel(c, 160, rot)
}

const CAR_SCALE = 0.72
const CAR_LEN = 200 * CAR_SCALE
const CAR_SPEED = 0.6 // units per ms at full speed
const TRAIL = 170 // length of the light trail behind the car
/** From off-screen left until the end of the trail has left on the right. */
const carRun = (w: number) => w + CAR_LEN + TRAIL + 40
const carMs = (w: number) => carRun(w) / CAR_SPEED + 120
/** Quick launch (the first 120 ms count double), then full speed. */
const carX = (w: number, ms: number) => {
  const t = ms < 240 ? (ms * ms) / 480 : ms - 120
  return -CAR_LEN - 20 + Math.min(t * CAR_SPEED, carRun(w))
}

// Finish line, confetti over the whole card and the result: the #26 won LMP2 at the 6 Hours of Spa-Francorchamps,
// 6 May 2017 (https://www.fiawec.com/en/news/toyota-takes-1-2-at-spa-g-drive-secures-lmp2/5064).
const FINISH = 0.54 // share of the panel width: just right of mid-card, the result text still clear of the photo
const WIN_MS = 1700 // after the crossing: confetti and result on screen
/** When the #26's nose reaches the line (it is at full speed by then). */
const crossMs = (w: number) => (w * FINISH + 20) / CAR_SPEED + 120
const lmp2Ms = (w: number) => Math.max(carMs(w), crossMs(w) + WIN_MS)

/**
 * Chequered strip lying across the track, going into the distance: narrower and with shorter rows towards the far
 * edge, leaning a little to the right.
 */
function finishLine(c: Ctx, x: number, flash: number) {
  const ROWS = 6
  const near = GROUND + 13
  const far = GROUND - 9
  /** Depth 0 (near) .. 1 (far) → screen y, rows getting shorter with the distance. */
  const yAt = (d: number) => near - (near - far) * (1 - (1 - d) ** 1.6)
  /** u across the strip (-6..6), shrunk with the distance. */
  const at = (u: number, d: number): Pt => [x + u * (1 - 0.45 * d) + (near - yAt(d)) * 0.4, yAt(d)]
  c.save()
  glow(c, '#e5e7eb')
  c.shadowBlur = 6 + 18 * flash
  c.lineWidth = 1
  for (let r = 0; r < ROWS; r++) {
    const d0 = r / ROWS
    const d1 = (r + 1) / ROWS
    for (let k = r % 2; k < 3; k += 2) {
      const u = -6 + k * 4
      poly(c, [at(u, d0), at(u + 4, d0), at(u + 4, d1), at(u, d1)])
      c.fill()
    }
  }
  poly(c, [at(-6, 0), at(6, 0), at(6, 1), at(-6, 1)])
  c.stroke()
  c.restore()
}

/** Two confetti cannons at the bottom corners, each spraying across most of the card up to its top. */
const CONFETTI_G = 0.0006
function confetti(c: Ctx, w: number, h: number, t: number) {
  const floor = h - (H - GROUND)
  const cannons: [number, number, number][] = [
    [8, -0.8, 0], // bottom left, towards the top right
    [w - 8, -Math.PI + 0.8, 1], // bottom right, towards the top left
  ]
  const reach = Math.sqrt(2 * CONFETTI_G * (floor - 10)) // speed that just reaches the top
  for (const [x0, aim, k] of cannons) {
    for (let i = 0; i < 80; i++) {
      const n = k * 100 + i
      const angle = aim + (noise(n) - 0.5) * 1.2
      const v = reach * (0.6 + noise(n + 17) * 0.5)
      const delay = noise(n + 31) * 160
      const tt = t - delay
      if (tt <= 0) continue
      // A little air drag on the horizontal speed, so the pieces flutter down.
      const px = x0 + Math.cos(angle) * v * 2500 * (1 - Math.exp(-tt / 2500))
      const py = floor + Math.sin(angle) * v * tt + 0.5 * CONFETTI_G * tt * tt
      if (py > floor + 4) continue
      c.save()
      glow(c, [ORANGE, '#e5e7eb', '#fbbf24'][n % 3]!)
      c.globalAlpha *= 1 - Math.max(0, (tt - 1200) / 400)
      c.translate(px + Math.sin(tt / 140 + n) * 3, py)
      c.rotate(tt / (60 + noise(n + 80) * 90) + n)
      c.fillRect(-4.5, -1.9, 9, 3.8)
      c.restore()
    }
  }
}

const lmp2: Effect = {
  duration: lmp2Ms,
  draw(c, w, ms) {
    ground(c, w, fade(ms, lmp2Ms(w)))
    const x = carX(w, ms)
    const since = ms - crossMs(w)
    finishLine(c, w * FINISH, since >= 0 && since < 350 ? 1 - since / 350 : 0)
    glow(c, ORANGE)
    // Light trail from the rear wing and the diffuser, fading towards the back.
    c.save()
    c.lineCap = 'round'
    for (const [y, width, length] of [[GROUND - 50 * CAR_SCALE, 1.4, TRAIL * 0.7], [GROUND - 16 * CAR_SCALE, 2, TRAIL]] as const) {
      const grad = c.createLinearGradient(x - length, 0, x, 0)
      grad.addColorStop(0, 'rgba(249,115,22,0)')
      grad.addColorStop(1, 'rgba(249,115,22,0.85)')
      c.strokeStyle = grad
      c.lineWidth = width
      c.beginPath()
      c.moveTo(Math.max(0, x - length), y)
      c.lineTo(x, y)
      c.stroke()
    }
    c.restore()
    c.save()
    c.translate(x, GROUND - 56 * CAR_SCALE)
    c.scale(CAR_SCALE, CAR_SCALE)
    c.lineWidth = 1.6 / CAR_SCALE
    car(c, x / 9)
    c.restore()
    // The result above the line, on screen until the very end (only its last 150 ms fade).
    if (since >= 0) {
      const k = ease(prog(since, 0, 300))
      c.save()
      c.globalAlpha = k * Math.min(1, (lmp2Ms(w) - ms) / 150)
      glow(c, ORANGE)
      c.textAlign = 'center'
      c.font = `700 ${20 + 3 * (1 - k)}px Inter, sans-serif`
      c.fillText(motorsportWin.title.fr, w * FINISH, GROUND - 57)
      glow(c, '#e5e7eb')
      c.shadowBlur = 4
      c.font = '500 11.5px Inter, sans-serif'
      c.fillText(motorsportWin.detail.fr, w * FINISH, GROUND - 43)
      c.restore()
    }
  },
  overlay(c, w, h, ms) {
    const since = ms - crossMs(w)
    if (since < 0) return
    c.save()
    c.globalAlpha = fade(ms, lmp2Ms(w))
    confetti(c, w, h, since)
    c.restore()
  },
}

// ---------- soldier on an assault course: a stick figure, hips as origin, angles from the vertical (positive = forwards)
const TORSO = 18, THIGH = 11, SHIN = 11, ARM = 9, FOREARM = 8
type Pose = { hip: Pt; sh: Pt; head: Pt; legs: Pt[][]; arms: Pt[][]; lean: number }
const at = (o: Pt, a: number, l: number): Pt => [o[0] + Math.sin(a) * l, o[1] + Math.cos(a) * l]

/** Running; `lift` raises the body (jump), `tuck` (0..1) folds the legs and reaches forward. */
function runPose(x: number, ph: number, lift: number, tuck: number): Pose {
  const hip: Pt = [x, GROUND - 21 + 1.5 * Math.abs(Math.sin(ph)) * (1 - tuck) - lift]
  const lean = 0.25 + tuck * 0.2
  const sh: Pt = [hip[0] + Math.sin(lean) * TORSO, hip[1] - Math.cos(lean) * TORSO]
  const head: Pt = [sh[0] + Math.sin(lean) * 7, sh[1] - Math.cos(lean) * 7]
  const legs = [0, Math.PI].map((o) => {
    const p = ph + o
    const a = (1 - tuck) * 0.75 * Math.sin(p) + tuck * (o ? 0.9 : 1.4)
    const bend = (1 - tuck) * (0.25 + 1.1 * Math.max(0, -Math.cos(p))) + tuck * 2
    const knee = at(hip, a, THIGH)
    return [hip, knee, at(knee, a - bend, SHIN)]
  })
  const arms = [0, Math.PI].map((o) => {
    const a = (1 - tuck) * -0.7 * Math.sin(ph + o) + tuck * 1.2
    const elbow = at(sh, a, ARM)
    return [sh, elbow, at(elbow, a + 1.4, FOREARM)]
  })
  return { hip, sh, head, legs, arms, lean }
}

/** Crawling flat under the wire. */
function pronePose(x: number, ph: number): Pose {
  const g = GROUND
  const s = Math.sin(ph)
  const hip: Pt = [x, g - 6], sh: Pt = [x + 18, g - 8], head: Pt = [x + 25, g - 11]
  const legs: Pt[][] = [
    [hip, [x - 10, g - 6 + 2 * s], [x - 20, g - 3]],
    [hip, [x - 9, g - 3 - 2 * s], [x - 19, g - 2]],
  ]
  const arms: Pt[][] = [
    [sh, [sh[0] + 6 + 3 * s, g - 3], [sh[0] + 13 + 4 * s, g - 4]],
    [sh, [sh[0] + 6 - 3 * s, g - 3], [sh[0] + 12 - 4 * s, g - 5]],
  ]
  return { hip, sh, head, legs, arms, lean: 1.45 }
}

/**
 * Rifle slung on the back, drawn along -y from the butt (behind the hip): tilted backwards so it sticks out
 * behind the shoulder, almost along the back when crawling so it stays under the wire.
 */
function rifle(c: Ctx, prone: boolean) {
  c.save()
  c.translate(-3, 8)
  c.rotate(prone ? -0.12 : -0.55)
  c.lineWidth = 1.4
  poly(c, [[-1.5, 0], [1.5, 0], [1, -6], [-1, -6]]) // stock
  c.stroke()
  c.lineWidth = 2.2
  c.beginPath()
  c.moveTo(0, -6)
  c.lineTo(0, -16) // receiver
  c.moveTo(0, -11)
  c.lineTo(3.5, -12) // magazine
  c.stroke()
  c.lineWidth = 1.2
  c.beginPath()
  c.moveTo(0, -16)
  c.lineTo(0, -24) // barrel
  c.stroke()
  c.restore()
}

function soldier(c: Ctx, P: Pose) {
  const line = (pts: Pt[]) => {
    c.beginPath()
    c.moveTo(...pts[0]!)
    pts.slice(1).forEach((p) => c.lineTo(...p))
    c.stroke()
  }
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.lineWidth = 2
  // Backpack and the rifle slung across it, in the torso's frame (-x = back, -y = towards the shoulders).
  c.save()
  c.translate((P.hip[0] + P.sh[0]) / 2, (P.hip[1] + P.sh[1]) / 2)
  c.rotate(P.lean)
  c.strokeRect(-9, -7, 6, 12)
  rifle(c, P.lean > 1)
  c.restore()
  line(P.legs[1]!)
  line(P.arms[1]!)
  line([P.hip, P.sh])
  line(P.legs[0]!)
  line(P.arms[0]!)
  c.beginPath()
  c.arc(...P.head, 5, 0, 7)
  c.stroke()
  // Helmet.
  c.save()
  c.translate(...P.head)
  c.rotate(P.lean * 0.6)
  c.beginPath()
  c.arc(0, -1, 6.5, Math.PI, 0)
  c.moveTo(-7.5, -1)
  c.lineTo(7.5, -1)
  c.stroke()
  c.restore()
}

/** Obstacles, placed along the panel width: a wall to jump, then barbed wire to crawl under. */
const course = (w: number) => {
  const wall = w * 0.35
  const wire0 = w * 0.62
  return { wall, wire0, wire1: wire0 + 56 }
}
const JUMP = 64 // jump length over the wall
const SPEED = 0.405 // units per ms when running; crawling is slower
const segments = (w: number) => {
  const { wall, wire0, wire1 } = course(w)
  return [
    [-40, wall - JUMP / 2, 1],
    [wall - JUMP / 2, wall + JUMP / 2, 0.55], // slower in the air, so the jump reads
    [wall + JUMP / 2, wire0 - 18, 1],
    [wire0 - 18, wire1 + 8, 0.42],
    [wire1 + 8, w + 40, 1],
  ] as const
}
function soldierX(w: number, ms: number) {
  for (const [a, b, v] of segments(w)) {
    const d = (b - a) / (SPEED * v)
    if (ms <= d) return a + ms * SPEED * v
    ms -= d
  }
  return w + 40
}
function pose(w: number, x: number) {
  const { wall, wire0, wire1 } = course(w)
  const ph = x / 7
  if (x > wire0 - 18 && x < wire1 + 8) return pronePose(x, ph * 0.8)
  const d = x - (wall - JUMP / 2)
  if (d > 0 && d < JUMP) {
    const k = Math.sin((Math.PI * d) / JUMP)
    return runPose(x, ph, 40 * k, k)
  }
  return runPose(x, ph, 0, 0)
}
function obstacles(c: Ctx, w: number) {
  const { wall, wire0, wire1 } = course(w)
  c.lineWidth = 1.5
  c.strokeRect(wall - 5, GROUND - 26, 10, 26)
  c.beginPath()
  for (const x of [wire0, (wire0 + wire1) / 2, wire1]) {
    c.moveTo(x, GROUND)
    c.lineTo(x, GROUND - 20)
  }
  c.moveTo(wire0, GROUND - 19)
  for (let x = wire0, i = 0; x <= wire1; x += 7, i++) c.lineTo(x, GROUND - 19 + (i % 2 ? 3 : 0))
  c.stroke()
}

const commando: Effect = {
  duration: (w) => segments(w).reduce((s, [a, b, v]) => s + (b - a) / (SPEED * v), 0),
  draw(c, w, ms) {
    const alpha = fade(ms, this.duration(w))
    ground(c, w, alpha)
    c.save()
    c.globalAlpha = alpha
    glow(c, WIRE)
    c.shadowBlur = 4
    obstacles(c, w)
    c.restore()
    glow(c, KHAKI)
    soldier(c, pose(w, soldierX(w, ms)))
  },
}

// ---------- fixed-length effects for the other entries: same neon strokes, laid out along the panel width
const GREEN = '#4ade80'
const RED = '#f87171'
const SKY = '#38bdf8'
const CYAN = '#22d3ee'
const VIOLET = '#a78bfa'

const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
/** 0..1 between `from` and `from + len`. */
const prog = (ms: number, from: number, len: number) => clamp01((ms - from) / len)
const ease = (t: number) => 1 - (1 - t) ** 3
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
/** Deterministic noise in 0..1, so an effect looks the same every time. */
const noise = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
const seg = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  c.beginPath()
  c.moveTo(x0, y0)
  c.lineTo(x1, y1)
  c.stroke()
}
const dot = (c: Ctx, x: number, y: number, r: number) => {
  c.beginPath()
  c.arc(x, y, r, 0, 7)
  c.fill()
}

/** An effect of fixed length; `a` is its fade, to multiply into any alpha the drawing sets itself. */
const timed = (total: number, draw: (c: Ctx, w: number, ms: number, a: number) => void): Effect => ({
  duration: () => total,
  draw(c, w, ms) {
    const a = fade(ms, total)
    c.save()
    c.globalAlpha = a
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.lineWidth = 1.6
    draw(c, w, ms, a)
    c.restore()
  },
})

/** Cloud outline centred on (x, y), about 30 × 16 units. */
function cloud(c: Ctx, x: number, y: number) {
  c.beginPath()
  c.arc(x - 9, y + 2, 6, Math.PI / 2, Math.PI * 1.5)
  c.arc(x, y - 3, 9, Math.PI * 1.15, Math.PI * 1.95)
  c.arc(x + 10, y + 2, 6, -Math.PI / 2, Math.PI / 2)
  c.closePath()
  c.stroke()
}

// ---------- Pre-MSc, the « piscine »: code is typed, then a bot (the moulinette) scans it with its beam, flags a
// failing line, rewrites it and scans again: every test passes while the water fills the window
/** Each line: indent level, then token lengths (units). */
const CODE = [[0, 22, 14, 30], [1, 18, 40], [2, 10, 26, 12], [1, 20], [0, 16, 24]]
const CODE_LEN = CODE.reduce((s, [, ...t]) => s + t.reduce((u, v) => u + v + 4, 0), 0)
const FIX = 2 // the line that fails the first run and gets rewritten
const SCAN1 = 850
const SCAN2 = 1750
const ROW_MS = 100 // beam time per line
/** The line the bot looks at (fractional while it moves), by keyframes. */
const BOT_ROW: [number, number][] = [[0, 1.5], [800, 1.5], [SCAN1, 0], [SCAN1 + 3 * ROW_MS, 3], [1350, FIX], [1650, FIX], [SCAN2, 0], [SCAN2 + 3 * ROW_MS, 3], [2300, 1.5]]
const botRow = (ms: number) => {
  const i = BOT_ROW.findIndex(([t]) => t > ms)
  if (i < 0) return BOT_ROW[BOT_ROW.length - 1]![1]
  if (i === 0) return BOT_ROW[0]![1]
  const [t0, r0] = BOT_ROW[i - 1]!
  const [t1, r1] = BOT_ROW[i]!
  return r0 + (r1 - r0) * easeInOut((ms - t0) / (t1 - t0))
}
/** A test result: a green tick or a red cross, `k` (0..1) as it appears. */
function testMark(c: Ctx, x: number, y: number, ok: boolean, k: number) {
  if (!k) return
  c.save()
  glow(c, ok ? GREEN : RED)
  c.globalAlpha *= k
  c.lineWidth = 1.6
  c.beginPath()
  if (ok) {
    c.moveTo(x - 3, y)
    c.lineTo(x - 1, y + 2.5)
    c.lineTo(x + 3, y - 3)
  } else {
    c.moveTo(x - 2.5, y - 2.5)
    c.lineTo(x + 2.5, y + 2.5)
    c.moveTo(x + 2.5, y - 2.5)
    c.lineTo(x - 2.5, y + 2.5)
  }
  c.stroke()
  c.restore()
}
/** A small hovering bot facing left; `eye` is the colour of its eyes. */
function bot(c: Ctx, x: number, y: number, eye: string, ms: number) {
  glow(c, WIRE)
  c.lineWidth = 1.4
  c.strokeRect(x - 8, y - 6, 16, 12)
  seg(c, x, y - 6, x, y - 10)
  dot(c, x, y - 11, 1.2)
  seg(c, x - 8, y + 2, x - 12, y + 4) // arm towards the code
  // Hover jets, flickering.
  c.save()
  c.globalAlpha *= 0.5 + 0.5 * Math.abs(Math.sin(ms / 40))
  seg(c, x - 4, y + 8.5, x - 4, y + 10.5)
  seg(c, x + 4, y + 8.5, x + 4, y + 10.5)
  c.restore()
  glow(c, eye)
  dot(c, x - 3.5, y - 1, 1.5)
  dot(c, x + 3.5, y - 1, 1.5)
}
const piscine = timed(2800, (c, w, ms, a) => {
  const W = Math.min(w * 0.2, 150)
  const h = 58
  const x0 = Math.max(w * 0.6, 580) // right of the tags, in line with the MSc crane
  const y0 = 34
  const rowY = (r: number) => y0 + 19 + r * 8.5
  const done = prog(ms, 2200, 400)
  glow(c, GREEN)
  c.save()
  c.shadowBlur = 10 + (done && done < 1 ? 20 * (1 - done) : 0)
  c.strokeRect(x0, y0, W, h)
  c.restore()
  seg(c, x0, y0 + 11, x0 + W, y0 + 11)
  for (const dx of [7, 13, 19]) dot(c, x0 + dx, y0 + 5.5, 1.6)
  c.save()
  c.beginPath()
  c.rect(x0 + 1, y0 + 12, W - 2, h - 13)
  c.clip()
  // Water rising until the window is full, when the tests pass.
  const level = y0 + h - 2 - easeInOut(prog(ms, 100, 2100)) * (h - 12)
  c.beginPath()
  c.moveTo(x0, y0 + h)
  for (let x = x0; x <= x0 + W + 4; x += 4) c.lineTo(x, level + 2 * Math.sin(x / 14 + ms / 180))
  c.lineTo(x0 + W, y0 + h)
  c.closePath()
  c.globalAlpha = a * 0.12
  c.fill()
  c.globalAlpha = a * 0.6
  c.stroke()
  c.restore()
  // Code typed token by token; the failing line is erased and typed again while the bot fixes it.
  let left = prog(ms, 150, 650) * CODE_LEN
  let cursor: Pt = [x0 + 10, rowY(0)]
  const fix = ms < 1400 ? 1 : ms < 1500 ? 1 - prog(ms, 1400, 100) : prog(ms, 1500, 200)
  c.lineWidth = 2.2
  CODE.forEach(([indent, ...tokens], r) => {
    const y = rowY(r)
    let x = x0 + 10 + indent! * 12
    let cap = r === FIX ? fix * tokens.reduce((u, v) => u + v + 4, 0) : Infinity
    for (const t of tokens) {
      if (left <= 0 || cap <= 0) break
      const l = Math.min(t, left, cap)
      c.globalAlpha = a * (r % 3 === 1 ? 0.65 : 1)
      seg(c, x, y, x + l, y)
      left -= t + 4
      cap -= t + 4
      x += t + 4
      cursor = [x - 4 + Math.min(0, left, cap), y]
    }
    if (r === FIX && ms >= SCAN1 + FIX * ROW_MS + 60 && ms < 1400) {
      // The failing line, underlined in red.
      c.save()
      glow(c, RED)
      c.globalAlpha = a * 0.8
      c.lineWidth = 1
      seg(c, x0 + 10 + indent! * 12, y + 3, x0 + 10 + indent! * 12 + 56, y + 3)
      c.restore()
    }
  })
  c.globalAlpha = a
  if (ms < SCAN1 && Math.floor(ms / 220) % 2 === 0) c.fillRect(cursor[0] + 3, cursor[1] - 4, 4, 7)
  // Test results, one per line in a column on the right: first scan, then the second once the line is fixed.
  for (let i = 0; i < 4; i++) {
    const x = x0 + W - 11
    const y = rowY(i)
    if (ms < SCAN2) testMark(c, x, y, i !== FIX, prog(ms, SCAN1 + i * ROW_MS + 60, 60) * (1 - prog(ms, SCAN2 - 100, 100)))
    else testMark(c, x, y, true, prog(ms, SCAN2 + i * ROW_MS + 60, 60))
  }
  // The bot flies in, follows the line it checks and lights it with its beam: red while it fixes a line.
  // Red while its beam is on the failing line: when it finds it, then while it rewrites it.
  const failing = (ms >= SCAN1 + FIX * ROW_MS && ms < SCAN1 + (FIX + 1) * ROW_MS) || (ms >= 1350 && ms < 1500)
  const fixing = ms >= 1350 && ms < 1700
  const scanning = (ms >= SCAN1 && ms < SCAN1 + 4 * ROW_MS) || (ms >= SCAN2 && ms < SCAN2 + 4 * ROW_MS) || fixing
  const bx = x0 + W + 24 + (1 - ease(prog(ms, 250, 550))) * 120
  const happy = done ? Math.abs(Math.sin(done * Math.PI * 2)) * 5 : 0
  const by = rowY(botRow(ms)) + Math.sin(ms / 160) * 1.5 - happy
  const eye = failing ? RED : ms >= 1500 ? GREEN : SKY
  if (scanning) {
    c.save()
    glow(c, eye)
    c.globalAlpha = a * 0.16
    poly(c, [[bx - 12, by + 4], [x0 + 6, by - 3], [x0 + 6, by + 3]])
    c.fill()
    c.globalAlpha = a * 0.5
    c.lineWidth = 0.8
    seg(c, bx - 12, by + 4, x0 + 6, by)
    c.restore()
  }
  bot(c, bx, by, eye, ms)
  // All green: a check mark validates the build.
  const k = prog(ms, 2200, 250)
  if (k) {
    const p: Pt[] = [[x0 + W - 52, y0 + 34], [x0 + W - 46, y0 + 41], [x0 + W - 34, y0 + 26]]
    glow(c, GREEN)
    c.lineWidth = 2.6
    c.shadowBlur = 16
    c.beginPath()
    c.moveTo(...p[0]!)
    if (k < 0.4) c.lineTo(p[0]![0] + (p[1]![0] - p[0]![0]) * (k / 0.4), p[0]![1] + (p[1]![1] - p[0]![1]) * (k / 0.4))
    else {
      const q = (k - 0.4) / 0.6
      c.lineTo(...p[1]!)
      c.lineTo(p[1]![0] + (p[2]![0] - p[1]![0]) * q, p[1]![1] + (p[2]![1] - p[1]![1]) * q)
    }
    c.stroke()
  }
})

// ---------- Master of Science, information systems architect, ongoing: a crane stacks the floors of a system;
// two are built, the third is still on its way down above its dashed slot
const FLOOR_W = 64
const FLOOR_H = 13
/** Floor icons, centred on (x, y): infrastructure, data, applications. */
const FLOOR_ICONS: ((c: Ctx, x: number, y: number) => void)[] = [
  (c, x, y) => {
    c.strokeRect(x - 5, y - 4, 10, 3.5)
    c.strokeRect(x - 5, y + 0.5, 10, 3.5)
  },
  (c, x, y) => {
    c.beginPath()
    c.ellipse(x, y - 3, 5, 1.6, 0, 0, 7)
    c.moveTo(x - 5, y - 3)
    c.lineTo(x - 5, y + 3)
    c.moveTo(x + 5, y - 3)
    c.lineTo(x + 5, y + 3)
    c.stroke()
    c.beginPath()
    c.ellipse(x, y + 3, 5, 1.6, 0, 0, Math.PI)
    c.stroke()
  },
  (c, x, y) => {
    // </>
    c.beginPath()
    c.moveTo(x - 3, y - 3.5)
    c.lineTo(x - 6, y)
    c.lineTo(x - 3, y + 3.5)
    c.moveTo(x + 3, y - 3.5)
    c.lineTo(x + 6, y)
    c.lineTo(x + 3, y + 3.5)
    c.moveTo(x + 1.2, y - 4)
    c.lineTo(x - 1.2, y + 4)
    c.stroke()
  },
]
function floor(c: Ctx, bx: number, top: number, k: number) {
  c.strokeRect(bx - FLOOR_W / 2, top, FLOOR_W, FLOOR_H)
  const x = bx - FLOOR_W / 2 + 11
  const y = top + FLOOR_H / 2
  c.lineWidth = 1.2
  FLOOR_ICONS[k]!(c, x, y)
  seg(c, x + 11, y - 1.5, x + 36, y - 1.5)
  seg(c, x + 11, y + 2, x + 28, y + 2)
}
/** Floors lowered by the crane: start time; the last one stops on its way down, the build is still going on. */
const LIFTS = [200, 1050, 1900]
const construction = timed(2800, (c, w, ms, a) => {
  const mx = Math.max(w * 0.68, 650) // right of the text
  const bx = mx + 62
  const jy = 14
  const slot = (k: number) => GROUND - (k + 1) * FLOOR_H
  const start = jy + 16
  glow(c, CYAN)
  // Crane: lattice mast, jib with its tie rods, counterweight, cabin, trolley.
  c.lineWidth = 1.1
  seg(c, mx - 3, GROUND, mx - 3, jy)
  seg(c, mx + 3, GROUND, mx + 3, jy)
  for (let y = GROUND; y > jy + 4; y -= 8) seg(c, mx - 3, y, mx + 3, y - 8)
  seg(c, mx - 30, jy, mx + 100, jy)
  seg(c, mx - 30, jy + 4, mx + 100, jy + 4)
  for (let x = mx - 30; x < mx + 100; x += 8) seg(c, x, jy + 4, x + 4, jy)
  seg(c, mx, jy - 10, mx - 30, jy)
  seg(c, mx, jy - 10, mx + 100, jy)
  seg(c, mx - 3, jy, mx, jy - 10)
  seg(c, mx + 3, jy, mx, jy - 10)
  c.strokeRect(mx - 30, jy + 4, 11, 8)
  c.strokeRect(mx + 4, jy + 4, 8, 7)
  c.strokeRect(bx - 4, jy + 4, 8, 3)
  // Slots not built yet, dashed.
  c.save()
  c.setLineDash([3, 3])
  c.globalAlpha = a * 0.35
  for (let k = 1; k < LIFTS.length; k++) if (ms < LIFTS[k]! + 550) c.strokeRect(bx - FLOOR_W / 2, slot(k), FLOOR_W, FLOOR_H)
  c.restore()
  // Floors: lowered from under the jib, set down with a flash; the third stops halfway.
  let hook = start - 8
  LIFTS.forEach((t0, k) => {
    if (ms < t0) return
    const last = k === LIFTS.length - 1
    const d = last ? 0.4 * easeInOut(prog(ms, t0, 300)) : easeInOut(prog(ms, t0, 550))
    const top = start + d * (slot(k) - start)
    const set = !last && ms >= t0 + 550
    const flash = set ? 1 - prog(ms, t0 + 550, 350) : 0
    c.save()
    c.globalAlpha = a * prog(ms, t0, 100)
    c.shadowBlur = 10 + 20 * flash
    floor(c, bx, top, k)
    c.restore()
    if (!set) {
      hook = top - 8
      // Slings from the hook to the floor's corners.
      seg(c, bx, hook, bx - FLOOR_W / 2 + 6, top)
      seg(c, bx, hook, bx + FLOOR_W / 2 - 6, top)
    } else if (ms < (LIFTS[k + 1] ?? Infinity)) {
      // The empty hook goes back up.
      hook = slot(k) - 8 + easeInOut(prog(ms, t0 + 550, 300)) * (start - 8 - (slot(k) - 8))
    }
  })
  c.lineWidth = 1
  seg(c, bx, jy + 7, bx, hook)
  c.beginPath()
  c.arc(bx, hook + 1.5, 1.8, -Math.PI / 2, Math.PI)
  c.stroke()
})

// ---------- ULIT, Salesforce developer: a cloud hops along the bottom of the panel, squashing a little as it lands
const HOP_MS = 2000
const cloudHop = timed(HOP_MS, (c, w, ms, a) => {
  const t = prog(ms, 0, HOP_MS)
  // Same speed as a 3.2 s run from x = 400 (right of the tags): starting later, it appears further right.
  const from = w + 40 - ((w + 40 - 400) * HOP_MS) / 3200
  const x = from + t * (w + 40 - from)
  // One hop every 700 ms.
  const h = Math.abs(Math.sin((ms / 700) * Math.PI))
  const squash = h < 0.15 ? 1 - h / 0.15 : 0
  const S = 2
  const appear = ease(prog(ms, 0, 350))
  glow(c, SKY)
  c.save()
  c.globalAlpha = a * appear * 0.4 * (1 - h * 0.6)
  c.beginPath()
  c.ellipse(x, GROUND + 1, 20 * (1 - h * 0.3), 1.5, 0, 0, 7)
  c.stroke()
  c.restore()
  c.save()
  c.globalAlpha = a * appear
  c.translate(x, GROUND - 2 - h * 18)
  c.scale(S * (1 + 0.12 * squash), S * (1 - 0.12 * squash))
  c.lineWidth = 1.6 / S
  cloud(c, 0, -8)
  c.restore()
})

// ---------- crypto watch: a candlestick chart drawn left to right with its moving average; no figures
type Candle = { o: number; c: number; h: number; l: number }
const candleCache = new Map<number, Candle[]>()
/** A random walk that ends where it started, so the chart shows activity, not a gain or a loss. */
function candles(n: number): Candle[] {
  const hit = candleCache.get(n)
  if (hit) return hit
  const closes = [0]
  for (let i = 1; i <= n; i++) closes.push(closes[i - 1]! + (noise(i) - 0.5) * 2 + Math.sin(i / 7) * 0.6)
  const drift = closes[n]! / n
  const out = Array.from({ length: n }, (_, i) => {
    const o = closes[i]! - drift * i
    const cl = closes[i + 1]! - drift * (i + 1)
    return { o, c: cl, h: Math.max(o, cl) + noise(i + 99) * 0.8, l: Math.min(o, cl) - noise(i + 199) * 0.8 }
  })
  candleCache.set(n, out)
  return out
}
const chart = timed(2600, (c, w, ms, a) => {
  const n = Math.floor((w - 40) / 13)
  const data = candles(n)
  const lo = Math.min(...data.map((d) => d.l))
  const hi = Math.max(...data.map((d) => d.h))
  const Y = (v: number) => 84 - ((v - lo) / (hi - lo)) * 66
  const X = (i: number) => 26 + i * 13
  let shown = 0
  data.forEach((d, i) => {
    const k = ease(prog(ms, 100 + i * (1700 / n), 140))
    if (!k) return
    shown = i
    const up = d.c >= d.o
    glow(c, up ? GREEN : RED)
    c.globalAlpha = a * 0.85
    c.lineWidth = 1.2
    seg(c, X(i), Y(d.o + (d.h - d.o) * k), X(i), Y(d.o + (d.l - d.o) * k))
    const top = Y(d.o + (d.c - d.o) * k)
    c.lineWidth = 1.4
    c.globalAlpha = a * 0.2
    c.fillRect(X(i) - 3.5, Math.min(top, Y(d.o)), 7, Math.max(1, Math.abs(top - Y(d.o))))
    c.globalAlpha = a * 0.85
    c.strokeRect(X(i) - 3.5, Math.min(top, Y(d.o)), 7, Math.max(1, Math.abs(top - Y(d.o))))
  })
  // Moving average over 6 candles, up to the last one shown.
  glow(c, WIRE)
  c.globalAlpha = a * 0.7
  c.lineWidth = 1.4
  c.beginPath()
  for (let i = 0; i <= shown; i++) {
    const win = data.slice(Math.max(0, i - 5), i + 1)
    const v = win.reduce((s, d) => s + d.c, 0) / win.length
    if (i) c.lineTo(X(i), Y(v))
    else c.moveTo(X(i), Y(v))
  }
  c.stroke()
})

// ---------- mining: each strike of the pickaxe writes a transaction into the block and locks it; coins pop out
const GOLD = '#facc15'
const WOOD = '#d6a35c'
const STRIKES = [710, 1410, 2110]
/** Per strike: horizontal and vertical speed (units per ms) of each coin; they fall in front of the block. */
const COINS = [[[-0.03, -0.2], [-0.07, -0.24], [-0.11, -0.17]], [[-0.05, -0.23], [-0.09, -0.2]], [[-0.02, -0.18], [-0.08, -0.26], [-0.12, -0.21]]]
const G = 0.0008
const PICK_LEN = 46
const STRIKE_ANGLE = -0.75

/** Point of the pickaxe at `u` along the handle and `v` across it (positive = the side that strikes). */
const pickAt = (px: number, py: number, angle: number, u: number, v: number): Pt => [
  px + Math.cos(angle) * u - Math.sin(angle) * v,
  py + Math.sin(angle) * u + Math.cos(angle) * v,
]
function pickaxe(c: Ctx, px: number, py: number, angle: number) {
  const at = (u: number, v: number) => pickAt(px, py, angle, u, v)
  const L = PICK_LEN
  // Wooden handle with a grip.
  glow(c, WOOD)
  c.lineWidth = 1.3
  poly(c, [at(-3, -1.6), at(L - 2, -1.6), at(L - 2, 1.6), at(-3, 1.6)])
  c.stroke()
  for (const u of [1, 5, 9]) seg(c, ...at(u, -1.6), ...at(u + 2.5, 1.6))
  // Steel head: a crescent with two points, and the collar around the handle.
  glow(c, WIRE)
  c.lineWidth = 1.5
  c.beginPath()
  c.moveTo(...at(L - 4, 14))
  c.quadraticCurveTo(...at(L + 7, 0), ...at(L - 4, -14))
  c.quadraticCurveTo(...at(L + 1, 0), ...at(L - 4, 14))
  c.stroke()
  poly(c, [at(L - 5, -3), at(L + 1, -3), at(L + 1, 3), at(L - 5, 3)])
  c.stroke()
}
/** Padlock centred on (x, y); `lift` raises the shackle (open). */
function padlock(c: Ctx, x: number, y: number, lift: number) {
  c.strokeRect(x - 3, y - 2.5, 6, 5)
  c.beginPath()
  c.moveTo(x - 2, y - 2.5)
  c.lineTo(x - 2, y - 4 - lift)
  c.arc(x, y - 4 - lift, 2, Math.PI, 0)
  c.lineTo(x + 2, y - 2.5 - lift)
  c.stroke()
}
const mining = timed(2900, (c, w, ms, a) => {
  const bx = w * 0.64 // left of the dashboard screenshot on the right
  const bw = 64
  const bh = 50
  const left = bx - bw / 2
  const top = GROUND - bh
  // Held low, at hip height, swung over the top onto the block's top-left corner.
  const px = bx - 70
  const py = GROUND - 22
  const hit = pickAt(px, py, STRIKE_ANGLE, PICK_LEN - 4, 14)
  const cycle = (ms - 150) % 700
  const raise = ms < 150 ? 0 : cycle < 450 ? ease(cycle / 450) : cycle < 560 ? 1 - easeInOut((cycle - 450) / 110) : 0
  const since = STRIKES.filter((t) => ms >= t)
  const last = since.length ? ms - since[since.length - 1]! : Infinity
  const shake = last < 160 ? Math.sin(last * 0.12) * 1.5 * (1 - last / 160) : 0
  // Block: front face, top and side, a header with its hash, then one transaction row per strike.
  glow(c, VIOLET)
  c.save()
  c.translate(shake, 0)
  c.strokeRect(left, top, bw, bh)
  poly(c, [[left, top], [left + 8, top - 7], [left + bw + 8, top - 7], [left + bw, top]])
  c.stroke()
  poly(c, [[left + bw, top], [left + bw + 8, top - 7], [left + bw + 8, GROUND - 7], [left + bw, GROUND]])
  c.stroke()
  seg(c, left, top + 10, left + bw, top + 10)
  c.lineWidth = 1.8
  seg(c, left + 5, top + 5, left + 22, top + 5)
  seg(c, left + 25, top + 5, left + 33, top + 5)
  STRIKES.forEach((t0, r) => {
    const y = top + 20 + r * 11
    const filled = Math.round(9 * prog(ms, t0, 250))
    const lock = t0 + 250
    const flash = ms >= lock ? 1 - prog(ms, lock, 350) : 0
    c.save()
    c.shadowBlur = 10 + 18 * flash
    c.lineWidth = 1.6
    // Address: dashes typed in one by one, faint until written.
    for (let k = 0; k < 9; k++) {
      c.globalAlpha = a * (k < filled ? 1 : 0.2)
      seg(c, left + 6 + k * 4.5, y, left + 9 + k * 4.5, y)
    }
    c.globalAlpha = a * (ms >= t0 ? 1 : 0.3)
    c.lineWidth = 1.2
    padlock(c, left + bw - 10, y, ms >= lock ? 0 : 2)
    c.restore()
  })
  c.restore()
  pickaxe(c, px, py, STRIKE_ANGLE - raise * 1.6)
  // Sparks at the contact point, right after a strike.
  if (last < 150) {
    glow(c, GOLD)
    c.globalAlpha = a * (1 - last / 150)
    c.lineWidth = 1.2
    for (let k = 0; k < 6; k++) {
      const t = -Math.PI + (k * Math.PI) / 5
      const r0 = 3 + last * 0.04
      seg(c, hit[0] + Math.cos(t) * r0, hit[1] + Math.sin(t) * r0, hit[0] + Math.cos(t) * (r0 + 5), hit[1] + Math.sin(t) * (r0 + 5))
    }
    c.globalAlpha = a
  }
  // Coins: thrown out of the contact point, spinning, then lying on the ground.
  glow(c, GOLD)
  c.lineWidth = 1.4
  STRIKES.forEach((t0, i) => {
    if (ms < t0) return
    COINS[i]!.forEach(([vx, vy], j) => {
      const t = ms - t0
      const land = (-vy! + Math.sqrt(vy! * vy! + 2 * G * (GROUND - 4 - hit[1]))) / G
      const tt = Math.min(t, land)
      const x = hit[0] + vx! * tt
      const y = hit[1] + vy! * tt + 0.5 * G * tt * tt
      const spin = t < land ? Math.abs(Math.cos(t / 70 + j)) : 1
      c.beginPath()
      c.ellipse(x, y, Math.max(0.8, 4 * spin), 4, 0, 0, 7)
      c.stroke()
      if (spin > 0.5) seg(c, x, y - 1.8, x, y + 1.8)
    })
  })
})

// ---------- École de la Performance, racing technician: a dyno run of an LMP2 engine, rev counter and digital readout
// Gibson GK428, the 4.2 L V8 of every LMP2 since 2017: 450 kW (612 ch), 556 Nm, 9 000 tr/min max
// (https://en.wikipedia.org/wiki/Gibson_GK428_engine). The rpm of each peak is not published: the curve shapes are assumed.
const RPM_MIN = 2000
const RPM_MAX = 9000
const TORQUE_MAX = 556
const KW_MAX = 450
const KW_TO_CH = 1.3596
/** Torque peaks at 6 500 rpm, falls faster above. */
const torqueNm = (r: number) =>
  TORQUE_MAX * (1 - (r < 6500 ? 0.35 * ((r - 6500) / 4500) ** 2 : 0.15 * ((r - 6500) / 2500) ** 2))
const rawKw = (r: number) => (torqueNm(r) * r) / 9549
/** Scaled so the power peak (near 8 600 rpm) is the published 450 kW. */
const KW_SCALE = KW_MAX / Math.max(...Array.from({ length: 141 }, (_, i) => rawKw(RPM_MIN + i * 50)))
const powerCh = (r: number) => rawKw(r) * KW_SCALE * KW_TO_CH
const SCALE_MAX = 700 // both vertical axes, ch and Nm
const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR')

const dyno = timed(2900, (c, w, ms, a) => {
  const x0 = Math.max(w * 0.52, 420)
  const x1 = w * 0.92
  const yt = 24
  const yb = 92
  const X = (r: number) => x0 + ((r - RPM_MIN) / (RPM_MAX - RPM_MIN)) * (x1 - x0)
  const Y = (v: number) => yb - (v / SCALE_MAX) * (yb - yt)
  // A steady sweep up to the limiter, a short hold, then back down: the readout follows the curves.
  const sweep = prog(ms, 200, 1600)
  const peak = RPM_MIN + sweep * (RPM_MAX - RPM_MIN)
  const rpm = RPM_MIN + (peak - RPM_MIN) * (1 - easeInOut(prog(ms, 2050, 500)))
  const label = (text: string, x: number, y: number, align: CanvasTextAlign, size = 6.5) => {
    c.font = `500 ${size}px Inter, sans-serif`
    c.textAlign = align
    c.fillText(text, x, y)
  }

  // Grid, axes and their scales.
  glow(c, WIRE)
  c.shadowBlur = 0
  c.lineWidth = 1
  c.globalAlpha = a * 0.15
  for (const v of [200, 400, 600]) seg(c, x0, Y(v), x1, Y(v))
  for (const r of [4000, 6000, 8000]) seg(c, X(r), yt, X(r), yb)
  c.globalAlpha = a * 0.5
  c.beginPath()
  c.moveTo(x0, yt)
  c.lineTo(x0, yb)
  c.lineTo(x1, yb)
  c.lineTo(x1, yt)
  c.stroke()
  c.globalAlpha = a * 0.7
  for (const v of [200, 400, 600]) {
    label(String(v), x0 - 3, Y(v) + 2.2, 'right')
    label(String(v), x1 + 3, Y(v) + 2.2, 'left')
  }
  for (const r of [2000, 4000, 6000, 8000]) label(fmt(r), X(r), yb + 8, 'center')
  label(dynoLabels.rpm.fr, x1 + 3, yb + 8, 'left')
  c.globalAlpha = a * 0.9
  glow(c, ORANGE)
  c.shadowBlur = 0
  label(dynoLabels.power.fr, x0, yt - 4, 'left')
  c.globalAlpha = a * 0.6
  label(dynoLabels.torque.fr, x1, yt - 4, 'right')

  // Curves, up to the highest revs reached; torque dim, power bright.
  glow(c, ORANGE)
  const curve = (f: (r: number) => number, alpha: number, width: number) => {
    c.globalAlpha = a * alpha
    c.lineWidth = width
    c.beginPath()
    for (let r = RPM_MIN; r <= peak; r += 50) {
      if (r === RPM_MIN) c.moveTo(X(r), Y(f(r)))
      else c.lineTo(X(r), Y(f(r)))
    }
    c.stroke()
  }
  curve(torqueNm, 0.45, 1.2)
  curve(powerCh, 1, 1.8)
  if (sweep > 0) {
    c.globalAlpha = a
    c.shadowBlur = 16
    dot(c, X(rpm), Y(powerCh(rpm)), 2.2)
    c.globalAlpha = a * 0.6
    dot(c, X(rpm), Y(torqueNm(rpm)), 1.6)
  }

  // Rev counter left of the chart, red zone at the top of the range.
  const r0 = 31
  const gx = x0 - r0 - 24
  const gy = 94
  c.globalAlpha = a
  glow(c, ORANGE)
  c.lineWidth = 1.6
  c.beginPath()
  c.arc(gx, gy, r0, Math.PI, Math.PI * 2)
  c.stroke()
  c.lineWidth = 1.2
  for (let k = 0; k <= 9; k++) {
    const t = Math.PI + (k * Math.PI) / 9
    if (k >= 8) glow(c, RED)
    seg(c, gx + Math.cos(t) * (r0 - 4), gy + Math.sin(t) * (r0 - 4), gx + Math.cos(t) * r0, gy + Math.sin(t) * r0)
  }
  glow(c, ORANGE)
  const t = Math.PI + (rpm / RPM_MAX) * Math.PI
  c.lineWidth = 1.8
  seg(c, gx, gy, gx + Math.cos(t) * (r0 - 6), gy + Math.sin(t) * (r0 - 6))
  dot(c, gx, gy, 2)
  // Digital readout: power · torque above the rev counter, the revs under it.
  c.shadowBlur = 6
  label(`${fmt(powerCh(rpm))} ${dynoLabels.powerUnit.fr} · ${fmt(torqueNm(rpm))} Nm`, gx, gy - r0 - 7, 'center', 9.5)
  label(`${fmt(Math.round(rpm / 10) * 10)} ${dynoLabels.rpm.fr}`, gx, gy + 11, 'center', 8.5)
})

/** Which timeline entry plays which effect. */
export const EFFECTS: Record<string, Effect> = {
  'epitech-msc': construction,
  ulit: cloudHop,
  'epitech-pre-msc': piscine,
  crypto: chart,
  blockchain: mining,
  motorsport: lmp2,
  'ecole-performance': dyno,
  rima: commando,
}
