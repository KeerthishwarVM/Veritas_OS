import { useEffect, useRef } from 'react'

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFXYZ<>=+*:'.split('')
const rnd = (a, b) => a + Math.random() * (b - a)
const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

// Perspective-style rain: far / mid / near layers differ in size, brightness, speed and parallax.
const LAYERS = [{ z: 0.2, gap: 22 }, { z: 0.55, gap: 34 }, { z: 0.9, gap: 52 }]

export default function MatrixRain3D() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ptr = { x: 0, y: 0, sx: 0, sy: 0 }
    let w = 0, h = 0, mobile = false, streams = [], raf = 0, last = 0, resizeTimer = 0

    const makeStream = (z, x) => {
      const len = Math.round(rnd(8, 18) * (mobile ? 0.7 : 1))
      return {
        z, x, len, fs: 9 + z * 15, speed: (50 + z * 220) * rnd(0.8, 1.2),
        y: rnd(-h, h), chars: Array.from({ length: len }, glyph), hot: Array.from({ length: len }, () => Math.random() < 0.012),
      }
    }

    const build = () => {
      mobile = window.innerWidth < 768
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      streams = []
      LAYERS.forEach(({ z, gap }) => {
        const step = gap * (mobile ? 1.8 : 1)
        for (let x = -step; x < w + step; x += step) streams.push(makeStream(z, x + rnd(-step / 3, step / 3)))
      })
      streams.sort((a, b) => a.z - b.z) // far first, near drawn on top
    }

    const draw = (dt) => {
      ctx.clearRect(0, 0, w, h)
      ptr.sx += (ptr.x - ptr.sx) * 0.05; ptr.sy += (ptr.y - ptr.sy) * 0.05
      for (const s of streams) {
        s.y += s.speed * dt
        if (s.y - s.len * s.fs > h) { s.y = -rnd(0, h * 0.3); s.speed = (50 + s.z * 220) * rnd(0.8, 1.2) }
        const ox = -ptr.sx * (10 + s.z * 50), oy = -ptr.sy * (6 + s.z * 28)
        ctx.font = `${s.fs}px monospace`
        const base = 0.25 + s.z * 0.6
        for (let i = 0; i < s.len; i++) {
          const cy = s.y - i * s.fs + oy
          if (cy < -s.fs || cy > h + s.fs) continue
          if (!reduce && Math.random() < 0.02) { s.chars[i] = glyph(); s.hot[i] = Math.random() < 0.012 }
          const fade = 1 - i / s.len
          ctx.globalAlpha = Math.min(1, (i === 0 ? 1 : fade * base))
          if (s.hot[i]) ctx.fillStyle = '#FF5500'
          else ctx.fillStyle = i === 0 ? '#CCFF00' : i < 3 ? '#00FF66' : '#0F8A4B'
          if (i === 0 && !mobile) { ctx.shadowColor = '#CCFF00'; ctx.shadowBlur = 6 + s.z * 10 }
          ctx.fillText(s.chars[i], s.x + ox, cy)
          if (i === 0 && !mobile) ctx.shadowBlur = 0
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016)
      last = t
      draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop) }
    const onMove = (e) => { ptr.x = (e.clientX / w) * 2 - 1; ptr.y = (e.clientY / h) * 2 - 1 }
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { build(); if (reduce) draw(0) }, 150) }
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) start() }

    build()
    if (reduce) draw(0)
    else start()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf); clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <>
      <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full opacity-60" style={{ zIndex: 0 }} />
      <div aria-hidden className="pointer-events-none fixed inset-0" style={{ zIndex: 0, background: 'radial-gradient(ellipse at center, rgba(10,10,10,.8) 0%, rgba(10,10,10,.45) 55%, rgba(10,10,10,0) 100%)' }} />
    </>
  )
}