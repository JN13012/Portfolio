import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/fira-code/wght.css'
import './styles/global.css'
import App from './app/App.jsx'

const root = document.getElementById('root')
const app = <StrictMode><App /></StrictMode>
// The built page arrives with its first screen already rendered (scripts/prerender.mjs): React takes over
// those elements rather than recreating them, so the hero text shown first stays the page's main content.
// When the globe intro opens, the page differs from that render; hidden behind the intro, it is rebuilt.
if (root.firstElementChild && !document.documentElement.hasAttribute('data-intro-pending')) hydrateRoot(root, app)
else createRoot(root).render(app)
