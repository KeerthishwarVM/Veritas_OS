import { useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_\\/[]{}=+*^?#01'
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function GlitchText({ children, as: Tag = 'span', className = '', ...rest }) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const [out, setOut] = useState(text)
  const [on, setOn] = useState(false)
  const timer = useRef(null)

  useEffect(() => { setOut(text) }, [text])
  useEffect(() => () => clearInterval(timer.current), [])

  const run = () => {
    if (reduced() || !text) return
    clearInterval(timer.current)
    let i = 0
    const step = Math.max(1, Math.ceil(text.length / 12))
    setOn(false); requestAnimationFrame(() => setOn(true))
    timer.current = setInterval(() => {
      i += step
      setOut(text.split('').map((c, k) => (c === ' ' || c === '\n' || k < i ? c : CHARS[(Math.random() * CHARS.length) | 0])).join(''))
      if (i >= text.length) {
        clearInterval(timer.current)
        setOut(text)
        setTimeout(() => setOn(false), 200)
      }
    }, 35)
  }

  return (
    <Tag {...rest} onMouseEnter={run} onTouchStart={run} className={`${Tag === 'span' ? 'inline-block' : ''} ${on ? 'glitching' : ''} ${className}`}>
      {out}
    </Tag>
  )
}
