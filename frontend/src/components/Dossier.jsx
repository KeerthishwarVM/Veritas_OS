import { motion } from 'framer-motion'
import GlitchText from './GlitchText'
import { Panel, GlitchButton } from './ui'
import { COLORS, CLAIM_COLORS } from '../theme'

function Gauge({ value, color }) {
  const r = 52, c = 2 * Math.PI * r
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#1E1E1E" strokeWidth="12" />
        <motion.circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="12" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl" style={{ color }}>{value}%</span>
        <span className="font-mono text-[10px] text-bone/60">CONFIDENCE</span>
      </div>
    </div>
  )
}

function Bars({ label, value, color }) {
  const segs = 20, lit = Math.round((value / 100) * segs)
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs"><span className="text-bone/70">{label}</span><span style={{ color }}>{value}%</span></div>
      <div className="flex gap-0.5">
        {Array.from({ length: segs }, (_, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.03 }} className="h-5 flex-1" style={{ background: i < lit ? color : '#1E1E1E' }} />
        ))}
      </div>
    </div>
  )
}

function highlight(text, flags, color) {
  const pats = flags.map((f) => f.trim()).filter(Boolean).map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!pats.length) return text
  return text.split(new RegExp(`(${pats.join('|')})`, 'gi')).map((p, i) => (i % 2 ? <mark key={i} className="px-1 font-bold" style={{ background: color, color: '#0A0A0A' }}>{p}</mark> : p))
}

export default function Dossier({ entry, onReset }) {
  const { result: r, text, id, ts, label } = entry
  const color = COLORS[r.verdict]
  const flagColor = r.verdict === 'REAL' ? '#FF5500' : color
  return (
    <section id="dossier" className="scroll-mt-16 space-y-6 px-4 pb-16 md:px-8">
      <Panel tag="/02 // VERDICT_DOSSIER" className="overflow-hidden">
        <motion.h2
          initial={{ scale: 2, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 520, damping: 16, mass: 1.1 }}
          className="inline-block border-4 px-4 py-2 font-display text-4xl sm:text-6xl lg:text-8xl" style={{ color, borderColor: color }}
        >
          [ VERDICT: {r.verdict} ]
        </motion.h2>
        <GlitchText as="p" className="mt-6 max-w-3xl font-mono text-sm leading-relaxed text-bone/90">{r.summary}</GlitchText>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-bone/50">
          <span>SCAN_ID: {String(id).slice(-6)}</span><span>TS: {new Date(ts).toISOString()}</span><span>FLAGS: {r.red_flags.length}</span><span>CLAIMS: {r.key_claims.length}</span>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel tag="/CONFIDENCE_GAUGE"><Gauge value={r.confidence_score} color={color} /></Panel>
        <Panel tag="/BIAS_TONE" className="space-y-4">
          <Bars label="SENSATIONALISM" value={r.sensationalism_score} color={COLORS.FAKE} />
          <Bars label="MANIPULATION" value={r.manipulation_score} color={COLORS.MISLEADING} />
        </Panel>
        <Panel tag="/FACT_VS_OPINION" className="space-y-4">
          <Bars label="VERIFIABLE FACT" value={r.fact_opinion_split} color={COLORS.REAL} />
          <Bars label="OPINION / SPECULATION" value={100 - r.fact_opinion_split} color="#8A8A8A" />
        </Panel>
      </div>

      <Panel tag="/CAUTION_HIGHLIGHTER">
        {text ? (
          <p className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-bone/80">{highlight(text, r.red_flags, flagColor)}</p>
        ) : (
          <p className="mb-3 font-mono text-xs text-bone/60">SOURCE: {label} — no extractable text, red flags listed below.</p>
        )}
        {!text && r.red_flags.length > 0 && (
          <div className="flex flex-wrap gap-2">{r.red_flags.map((f, i) => <mark key={i} className="px-2 py-1 font-mono text-xs font-bold" style={{ background: flagColor, color: '#0A0A0A' }}>{f}</mark>)}</div>
        )}
        {!r.red_flags.length && <p className="mt-3 font-mono text-xs text-bone/50">NO RED FLAGS DETECTED.</p>}
      </Panel>

      <Panel tag="/CLAIMS_MATRIX">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {r.key_claims.map((c, i) => {
            const cc = CLAIM_COLORS[c.status]
            return (
              <div key={i} className="border border-grid p-4 shadow-[4px_4px_0_#1E1E1E] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none" style={{ borderTop: `4px solid ${cc}` }}>
                <div className="mb-2 font-mono text-[11px] font-bold" style={{ color: cc }}>[{c.status}]</div>
                <GlitchText as="p" className="mb-3 font-display text-xl leading-tight">{c.claim}</GlitchText>
                <p className="font-mono text-xs leading-relaxed text-bone/60">{c.evidence}</p>
              </div>
            )
          })}
        </div>
      </Panel>
      <GlitchButton onClick={onReset} className="w-full md:w-auto"><GlitchText>NEW SCAN</GlitchText></GlitchButton>
    </section>
  )
}
