import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'
import GlitchText from './GlitchText'

export function Panel({ tag, children, className = '' }) {
  const corners = ['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2']
  return (
    <section className={`relative border border-grid bg-[#0A0A0A]/80 p-4 backdrop-blur-[2px] md:p-6 ${className}`}>
      {corners.map((c) => <Plus key={c} aria-hidden className={`absolute ${c} h-4 w-4 bg-carbon text-[#555]`} />)}
      {tag && <GlitchText as="div" className="mb-3 font-mono text-[11px] tracking-widest text-orange">{tag}</GlitchText>}
      {children}
    </section>
  )
}

export function GlitchButton({ children, color = '#FF5500', pulse = false, className = '', ...props }) {
  return (
    <button
      {...props}
      style={{ borderColor: color, boxShadow: `4px 4px 0 ${color}` }}
      className={`glitch-btn border-2 bg-carbon px-5 py-3 font-mono font-bold uppercase tracking-widest transition-transform active:translate-x-1 active:translate-y-1 active:!shadow-none disabled:opacity-40 ${pulse ? 'verify-pulse' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export function TiltCard({ children, className = '', onClick, max = 10 }) {
  const ref = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 200, damping: 18 }), sy = useSpring(ry, { stiffness: 200, damping: 18 })
  const move = (e) => {
    const b = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - b.left) / b.width - 0.5) * max * 2)
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * max * 2)
  }
  const reset = () => { rx.set(0); ry.set(0) }
  return (
    <div style={{ perspective: 900 }}>
      <motion.div ref={ref} onPointerMove={move} onPointerLeave={reset} onClick={onClick} style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }} className={`border border-grid bg-[#0A0A0A]/80 backdrop-blur-[2px] ${className}`}>
        {children}
      </motion.div>
    </div>
  )
}