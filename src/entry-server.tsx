import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './app/App.jsx'

// Build-time render of the page's first screen (scripts/prerender.mjs): the HTML is in index.html, so
// the hero shows before any JavaScript runs. In the browser, main.jsx then renders the live page over it.
// Sections loaded with lazy() render as their placeholder here; they arrive with their code.
export function render(): string {
  return renderToString(<StrictMode><App /></StrictMode>)
}
