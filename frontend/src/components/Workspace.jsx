import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import GlitchText from './GlitchText'
import { Panel, GlitchButton } from './ui'
import { PRESETS, TABS } from '../theme'

const LOGS = ['INIT: opening secure channel...', 'INGEST: normalizing payload...', 'PARSE: tokenizing content...', 'EXTRACT: isolating factual claims...', 'SCAN: measuring sensationalism...', 'SCAN: detecting manipulation patterns...', 'CROSS-REF: weighing claims against evidence...', 'COMPILE: assembling verdict dossier...']

function Terminal() {
  const [n, setN] = useState(1)
  useEffect(() => { const t = setInterval(() => setN((v) => Math.min(v + 1, LOGS.length)), 900); return () => clearInterval(t) }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl border border-lime bg-carbon p-5 font-mono text-xs text-lime">
        <div className="mb-3 text-orange">/PROCESSING // LIVE_TELEMETRY</div>
        {LOGS.slice(0, n).map((l, i) => <div key={i}><span className="text-[#555]">[{String(i).padStart(2, '0')}]</span> {l}</div>)}
        <div className="animate-pulse">&gt; _</div>
      </div>
    </div>
  )
}

const HELP = {
  youtube: ['PASTE A PUBLIC YOUTUBE LINK', 'Supports public YouTube videos & Shorts. For Instagram Reels, screenshot the Reel and use Photo Scan.'],
  web: ['PASTE AN ARTICLE OR WEBSITE LINK', 'We fetch the page, extract the readable text and verify it.'],
  text: ['PASTE RAW TEXT', 'Paste a headline, post, forwarded message or full article. Try a demo preset below.'],
  photo: ['DROP PICS TO REVEAL THE TRUTH', 'Upload a screenshot, meme or forwarded WhatsApp image (PNG, JPG, WEBP, max 8 MB).'],
}

export default function Workspace({ tab, setTab, onScan, loading, error }) {
  const [youtube, setYoutube] = useState('')
  const [web, setWeb] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const pick = (f) => {
    if (!f || !['image/png', 'image/jpeg', 'image/webp'].includes(f.type)) return
    setFile(f); setPreview(URL.createObjectURL(f))
  }
  const value = { youtube, web, text, photo: file }[tab]
  const ready = tab === 'photo' ? !!file : !!String(value || '').trim()
  const input = 'w-full border border-grid bg-carbon p-3 font-mono text-sm outline-none focus:border-orange'

  return (
    <section id="workspace" className="scroll-mt-16 px-4 py-10 md:px-8">
      {loading && <Terminal />}
      <Panel tag="/01 // INPUT_WORKSPACE">
        <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center justify-center gap-2 border px-2 py-3 font-mono text-[11px] font-bold ${tab === id ? 'border-orange bg-orange text-carbon' : 'border-grid hover:bg-[#121212]'}`}>
              <Icon className="h-5 w-5 shrink-0" /><GlitchText>{label}</GlitchText>
            </button>
          ))}
        </div>
        <GlitchText as="h2" className="mb-1 font-display text-3xl md:text-4xl">{HELP[tab][0]}</GlitchText>
        <GlitchText as="p" className="mb-4 font-mono text-xs text-bone/70">{HELP[tab][1]}</GlitchText>

        {tab === 'youtube' && <input className={input} type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/watch?v=... | youtu.be/... | youtube.com/shorts/..." />}
        {tab === 'web' && <input className={input} type="url" value={web} onChange={(e) => setWeb(e.target.value)} placeholder="https://example.com/news/article" />}
        {tab === 'text' && (
          <>
            <textarea className={`${input} resize-y`} rows={9} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text to verify..." />
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.label} onClick={() => setText(p.text)} className="border border-grid px-3 py-2 font-mono text-xs hover:border-orange"><GlitchText>{p.label}</GlitchText></button>
              ))}
            </div>
          </>
        )}
        {tab === 'photo' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}
            onClick={() => inputRef.current?.click()}
            className={`glass flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center ${drag ? '!border-lime' : ''}`}
          >
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => pick(e.target.files[0])} />
            {preview ? (
              <>
                <img src={preview} alt="Selected upload preview" className="max-h-64 max-w-full border border-grid object-contain" />
                <span className="font-mono text-[11px] text-bone/70">{file.name} — tap to replace</span>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-lime" />
                <span className="font-mono text-xs">DRAG & DROP, BROWSE FILES, OR USE CAMERA / GALLERY</span>
              </>
            )}
          </div>
        )}

        {error && <div className="mt-4 border border-crimson p-3 font-mono text-xs text-crimson">ERROR: {error}</div>}
        {ready && (
          <GlitchButton pulse color="#FF5500" disabled={loading} onClick={() => onScan(tab, tab === 'photo' ? file : value.trim())} className="mt-6 w-full py-5 text-2xl md:text-3xl">
            <GlitchText>VERIFY TRUTH</GlitchText>
          </GlitchButton>
        )}
      </Panel>
    </section>
  )
}
