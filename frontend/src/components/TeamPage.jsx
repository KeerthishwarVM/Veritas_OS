import GlitchText from './GlitchText'
import { TiltCard } from './ui'
import { TEAM } from '../theme'

export default function TeamPage() {
  return (
    <section className="min-h-[80vh] px-4 py-10 md:px-8">
      <GlitchText as="h1" className="mb-2 font-display text-5xl md:text-7xl">THE BUILDERS</GlitchText>
      <GlitchText as="p" className="mb-8 font-mono text-sm text-orange">TEAM // Ctrl + C + Ctrl + V</GlitchText>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {TEAM.map((m, i) => (
          <TiltCard key={m.name} max={14} className="relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-0 scanlines" />
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] text-bone/50">
              <span>ID-{String(i + 1).padStart(3, '0')}</span><span className="text-lime">● ACTIVE</span>
            </div>
            <div className="mb-4 flex h-24 w-24 items-center justify-center border border-orange font-display text-5xl text-orange" style={{ transform: 'translateZ(40px)' }}>
              {m.name[0]}
            </div>
            <GlitchText as="h2" className="font-display text-3xl">{m.name}</GlitchText>
            <GlitchText as="div" className="mb-3 mt-1 font-mono text-xs font-bold text-orange">{m.role}</GlitchText>
            <GlitchText as="p" className="font-mono text-xs leading-relaxed text-bone/70">{m.bio}</GlitchText>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}
