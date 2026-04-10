"use client"

import { useEffect, useRef } from "react"

type LayerId = "depth" | "base" | "mid" | "wisp"

interface Particle {
  layer: LayerId
  x: number
  baseY: number
  rx: number
  ry: number
  alpha: number
  blur: number
  r: number; g: number; b: number
  vx: number
  // Two vertical oscillation harmonics — creates organic non-repeating bob
  v1Phase: number; v1Amp: number; v1Freq: number
  v2Phase: number; v2Amp: number; v2Freq: number
  // Slow horizontal wobble layered on top of the linear drift
  hPhase: number; hAmp: number; hFreq: number
  // Slow rotation oscillation
  rot0: number; rotPhase: number; rotAmp: number; rotFreq: number
  // Independent scale breathing for rx and ry
  sxPhase: number; sxAmp: number; sxFreq: number
  syPhase: number; syAmp: number; syFreq: number
}

// Cool purple-blue atmospheric palette with lighter near-white tones for body
const PALETTE: [number, number, number][] = [
  [195, 208, 255],
  [208, 215, 255],
  [200, 210, 252],
  [215, 220, 255],
  [210, 205, 255],
  [188, 202, 252],
  [225, 228, 255],  // near-white blue — adds cloud body
  [222, 225, 255],  // soft white periwinkle
]

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const sign = () => (Math.random() < 0.5 ? 1 : -1)
const TAU = Math.PI * 2

function makeParticle(W: number, H: number, layer: LayerId): Particle {
  const d = layer === "depth"
  const b = layer === "base"
  const m = layer === "mid"

  // Geometry: depth = wide flat slabs, base = broad ovals, mid = round puffs, wisp = tall thin tendrils
  const rx = d ? rnd(420, 1050) : b ? rnd(140, 430) : m ? rnd(65, 210) : rnd(12, 50)
  const ry = d ? rnd(22,  58)   : b ? rnd(40, 105)  : m ? rnd(48, 115) : rnd(80, 195)

  // Lower blur since radial gradients already create soft edges — this is the perf win
  const blur  = d ? rnd(28, 50) : b ? rnd(14, 26) : m ? rnd(7, 16)  : rnd(3, 9)
  const alpha = d ? rnd(0.08, 0.18) : b ? rnd(0.14, 0.28) : m ? rnd(0.16, 0.30) : rnd(0.10, 0.20)

  // Y resting positions: depth hugs the floor, wisps float higher
  const baseY = d ? H - rnd(10, 55)
              : b ? H - rnd(25, H * 0.38)
              : m ? H - rnd(55, H * 0.52)
              :     H - rnd(80, H * 0.65)

  const [r, g, bl] = PALETTE[Math.floor(Math.random() * PALETTE.length)]

  // Drift speed: depth slowest, wisp slightly faster — all remain gentle
  const speed = d ? rnd(0.006, 0.022)
              : b ? rnd(0.014, 0.040)
              : m ? rnd(0.022, 0.062)
              :     rnd(0.032, 0.085)

  return {
    layer, x: rnd(0, W), baseY, rx, ry, alpha, blur,
    r, g, b: bl,
    vx: sign() * speed,

    // Primary slow bob
    v1Phase: rnd(0, TAU),
    v1Amp:   d ? rnd(2, 5) : b ? rnd(4, 10) : m ? rnd(6, 14) : rnd(8, 19),
    v1Freq:  rnd(0.00022, 0.00068),

    // Secondary faster micro-bob layered on top — creates non-repeating path
    v2Phase: rnd(0, TAU),
    v2Amp:   d ? rnd(1, 3) : rnd(2, 7),
    v2Freq:  rnd(0.00055, 0.00135),

    // Slow horizontal sway
    hPhase: rnd(0, TAU),
    hAmp:   d ? rnd(3, 9) : b ? rnd(5, 13) : m ? rnd(6, 16) : rnd(9, 22),
    hFreq:  rnd(0.00007, 0.00022),

    // Rotation that breathes back and forth
    rot0:     rnd(-0.22, 0.22),
    rotPhase: rnd(0, TAU),
    rotAmp:   d ? rnd(0.012, 0.035) : rnd(0.028, 0.095),
    rotFreq:  rnd(0.00013, 0.00048),

    // Independent scale pulsing on x and y creates volumetric breathing feel
    sxPhase: rnd(0, TAU), sxAmp: d ? rnd(0.010, 0.028) : rnd(0.018, 0.055), sxFreq: rnd(0.00018, 0.00055),
    syPhase: rnd(0, TAU), syAmp: d ? rnd(0.012, 0.032) : rnd(0.022, 0.065), syFreq: rnd(0.00015, 0.00048),
  }
}

export function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    let LW = 0, LH = 0

    const resize = () => {
      // Cap at 2× to protect mobile GPU memory
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      LW = canvas.offsetWidth
      LH = canvas.offsetHeight
      canvas.width  = LW * dpr
      canvas.height = LH * dpr
      ctx.scale(dpr, dpr)
    }

    const populate = () => {
      particles.length = 0
      // Reduce count on mobile for smooth 60fps
      const s = LW < 768 ? 0.6 : 1

      const cfg: [LayerId, number][] = [
        ["depth", Math.round(6  * s)],
        ["base",  Math.round(11 * s)],
        ["mid",   Math.round(13 * s)],
        ["wisp",  Math.round(8  * s)],
      ]
      // Push layers in back-to-front order so iteration order = draw order
      for (const [layer, n] of cfg)
        for (let i = 0; i < n; i++) particles.push(makeParticle(LW, LH, layer))
    }

    const onResize = () => { resize(); populate() }
    resize(); populate()
    window.addEventListener("resize", onResize)

    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now

      ctx.clearRect(0, 0, LW, LH)

      // Very faint atmospheric ground haze underneath everything
      const haze = ctx.createLinearGradient(0, LH * 0.45, 0, LH)
      haze.addColorStop(0,    "rgba(162, 178, 255, 0)")
      haze.addColorStop(0.55, "rgba(182, 196, 255, 0.033)")
      haze.addColorStop(1,    "rgba(198, 212, 255, 0.088)")
      ctx.fillStyle = haze
      ctx.fillRect(0, LH * 0.45, LW, LH * 0.55)

      for (const p of particles) {
        // --- Animated position (two vertical harmonics + horizontal wobble) ---
        const cy = p.baseY
          + Math.sin(now * p.v1Freq + p.v1Phase) * p.v1Amp
          + Math.sin(now * p.v2Freq + p.v2Phase) * p.v2Amp

        const cx = p.x
          + Math.sin(now * p.hFreq + p.hPhase) * p.hAmp

        // Slowly oscillating rotation
        const rot = p.rot0 + Math.sin(now * p.rotFreq + p.rotPhase) * p.rotAmp

        // Breathing scale — rx and ry pulse independently for organic volume
        const rx = p.rx * (1 + Math.sin(now * p.sxFreq + p.sxPhase) * p.sxAmp)
        const ry = p.ry * (1 + Math.sin(now * p.syFreq + p.syPhase) * p.syAmp)

        // --- Draw ---
        ctx.save()
        ctx.filter      = `blur(${p.blur}px)`
        ctx.globalAlpha = p.alpha
        ctx.translate(cx, cy)
        ctx.rotate(rot)

        // Radial gradient: opaque center fading to transparent edge.
        // This is what makes it feel volumetric rather than a flat blurred blob.
        const maxR = Math.max(rx, ry)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR)
        grad.addColorStop(0,    `rgba(${p.r},${p.g},${p.b}, 1)`)
        grad.addColorStop(0.35, `rgba(${p.r},${p.g},${p.b}, 0.92)`)
        grad.addColorStop(0.62, `rgba(${p.r},${p.g},${p.b}, 0.55)`)
        grad.addColorStop(0.88, `rgba(${p.r},${p.g},${p.b}, 0.12)`)
        grad.addColorStop(1,    `rgba(${p.r},${p.g},${p.b}, 0)`)

        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, 0, TAU)
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()

        // Advance linear drift
        p.x += p.vx * dt * 0.1

        // Wrap horizontally with enough margin to never pop into view
        const margin = Math.max(rx, ry) + p.blur + 20
        if      (p.x >  LW + margin) p.x = -margin
        else if (p.x < -margin)      p.x =  LW + margin
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "460px",
        pointerEvents: "none",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
        maskImage:        "linear-gradient(to bottom, transparent 0%, black 30%)",
      }}
    />
  )
}
