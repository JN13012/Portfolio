// Writes the first screen's HTML into dist/index.html, so the hero shows before the JavaScript runs;
// src/main.jsx then hydrates it: React takes over these elements instead of recreating them.
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (npm run build).
//
// The render happens in Node. Code that reads the browser at render time sees a phone-sized window
// with no stored state: a first visit on a phone, the case where waiting for JavaScript costs most.
// When the desktop's globe intro will open, index.html's inline script hides this page and main.jsx
// renders the live page from scratch instead of hydrating it.
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const storage = () => {
  const values = new Map()
  return { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, String(v)), removeItem: k => values.delete(k) }
}
const noop = () => {}
globalThis.window ??= globalThis
Object.assign(globalThis, {
  matchMedia: query => ({ matches: false, media: query, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
  localStorage: storage(),
  sessionStorage: storage(),
  innerWidth: 390,
  innerHeight: 844,
  addEventListener: noop,
  removeEventListener: noop,
})
globalThis.location ??= new URL('https://www.jeremie-nagi.workers.dev/')
globalThis.navigator ??= { userAgent: 'prerender' }

const { render } = await import('../dist-ssr/entry-server.js')
const html = render()
const dist = path => new URL(`../dist/${path}`, import.meta.url)

const page = readFileSync(dist('index.html'), 'utf8')
if (!page.includes('<div id="root"></div>')) throw new Error('dist/index.html: empty #root not found')
// The CTF's level 1 expects a single flag comment in the page: the render must not add one.
if (/FLAG\{/.test(html)) throw new Error('prerender: the rendered HTML contains a flag')

// Inter is fetched with the page rather than once the stylesheet asks for it, so the prerendered text
// switches from the fallback font to Inter sooner. Latin covers French.
const inter = readdirSync(dist('assets/')).find(name => /^inter-latin-wght-normal-.*\.woff2$/.test(name))
if (!inter) throw new Error('prerender: Inter latin font not found in dist/assets')
writeFileSync(dist('index.html'), page
  .replace('</head>', `  <link rel="preload" href="/assets/${inter}" as="font" type="font/woff2" crossorigin>\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${html}</div>`))

// The CSP has no 'unsafe-inline' for styles, so the browser would ignore the render's style="…"
// attributes, and hydration keeps them as they are. Each one is allowed by its hash, nothing else.
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')
const styles = new Set([...html.matchAll(/ style="([^"]*)"/g)].map(match => decode(match[1])))
const hashes = [...styles].map(style => `'sha256-${createHash('sha256').update(style).digest('base64')}'`)
const headers = readFileSync(dist('_headers'), 'utf8')
if (!headers.includes("style-src 'self';")) throw new Error("dist/_headers: style-src 'self' not found")
writeFileSync(dist('_headers'), headers.replace("style-src 'self';", `style-src 'self' 'unsafe-hashes' ${hashes.join(' ')};`))

console.log(`prerender: ${Math.round(html.length / 1024)} KB of HTML, ${styles.size} inline styles allowed in dist/_headers`)
