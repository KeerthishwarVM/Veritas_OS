import { useState } from 'react'
import { Trash2, Youtube, Globe, Terminal, Camera } from 'lucide-react'
import GlitchText from './GlitchText'
import { TiltCard, GlitchButton } from './ui'
import { COLORS } from '../theme'

const ICONS = { youtube: Youtube, web: Globe, text: Terminal, photo: Camera }

export default function HistoryPage({ history, onOpen, onDelete, onClear }) {
  const [sel, setSel] = useState([])
  const [confirm, setConfirm] = useState(false)
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const removeSel = () => { onDelete(sel); setSel([]) }

  return (
    <section className="min-h-[80vh] px-4 py-10 md:px-8">
      <GlitchText as="h1" className="mb-2 font-display text-5xl md:text-7xl">SCAN HISTORY</GlitchText>
      <p className="mb-6 font-mono text-xs text-bone/60">{history.length} SAVED LOCALLY IN THIS BROWSER</p>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <GlitchButton color="#FF2A2A" disabled={!sel.length} onClick={removeSel} className="px-3 py-2 text-xs"><GlitchText>DELETE SELECTED ({sel.length})</GlitchText></GlitchButton>
        {!confirm ? (
          <GlitchButton color="#FF2A2A" disabled={!history.length} onClick={() => setConfirm(true)} className="px-3 py-2 text-xs"><GlitchText>CLEAR ALL HISTORY</GlitchText></GlitchButton>
        ) : (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-crimson">ERASE EVERYTHING?</span>
            <GlitchButton color="#FF2A2A" onClick={() => { onClear(); setSel([]); setConfirm(false) }} className="px-3 py-2 text-xs">YES</GlitchButton>
            <GlitchButton color="#1E1E1E" onClick={() => setConfirm(false)} className="px-3 py-2 text-xs">CANCEL</GlitchButton>
          </div>
        )}
      </div>
      {!history.length ? (
        <GlitchText as="p" className="border border-grid bg-[#0A0A0A]/80 p-8 font-mono text-sm text-bone/60">NO SCANS YET. RUN A SCAN AND IT WILL APPEAR HERE.</GlitchText>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {history.map((h) => {
            const Icon = ICONS[h.kind] || Terminal
            const c = COLORS[h.verdict]
            return (
              <TiltCard key={h.id} onClick={() => onOpen(h)} className="relative cursor-pointer p-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={sel.includes(h.id)} onChange={() => toggle(h.id)} className="h-4 w-4 accent-orange" aria-label="Select scan" />
                    <Icon className="h-5 w-5 text-orange" />
                  </label>
                  <button aria-label="Delete scan" onClick={(e) => { e.stopPropagation(); onDelete([h.id]); setSel((s) => s.filter((x) => x !== h.id)) }} className="border border-grid p-1.5 hover:border-crimson hover:text-crimson"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mb-2 inline-block border-2 px-2 py-1 font-display text-2xl" style={{ color: c, borderColor: c }}>{h.verdict}</div>
                <p className="mb-3 line-clamp-3 break-words font-mono text-xs text-bone/70">{h.label}</p>
                <div className="flex justify-between font-mono text-[11px] text-bone/50"><span>{new Date(h.ts).toLocaleString()}</span><span style={{ color: c }}>{h.result.confidence_score}% CONF</span></div>
              </TiltCard>
            )
          })}
        </div>
      )}
    </section>
  )
}