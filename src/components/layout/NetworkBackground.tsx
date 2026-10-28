import { useEffect, useRef } from 'react'
import { afterLoadIdle } from '../../lib/afterLoad'
import { withAlpha } from '../../lib/color'
import { useReducedMotion } from '../../lib/useReducedMotion'

// Neutral slate: the background never uses the foreground green.
const SLATE = '#94a3b8'
const PACKET = '#cbd5e1'
const LABELS = ['FW', 'DB', 'API', 'SIEM', 'LLM', 'RAG', 'IDS', 'DNS', 'VPN', 'K8S', 'WAF', 'LOG']

type NetNode = { x: number; y: number; hub: boolean; label?: string }
type Link = { a: NetNode; b: NetNode; len: number }
type Packet = { link: Link; t: number; speed: number; forward: boolean }

type NetworkBackgroundProps = {
  /** Freeze the background while the opaque globe introduction covers it. */
  suspended?: boolean
  /** 0–1: how many nodes (B « mix » uses a sparser network). */
  density?: number
  /**
   * Travelling packets. Off by default: in the hero, moving dots would be confused
   * with the neural network's requests, so only the cursor glow and parallax move.
   */
  packets?: boolean
}

/**
 * Site background: the legacy network-map idea, redone in a neutral slate tone.
 * Thin links, small nodes, a few hubs with labels, slow packets, links brightening
 * near the cursor and a light parallax. Dimmed behind the content.
 */
export function NetworkBackground({ density = 1, packets: withPackets = false, suspended = false }: NetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 0
    let h = 0
    let dpr = 1
    let nodes: NetNode[] = []
    let links: Link[] = []
    const packets: Packet[] = []
    const base = document.createElement('canvas')
    const pointer = { x: -1e4, y: -1e4, px: 0, py: 0 }

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      for (const c of [canvas, base]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      let seed = 7
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
      // Jittered grid → even spread without clumps.
      const step = 150 / Math.sqrt(density)
      nodes = []
      for (let y = step / 2; y < h + step; y += step)
        for (let x = step / 2; x < w + step; x += step) {
          if (rand() < 0.18) continue
          const hub = rand() < 0.12
          nodes.push({
            x: x + (rand() - 0.5) * step * 0.8,
            y: y + (rand() - 0.5) * step * 0.8,
            hub,
            label: hub ? LABELS[Math.floor(rand() * LABELS.length)] : undefined,
          })
        }
      // Each node links to its 2 nearest neighbours.
      const seen = new Set<string>()
      links = []
      nodes.forEach((a, i) => {
        nodes
          .map((b, j) => ({ b, j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
          .filter((o) => o.j !== i)
          .sort((p, q) => p.d - q.d)
          .slice(0, a.hub ? 4 : 2)
          .forEach(({ b, j, d }) => {
            const key = i < j ? `${i}-${j}` : `${j}-${i}`
            if (seen.has(key) || d > step * 1.9) return
            seen.add(key)
            links.push({ a, b, len: d })
          })
      })
      // Static layer.
      const g = base.getContext('2d')!
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, w, h)
      g.lineWidth = 1
      g.strokeStyle = withAlpha(SLATE, 0.09)
      g.beginPath()
      for (const l of links) {
        g.moveTo(l.a.x, l.a.y)
        g.lineTo(l.b.x, l.b.y)
      }
      g.stroke()
      g.font = '9px "Inter Variable", "Inter", sans-serif'
      g.textAlign = 'center'
      for (const n of nodes) {
        g.fillStyle = withAlpha(SLATE, n.hub ? 0.4 : 0.22)
        g.beginPath()
        g.arc(n.x, n.y, n.hub ? 2.6 : 1.6, 0, Math.PI * 2)
        g.fill()
        if (n.hub) {
          g.strokeStyle = withAlpha(SLATE, 0.22)
          g.beginPath()
          g.arc(n.x, n.y, 7, 0, Math.PI * 2)
          g.stroke()
          g.fillStyle = withAlpha(SLATE, 0.32)
          g.fillText(n.label ?? '', n.x, n.y + 19)
        }
      }
      packets.length = 0
      draw()
    }

    function draw() {
      // Parallax: the whole layer drifts a few pixels with the pointer.
      const ox = pointer.px * 10
      const oy = pointer.py * 8
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.drawImage(base, ox * dpr, oy * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, ox * dpr, oy * dpr)
      // Links near the cursor light up.
      const R = 170
      ctx!.lineWidth = 1
      for (const l of links) {
        const mx = (l.a.x + l.b.x) / 2 + ox
        const my = (l.a.y + l.b.y) / 2 + oy
        const d = Math.hypot(mx - pointer.x, my - pointer.y)
        if (d > R) continue
        ctx!.strokeStyle = withAlpha(SLATE, 0.32 * (1 - d / R))
        ctx!.beginPath()
        ctx!.moveTo(l.a.x, l.a.y)
        ctx!.lineTo(l.b.x, l.b.y)
        ctx!.stroke()
      }
      for (const p of packets) {
        const k = p.forward ? p.t : 1 - p.t
        const x = p.link.a.x + (p.link.b.x - p.link.a.x) * k
        const y = p.link.a.y + (p.link.b.y - p.link.a.y) * k
        const fade = Math.sin(Math.PI * p.t)
        const grd = ctx!.createRadialGradient(x, y, 0, x, y, 7)
        grd.addColorStop(0, withAlpha(PACKET, 0.75 * fade))
        grd.addColorStop(1, withAlpha(PACKET, 0))
        ctx!.fillStyle = grd
        ctx!.fillRect(x - 7, y - 7, 14, 14)
      }
    }

    build()
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 200)
    }
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    const onScroll = () => {
      const k = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
      canvas.style.opacity = String(1 - k * 0.5)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    let raf = 0
    let last = performance.now()
    let started = false
    const syncVisibility = () => {
      if (started && !document.hidden) {
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop) }
      } else {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 1000 / 30 - 2) return
      const dt = Math.min(100, t - last) / 1000
      last = t
      const max = withPackets ? Math.round(links.length * 0.05) : 0
      while (packets.length < max && links.length)
        packets.push({ link: links[Math.floor(Math.random() * links.length)]!, t: 0, speed: 0.25 + Math.random() * 0.35, forward: Math.random() < 0.5 })
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]!
        p.t += (p.speed * dt * 120) / Math.max(60, p.link.len)
        if (p.t >= 1) packets.splice(i, 1)
      }
      const tx = pointer.x > -1e3 ? pointer.x / w - 0.5 : 0
      const ty = pointer.y > -1e3 ? pointer.y / h - 0.5 : 0
      pointer.px += (tx - pointer.px) * 0.05
      pointer.py += (ty - pointer.py) * 0.05
      draw()
    }
    const cancelStart = reduced || suspended
      ? () => {}
      : afterLoadIdle(() => {
          started = true
          syncVisibility()
        })
    document.addEventListener('visibilitychange', syncVisibility)

    return () => {
      cancelStart()
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', syncVisibility)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(resizeTimer)
    }
  }, [reduced, density, withPackets, suspended])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 size-full transition-opacity duration-300" />
}
