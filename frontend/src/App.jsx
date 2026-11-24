import { useEffect, useRef, useState } from 'react'
import MatrixRain3D from './components/MatrixRain3D'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Workspace from './components/Workspace'
import Dossier from './components/Dossier'
import HistoryPage from './components/HistoryPage'
import TeamPage from './components/TeamPage'
import AboutPage from './components/AboutPage'
import { analyze, analyzeImage } from './api'

const KEY = 'veritas_history_v2'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

export default function App() {
  const [view, setView] = useState('home')
  const [tab, setTab] = useState('text')
  const [history, setHistory] = useState(load)
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(null)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(history)) } catch { /* storage unavailable */ } }, [history])
  useEffect(() => {
    if (view === 'home' && pending.current) {
      const id = pending.current; pending.current = null
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [view, current])

  const toWorkspace = (t) => {
    if (t) setTab(t)
    setError(''); pending.current = 'workspace'
    if (view !== 'home') setView('home')
    else setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  async function scan(kind, input) {
    setLoading(true); setError('')
    try {
      const data = kind === 'photo' ? await analyzeImage(input) : await analyze({ youtube: 'youtube', web: 'url', text: 'text' }[kind], input)
      const text = data.source_text || ''
      const entry = { id: Date.now(), ts: Date.now(), kind, label: kind === 'photo' ? input.name : kind === 'text' ? input.slice(0, 120) : input, text, result: data.result, verdict: data.result.verdict }
      setHistory((h) => [entry, ...h].slice(0, 50))
      setCurrent(entry); pending.current = 'dossier'
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const open = (h) => { setCurrent(h); pending.current = 'dossier'; setView('home') }
  const del = (ids) => { setHistory((h) => h.filter((x) => !ids.includes(x.id))); if (current && ids.includes(current.id)) setCurrent(null) }
  const clear = () => { setHistory([]); setCurrent(null) }

  return (
    <div className="relative min-h-screen">
      <MatrixRain3D />
      <div className="relative z-10">
      <Nav view={view} setView={setView} onScan={() => toWorkspace()} />
      {view === 'home' && (
        <>
          <Hero onTab={toWorkspace} />
          <Workspace tab={tab} setTab={setTab} onScan={scan} loading={loading} error={error} />
          {current && <Dossier key={current.id} entry={current} onReset={() => toWorkspace()} />}
        </>
      )}
      {view === 'history' && <HistoryPage history={history} onOpen={open} onDelete={del} onClear={clear} />}
      {view === 'team' && <TeamPage />}
      {view === 'about' && <AboutPage />}
      </div>
    </div>
  )
}