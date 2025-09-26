import React, { useEffect, useRef } from 'react'
import './ScrambledText.css'

export interface ScrambledTextProps {
  scrambleChars?: string
  className?: string
  style?: React.CSSProperties
  radius?: number
  children: React.ReactNode
}

function randomChar(chars: string) {
  return chars.charAt(Math.floor(Math.random() * chars.length))
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  scrambleChars = '.:',
  className = '',
  style = {},
  radius = 100,
  children
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const p = el.querySelector('p') as HTMLParagraphElement | null
    if (!p) return

    // Wrap each character in a span.char and store original in data-content
    const text = String(children)
    p.innerHTML = ''
  const spans: HTMLElement[] = []
  // store centers for faster distance checks
  let centers: { x: number; y: number }[] = []

    for (const ch of text) {
      const span = document.createElement('span')
      span.className = 'char'
      span.setAttribute('data-content', ch)
      // preserve whitespace
      if (ch === ' ') {
        // use non-breaking space so the span keeps visible width
        span.innerText = '\u00A0'
      } else if (ch === '\n') {
        span.innerText = '\n'
      } else {
        // initial scrambled character(s) — show one random char
        span.innerText = randomChar(scrambleChars)
      }
      p.appendChild(span)
      spans.push(span)
    }

    const computeCenters = () => {
      centers = spans.map(s => {
        const r = s.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      })
    }

    // compute centers once (and on resize)
    computeCenters()
    const onResize = () => computeCenters()
    window.addEventListener('resize', onResize)

    const revealAt = (mx: number, my: number) => {
      const r2 = radius * radius
      for (let i = 0; i < spans.length; i++) {
        const s = spans[i]
  const ch = s.getAttribute('data-content') || ''
  if (ch === ' ' || ch === '\n') continue
  const c = centers[i]
        const dx = mx - c.x
        const dy = my - c.y
        const d2 = dx * dx + dy * dy
        if (d2 <= r2) {
          // show non-breaking space for regular spaces so spacing is preserved
          s.innerText = ch === ' ' ? '\u00A0' : ch
        } else {
          s.innerText = randomChar(scrambleChars)
        }
      }
    }

    // Full reveal and full scramble helpers
    const revealAll = () => spans.forEach(s => {
      const ch = s.getAttribute('data-content') || ''
      s.innerText = ch === ' ' ? '\u00A0' : ch
    })
    const scrambleAll = () => spans.forEach(s => {
      const ch = s.getAttribute('data-content') || ''
      if (ch === ' ' || ch === '\n') return
      s.innerText = randomChar(scrambleChars)
    })

    // pointermove handler with rAF to throttle
    let rafId = 0
    const onPointerMove = (ev: PointerEvent) => {
      const mx = ev.clientX
      const my = ev.clientY
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => revealAt(mx, my))
    }

    const onLeave = () => scrambleAll()

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onLeave)

    // Ensure it's scrambled initially
    scrambleAll()

    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [children, scrambleChars])

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{children}</p>
    </div>
  )
}

export default ScrambledText
