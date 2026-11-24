import { useEffect, useState } from 'react'
import GlitchText from './GlitchText'
import HeroBust3D from './HeroBust3D'
import { GlitchButton } from './ui'
import { TABS } from '../theme'

function Crystal() {
  const [n, setN] = useState(0)
  useEffect(() => { const id = setInterval(() => setN((v) => (v + 7) % 100), 400); return () => clearInterval(id) }, [])
  return (
    <div className="hidden border border-grid p-4 md:block">
      <div className="mb-3 font-mono text-[10px] text-orange">/CORE_NODE</div>
      <div className="mx-auto my-6 h-20 w-20" style={{ perspective: 400 }}>
        <div className="cube relative h-full w-full">
          {['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].map((r) => (
            <div key={r} style={{ transform: `${r} translateZ(40px)` }} />
          ))}
        </div>
      </div>
      <div className="font-mono text-[10px] leading-5 text-bone/70">
        <div>VERIFIED_SOURCES: {1280 + n}</div><div>LATENCY: {20 + (n % 9)}ms</div><div>STATUS: <span className="text-lime">ONLINE</span></div>
      </div>
    </div>
  )
}

export default function Hero({ onTab }) {
  return (
    <section className="border-b border-grid bg-[#0A0A0A]/75 backdrop-blur-[2px]">
      <div className="overflow-hidden px-4 pt-6 md:px-8">
        <h1 className="select-none text-center font-display text-[17vw] leading-[0.9] tracking-wide text-bone md:text-[11vw]">
          <GlitchText>VERIFY TRUTH</GlitchText>
        </h1>
      </div>
      <div className="grid grid-cols-1 border-t border-grid md:grid-cols-[1fr_1.4fr_1fr]">
        <div className="order-2 flex flex-col justify-center gap-5 p-6 md:order-1 md:p-8">
          <div className="flex gap-3 font-mono text-[10px]">
            <span className="flex items-center gap-1"><i className="h-2 w-2 bg-orange" />AI VERIFICATION</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 bg-orange" />REAL-TIME AUDIT</span>
          </div>
          <GlitchText as="p" className="font-mono text-sm leading-relaxed text-bone/90">
            Detecting misinformation in real time. Check YouTube videos, news links, raw text and screenshots with AI precision.
          </GlitchText>
          <GlitchButton onClick={() => onTab('text')} className="self-start text-xs"><GlitchText>START SCANNING</GlitchText></GlitchButton>
        </div>
        <div className="order-1 border-grid md:order-2 md:border-x"><HeroBust3D /></div>
        <div className="order-3 p-6 md:p-8"><Crystal /></div>
      </div>
      <div className="grid grid-cols-2 border-t border-grid md:grid-cols-4">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => onTab(id)} className="group flex flex-col items-center justify-center gap-2 border-b border-r border-grid p-5 font-mono text-[11px] font-bold hover:bg-[#121212] md:flex-row md:gap-3 md:border-b-0 md:p-7 md:text-sm">
            <Icon className="h-7 w-7 shrink-0 text-orange group-hover:text-lime" />
            <GlitchText>{label}</GlitchText>
          </button>
        ))}
      </div>
    </section>
  )
}