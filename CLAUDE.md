# Portfolio — Jérémie Nagi

Personal portfolio used to apply to AI, cybersecurity (pentest + blue team) and developer roles at large French groups. Being rebuilt — **read `docs/plan-v1.md` before any work**: it holds every decision taken so far, the target architecture and the step list.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build into `dist/`
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (new code is `.ts`/`.tsx`; legacy `.jsx` is allowed via `allowJs`)
- `npm test` — Vitest: content checks (FR+EN everywhere, honest claims, links, write-ups) and project filters
- `npm run sync:writeups` — rebuild `src/content/writeups.json` from the public Cyber-Write-ups repo (metadata only)
- `node scripts/optimize-images.mjs` — convert heavy images in `src/assets` to WebP and rewrite imports (run after adding images)
- `npm run review` — regenerate `docs/relecture-contenu.md` (all FR copy, for proofreading) after any content change
- `npm run deploy:worker` — build + deploy to Cloudflare Workers (only when asked)

## Stack

React 19 · Vite · Tailwind 4 · Cloudflare Worker (`worker.js` serves `dist/` + `/api/contact` via Resend in `src/contactEmail.js`). TypeScript (new code). three.js for the globe intro and the hero neural network (lazy-loaded, desktop only).

## Layout (branch v2/ancien-ameliore: the legacy site, reorganised)

Decision 2026-10-19: keep the legacy portfolio and improve it (the v1 rebuild is saved on `v1/03-site`). `index.html` → `src/main.jsx` → `src/App.jsx`: globe intro (`src/sections/Gate/GlobeGate.tsx`, three.js, desktop only, once per session) → `NavBar` → hero (`src/sections/Hero/Hero.tsx`, 3D neural network = navigation, `core/Neural3D.tsx`, 2D fallback `core/NeuralCore.tsx`) → Profil (`src/sections/Profile`) → Expertise (`src/sections/Expertise`, domain list on the left, a grid of tool logos on the right, from `expertise.ts`; `?metier=ia|cyber|dev` in the URL reorders the domains (`orderedDomains`) and filters the projects — one targeted link per CV; logos: legacy PNGs, then Simple Icons, else a monogram) → Projets (`components/ProjectSection`, fed by `src/content/projects`) → Lab (`src/sections/Lab`, CTF + write-ups) → Parcours (`src/sections/Parcours`, one timeline from `timeline.ts`) → Certifications → Contact. Background: `components/NetworkBackground2.tsx` (slate, no moving packets — provisional). Green is reserved for the foreground. Dev-only mockups: `/mockups.html`. FR only for now.

## Rules

- **Content lives in `src/content/`, never hard-coded in components.** Every user-facing string exists in FR and EN.
- **Honesty first.** Every number or claim must be traceable to a repo or a certificate. Each project shows its real status (development / delivered = « Terminé »); real company use is an `inProduction` mention (only the Salesforce editor, at ULIT). Each project has a complexity note 1–5 in `src/content/complexity.ts` (1 + difficulty 0–2 + real constraints 0–1 + polish 0–1, validated by Jérémie); sorts: Sélection / Plus récents / Plus complexes; two groups under titled lines, « Projets perso & pro » (personal, work, plus `showcase: 'perso-pro'` such as Argos) then « Projets de formation » (Epitech, IBM, hackathon), each showing 6 cards then « Voir les N autres ». Never present roadmap items as done, never show BlockTrader returns, never call it live or AI-driven.
- **Design:** legacy look kept (green `--color-cyber`, panels, logos), lighter: Inter for all text, Fira Code (Kali's terminal font) only in the CTF console; filters are small pills or menus on one line. Green = foreground only; background stays neutral slate. Attacks/threats in red.
- **Animated visuals stay in the intro and the hero** (globe, neural network). They must pause off-screen, freeze under `prefers-reduced-motion`, and keep Lighthouse mobile ≥ 90. Concept: `docs/concept-v1.md`.
- **Keep the CTF working:** level 1 expects one `FLAG{Welcome_User}` comment in `index.html`; CTF data is in `src/components/ProfileConsole/ctfData.js`; progress is kept in this browser (`localStorage` key `ctf-progress`) and shown on the intro screen (`src/sections/Lab/CtfIntro.tsx`).
- Write-ups are sourced from https://github.com/JN13012/Cyber-Write-ups — link to them, don't copy their text.
- Performance and accessibility targets are in the plan (§5): check them before calling a step done.
- One step of the plan = one branch. Don't commit or deploy unless asked.
- UI copy is in French by default; code, identifiers and comments in English.
