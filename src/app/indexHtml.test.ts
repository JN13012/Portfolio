import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('index.html', () => {
  it('has its inline script allowed by hash in the CSP', () => {
    // The script that hides the prerendered page before the globe intro: the CSP has no 'unsafe-inline'.
    const scripts = [...read('index.html').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]!)
    expect(scripts).toHaveLength(1)
    const hash = createHash('sha256').update(scripts[0]!).digest('base64')
    expect(read('public/_headers')).toContain(`'sha256-${hash}'`)
  })

  it('opens the intro on the same conditions as the app', () => {
    // Keep in step with shouldOpenGate (App.jsx): wide screen, motion allowed, no Save-Data, no certificate link.
    const script = read('index.html')
    for (const condition of ['(prefers-reduced-motion: reduce)', '(min-width: 1024px)', 'saveData', 'certificat', 'gate-seen']) {
      expect(script).toContain(condition)
      expect(read('src/app/App.jsx')).toContain(condition)
    }
  })
})
