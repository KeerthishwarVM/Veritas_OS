const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function send(path, init) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, init)
  } catch {
    throw new Error(`Backend unreachable. Start the API on ${BASE}`)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Analysis failed.')
  return data
}

export const analyze = (mode, content) =>
  send('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, content }) })

export const analyzeImage = (file) => {
  const form = new FormData()
  form.append('file', file)
  return send('/api/analyze-image', { method: 'POST', body: form })
}
