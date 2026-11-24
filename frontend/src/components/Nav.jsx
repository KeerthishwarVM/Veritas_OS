import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanEye, Menu, X } from 'lucide-react'
import GlitchText from './GlitchText'
import { GlitchButton } from './ui'

export default function Nav({ view, setView, onScan }) {
  const [open, setOpen] = useState(false)
  const links = ['HISTORY', 'TEAM', 'ABOUT']
  const go = (v) => { setView(v); setOpen(false); window.scrollTo({ top: 0 }) }
  return (
    <header className="sticky top-0 z-40 border-b border-grid bg-carbon/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <button onClick={() => go('home')} className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="border border-orange p-1 text-orange"><ScanEye className="h-5 w-5" /></span>
          <GlitchText>VERITAS_OS</GlitchText>
        </button>
        <nav className="hidden gap-10 font-mono text-xs md:flex">
          {links.map((l) => (
            <button key={l} onClick={() => go(l.toLowerCase())} className={view === l.toLowerCase() ? 'text-orange' : 'text-bone/80 hover:text-bone'}>
              <GlitchText>{l}</GlitchText>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <GlitchButton onClick={() => { setOpen(false); onScan() }} className="px-3 py-2 text-[11px] md:text-xs"><GlitchText>SCAN NOW</GlitchText></GlitchButton>
          <button aria-label="Menu" onClick={() => setOpen((o) => !o)} className="border border-grid p-2 md:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-grid md:hidden">
            {links.map((l) => (
              <button key={l} onClick={() => go(l.toLowerCase())} className="block w-full border-b border-grid px-4 py-4 text-left font-mono text-sm">
                <GlitchText>{l}</GlitchText>
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
