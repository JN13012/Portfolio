# Portfolio — Jérémie Nagi

Personal portfolio for AI, cybersecurity and developer roles. Read `docs/plan-travail.md` first
(current work order, one step at a time), `docs/architecture.md` for the current file layout
and `docs/roadmap-ia.md` for planned assistant capabilities.
The only application is on `main`; historical V1 plans in `docs/archive/` are references,
not instructions to rebuild the old design or recreate deleted branches.

## Commands

- `npm run dev` — Vite dev server
- `npm run dev:lab` — AI Lab API for local work, next to `npm run dev` (real model calls, needs `LAB_IP_SECRET` in `.dev.vars`)
- `npm run build` — production build into `dist/`
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (new code is `.ts`/`.tsx`; existing `.jsx` is allowed via `allowJs`)
- `npm test` — Vitest: content checks (FR everywhere, honest claims, links, write-ups) and project filters
- `npm run sync:writeups` — rebuild `src/content/writeups.json` from the public Cyber-Write-ups repo (metadata only)
- `node scripts/optimize-images.mjs` — convert heavy images in `src/assets` to WebP and rewrite imports (run after adding images)
- `npm run review` — regenerate `docs/relecture-contenu.md` (all FR copy, for proofreading) after any content change
- `npm run deploy:worker` — build + deploy to Cloudflare Workers (only when asked)

## Stack

React 19 · Vite · Tailwind 4 · Cloudflare Worker (`server/worker.js` serves `dist/` + `/api/contact` via Resend in `server/contactEmail.js`; security headers of static files are in `public/_headers`, since those files are served without running the Worker). TypeScript (new code). three.js for the globe intro and the hero neural network (lazy-loaded, desktop only).

## Current layout

- `index.html` → `src/main.jsx` → `src/app/App.jsx`: one mounted portfolio, wrapped by the globe entry transition.
- `src/sections/`: Gate, Hero, Profile, Expertise, Projects, Lab (including `ctf/`), Parcours, Certifications, Contact.
- `src/components/layout/`: navigation and neutral network background. `src/components/ui/`: shared headings, topic icons, StackLine, ToolLogo/ (logos and registries), and dialogs/ (frame, lightbox, gallery and focus/keyboard handling). Shared UI must not import sections.
- `src/components/Sentry/`: floating assistant and chat, imported directly by App. Shared conversation in `src/lib/assistantStore.ts`; animation timeline in `src/lib/brain.ts`.
- `src/content/`: typed content and provenance. `src/assets/`: assets used by the portfolio. `src/styles/global.css`: Tailwind theme and global styles.
- `server/`: Worker entry, contact handler and its tests; `server/aiLab/`: AI Lab API (private instructions, flags, quotas). `functions/api/contact.js` keeps the Pages adapter, sharing that same handler.
- `dev/mockups/`: visual proposals and network tuner; `dev/assets/`: their exclusive images. `/mockups.html?view=reseau` and `/?placer` stay development tools. `/intro-preview.html` replays the real portfolio's intro.
- `docs/archive/`: previous concepts; `docs/assets/archive/`: unused authored visuals retained as source material.

The hero network (`sections/Hero/core/`) illustrates Sentry's prepared answers; it is not navigation.
Keep its 2D fallback, lazy 3D loading, off-screen pause and reduced-motion support.
In production Sentry plays pre-recorded voice chapters (cloned voice, approved text) and its chat shows
an under-construction message; prepared cards exist only in development. The AI Lab is public: level 1 runs on a real model (`server/aiLab/`, `OPEN_HOSTS`),
the other levels are shown as « À venir ». Sentry's chat has no model and free-form AI is unavailable; never present roadmap functionality as connected. Preserve keyboard focus restoration and session behavior.
The Profile globe replay returns to the Hero; the portfolio must stay mounted through the transition.
Keep Formation (MSc in progress, not a certificate), project and certification modals, and the explicit
buttons leading from the Hero's information panels to the relevant sections.

## Rules

- **Content lives in `src/content/`, never hard-coded in components.** French only (decision 2026-10-30): English is no longer maintained, new text has no `en`, and existing EN text may be stale until the English version is built.
- **Honesty first.** Every number or claim must be traceable to a repo or a certificate. Each project shows its real status (development / delivered = « Terminé »); real company use is an `inProduction` mention (only the Salesforce editor, at ULIT). Each project has a complexity note 1–5 in `src/content/complexity.ts` (1 + difficulty 0–2 + real constraints 0–1 + polish 0–1, validated by Jérémie; never displayed, it only drives the sort); sorts: Plus complexes (default, decision 2026-10-26) / Plus récents; two groups under titled lines, « Projets perso & pro » (personal, work, plus `showcase: 'perso-pro'` for a course project pursued beyond it) then « Projets de formation » (Epitech, IBM, hackathon), each showing 6 cards then « Voir les N autres ». Never present roadmap items as done, never quote BlockTrader returns in text (dashboard screenshots may show them), never call it live; AI steering is its stated goal, always worded as not wired in yet (an AI that can only brake).
- **Design:** legacy look kept (green `--color-cyber`, panels, logos), lighter: Inter for all text, Fira Code (Kali's terminal font) only in the CTF console; filters are small pills or menus on one line. Green = foreground only; background stays neutral slate. Attacks/threats in red.
- **Animated visuals stay in the intro and the hero** (globe, neural network), plus short one-shot effects in Parcours (decision 2026-10-25): an entry's effect plays once in the details panel each time the entry is selected (click or arrows), never loops, one shared visual style; a button in the section turns them on (off by default, remembered in this browser). They must pause off-screen, freeze under `prefers-reduced-motion`, and keep Lighthouse mobile ≥ 90. Historical concept: `docs/archive/concept-v1.md`.
- **Keep the CTF working:** level 1 expects one `FLAG{Welcome_User}` comment in `index.html`; CTF data is in `src/sections/Lab/ctf/ctfData.js`; progress is kept in this browser (`localStorage` key `ctf-progress`) and shown on the intro screen (`src/sections/Lab/CtfIntro.tsx`).
- **Maria Agent** is the only public name of that project: its internal name must never appear in this public repo (content, comments, docs, file names, commit messages), and the project has no code link.
- Write-ups are sourced from https://github.com/JN13012/Cyber-Write-ups — link to them, don't copy their text.
- Performance and accessibility targets are in `docs/archive/plan-v1.md` (§5): check them before calling a step done.
- Two branches only: `main` (production) and `developpement` (all work; preview at https://developpement-www.jeremie-nagi.workers.dev). Any push to `main` deploys production: merge or push it only when Jérémie asks, after he has checked the preview. Don't commit, push or deploy unless asked.
- UI copy is in French; code, identifiers and comments in English.
