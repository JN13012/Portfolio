# Portfolio V1 — Plan de refonte

> Document de référence. Chaque session de travail commence par le lire.
> Il remplace le brainstorming initial : toutes les décisions prises y sont consignées.

---

## 0. Objectif

Un seul site, trois métiers visés, pour postuler **vite** :

- **IA** : développement, conception, orchestration (LLM, RAG, agents)
- **Cyber** : pentest + blue team
- **Dev** : full-stack

Cibles : grands groupes (Thales, Airbus, Naval Group, EDF, TotalEnergies, SNCF, Capgemini, BNP, SG, Crédit Agricole…) et l'offre déclencheuse **CMA CGM — Cyber Innovation Intern, Applied AI & Cybersecurity** (Marseille, GCP / Gemini / Cloud Run).

Le site est lu par deux publics :

1. **RH / talent acquisition** — 30 secondes : qui, quel poste, disponibilité, CV, contact.
2. **Manager technique** — creuse : projets, rigueur, honnêteté sur ce qui est fini ou non.

**V1 = site complet sans agent IA, sans voix, sans rooms.** Assez bon pour postuler partout.

---

## 1. Décisions déjà prises

| Sujet | Décision |
|---|---|
| Concept | « Model Under Attack » : le site est la salle de contrôle d'une IA, vue depuis l'orbite. Version **sobre et premium**, pas « gamer ». Storyboard complet : [`docs/concept-v1.md`](concept-v1.md) (validé le 2026-10-17). |
| Positionnement | **Double compétence IA × cyber** (développeur IA + pentester junior), incarnée par Argos. Le développement est le socle ; la blockchain et le web3 sont un différenciateur secondaire. Hero : « Développeur IA · Pentester junior — Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque. » |
| Palette | Graphite `#0B0D10`, texte blanc cassé, **cyan = IA**, **orange = menace**. Fin du vert « Matrix ». |
| Typo | Serif éditorial pour les titres (Cormorant Garamond, déjà dans `public/fonts`) + mono pour les données. |
| Détails visuels | Barres de caviardage révélées au survol, numéros de dossier, horodatages. Clin d'œil maritime optionnel et discret. |
| Visuels animés | **Noyau astrolabe + iris blindé** en SVG/Canvas 2D (hero) : il sert de navigation (5 nœuds) et réagit aux attaques et aux flags du CTF ; visible aussi sur mobile. **Décor** : la Terre de nuit vue d'orbite (Canvas 2D), qui deviendra le globe du parcours en V1.1. Ouverture « Entrer / Passer », une fois par session. Tout est figé en `prefers-reduced-motion`. Pas de WebGL : three / r3f retirés le 2026-10-17. |
| Lentilles | ~~Onglets `/ia`, `/cyber`, `/dev`~~ abandonnés le 2026-10-17 : **page unique** avec les trois métiers côte à côte, et **filtres** (métier, statut) + **tri** (date, envergure) sur les projets. Le filtre est dans l'URL (`?metier=cyber`) pour les liens de candidature. |
| Projets | 3 niveaux : **Dossiers** (études de cas) → **Autres réalisations** (cartes) → **Archives** (liste repliée). Statut honnête sur chaque projet. |
| Langues du site | FR + EN en V1. |
| Voix (V1.1) | Option **A + B** : clone de la voix de Jérémie **uniquement** sur des textes écrits et validés, pré-générés (intro multilingue FR/EN/ES/AR) ; agent vocal live avec une **voix neutre non clonée**, à la 3e personne. Jamais le clone sur du texte LLM libre. |
| Agent (V2) | RAG sur CV/projets/write-ups, **Gemini payant** (les conditions Gemini interdisent l'offre gratuite pour des utilisateurs dans l'EEE) sur Cloud Run. Défense en profondeur : Turnstile invisible → quota par session → **plafond global sortant** → quota GCP + coupure de facturation. Mode dégradé : FAQ statique + contact. |
| Lab (V3) | Rooms tirées des write-ups (Exegol autorisé par Epitech, flags changés ; THM = scénarios réécrits). Un Dockerfile par room → `docker compose` local + version navigateur (prototype sur *Silence*). Pas de VM hébergées + VPN. Atlas Academy en pause, son moteur sera réutilisé. |
| Write-ups | Source unique : dépôt public [JN13012/Cyber-Write-ups](https://github.com/JN13012/Cyber-Write-ups). Le portfolio affiche des fiches et **renvoie vers GitHub**, il ne recopie pas les textes. |

---

## 2. Décisions à valider avant de coder

| # | Question | Recommandation |
|---|---|---|
| D1 | Migrer en **TypeScript** ? | **Oui**, pour le nouveau code : le modèle de contenu est typé, et c'est un signal pour la lentille Dev. |
| D2 | Pages projet : modale ou **route dédiée** (`/projets/blocktrader`) ? | **Route** : partageable, indexable, aperçu LinkedIn. |
| D3 | Globe 3D en V1 ou V1.1 ? | **V1.1**, avec la voix. Le hero 3D suffit pour la V1. |
| D4 | Nom de domaine ? | Un domaine court (`jeremienagi.fr` / `.dev`), à acheter avant la mise en ligne. |
| D5 | Statistiques de visite ? | Cloudflare Web Analytics (sans cookie → pas de bandeau). |
| D6 | Ligne de candidature `?pour=thales` | En V1 si le temps le permet (texte seul, jamais de logo). |

---

## 3. Architecture technique

**On garde** : React 19, Vite, Tailwind 4, Cloudflare Worker (`worker.js`), formulaire de contact via Resend (`src/contactEmail.js`).

**On ajoute** :

- `react-router` : lentilles, langues, pages projet
- ~~`three` + `@react-three/fiber`~~ : retirés le 2026-10-17, le noyau et le décor sont en SVG + Canvas 2D (voir §1)
- `motion` : révélations au scroll et transitions (léger, désactivé si `prefers-reduced-motion`)
- Worker : injection des balises meta / Open Graph **par route** (`HTMLRewriter`) pour des aperçus LinkedIn corrects par lentille

### Routes

```
/                 vue générale (FR)        /en                 general (EN)
/ia /cyber /dev   lentilles (FR)           /en/ai /en/cyber /en/dev
/projets/:slug    page dossier (FR)        /en/projects/:slug
/mentions-legales                          /en/legal
```

La lentille active suit la navigation (un dossier ouvert depuis `/cyber` garde l'angle cyber).

### Arborescence cible

```
src/
  app/            App, routes, LensProvider, LocaleProvider
  content/        ⟵ toutes les données, aucune dans les composants
    profile.ts    identité, disponibilité, langues, pays
    lenses.ts     titre, accroche, ordre des dossiers, CV par lentille
    projects/     un fichier par projet (dossiers + cartes + archives)
    certifications.ts
    timeline.ts   expériences + formations fusionnées
    skills.ts     regroupées par lentille, sans pourcentage
    writeups.json généré par scripts/sync-writeups
  sections/       Hero, Express, Dossiers, Realisations, Archive, Lab, Parcours, Skills, Certifications, Contact
  pages/          Home, ProjectPage, Legal, NotFound
  components/ui/  primitives de la charte (Button, Tag, StatusBadge, Redacted, CaseNumber…)
  sections/Hero/  Hero, Gate, OrbitalBackdrop, core/ (Astrolabe, CoreHeart)
  i18n/           fr.ts, en.ts, hook useT
  styles/         tokens.css (couleurs, typo, espacements, dark only)
scripts/
  sync-writeups   lit les frontmatter YAML du dépôt Cyber-Write-ups → content/writeups.json
  optimize-images conversion WebP/AVIF + tailles responsives
```

### Modèle d'un projet (indicatif)

```ts
{
  slug: "blocktrader",
  tier: "dossier" | "card" | "archive",
  status: "production" | "test" | "development" | "designed",
  tracks: { ai: 2, cyber: 3, dev: 1 },        // ordre d'apparition par lentille (absent = replié)
  title, period, team: "solo" | "équipe de 4",
  summary: { fr, en },                          // 2-3 lignes, niveau RH
  angles: { ai?: {fr,en}, cyber?: {fr,en}, dev?: {fr,en} },
  sections: [...]                               // problème → architecture → sécurité → résultat (dossiers)
  stack: [...], links: { github?, demo?, writeup? },
  facts: [...],                                 // chiffres vérifiables uniquement
  doNotClaim: [...]                             // garde-fou éditorial (non affiché)
}
```

---

## 4. Contenu V1

### Hero (par lentille)

Nom · titre de la lentille · accroche · **Disponible immédiatement** · Marseille · mobile · boutons **CV** / **Contact** / **Explorer**. Noyau 3D en fond : flux de requêtes, les attaques (orange) arrêtées par une couche de garde-fous.

### Bandeau « En 30 secondes »

5 langues · 6 pays · MSc Epitech cyber · Jr Penetration Tester · IBM AI Developer · ex-militaire · disponible.

### Dossiers (études de cas)

| Dossier | Lentilles | Mettre en avant | Ne pas prétendre |
|---|---|---|---|
| **BlockTrader** | IA, Data, Dev | Pré-enregistrement des stratégies, ~3 350 essais tracés, Sharpe dégonflé, anti-look-ahead, parité VectorBT, 46 tests, CI durcie, serverless (Cloud Scheduler → Actions), règle « l'IA ne peut que réduire l'exposition », design Safe/KMS/coupe-circuit | Aucun rendement. Pas de « live ». Le pilotage par IA est l'objectif, toujours dit « pas encore branché » (mise à jour 2026-10-24). |
| **Argos** | Cyber, IA | Moteur OSINT réel sur l'API INSEE SIRENE, provenance, SQLite, rapports, tests, architecture Capability → Workflow → Harness, cadre légal documenté | Red team / antivirus / pentest LLM = feuille de route. |
| **Pentest — write-ups & audit** | Cyber | Jr Penetration Tester (95 h), 25 write-ups (web, AD, élévation de privilèges, cracking, RE), Audit-1 sur infra réelle autorisée, T-SEC-600 | — |
| **ZeroDay** | Dev, Cyber | Corpus de game design versionné (~140 k mots), banque de termes alignée MITRE ATT&CK, cœur déterministe testé, éditeur d'arbres maison | Statut *En développement*, pas jouable. |
| **Applications LLM** | IA | Regroupe RAG_pdf_Chatbot, Business_AI_Companion_STT, AI_Career_Coach, AI_Assistant_Translator : RAG/FAISS, Whisper + Granite, LangChain, Watsonx | Projets issus du parcours IBM : le dire. Remplacé/complété par l'agent en V2. |

### Autres réalisations (cartes)

Générateur OTP RCS (sécurité dès la conception, hackathon, équipe) · ChatFlow (**équipe de 4**) · Kubernetes « Bernstein » · Bookworm NLP · Salesforce Executor (ULIT) · Base de connaissance Obsidian · CTF du site · Smart Fridge.

### Archives (liste repliée par année)

CyberPong, Unit Converter, Vaultborn, POPEYE, My_Marvin, Blockchain Mining, AI Voice Assistant, LLM Context Wrapper.

### Lab (version légère en V1)

- CTF terminal actuel **déplacé du hero vers le Lab**, restylé à la nouvelle charte (fonctionnement inchangé, y compris le flag niveau 1 dans `index.html`).
- Index des 25 write-ups (filtres par technique) → liens GitHub.
- Mobile : mode guidé à boutons.

### Parcours (timeline unique)

2e RIMa → Renault / G-Drive Racing (WEC, 24 h du Mans 2017) / Wärtsilä → infrastructure blockchain (depuis 2018) → ULIT (Salesforce) → MSc Epitech. Langues : FR, EN, ES, arabe (libanais + littéraire), allemand (bases). Pays : Liban, Qatar, Arabie saoudite, Canada, Pérou, France.

### Compétences

Regroupées par lentille, **sans pourcentage**. Vocabulaire conformité : ISO 27001, EBIOS RM, NIS2, DORA, IEC 62443 (seulement ce qui est réellement étudié ou pratiqué).

### Certifications

En avant : **THM Jr Penetration Tester** (07/10/2026, `THM-VKWDW1TVUB`), **IBM AI Developer Professional**, THM SEC1, THM Cyber Security 101, atelier THM *Supercharging Your Pentesting With AI* (5 CPE). Le reste groupé et replié (IA / Cyber / Dev). Chaque certif → lien de vérification.

### À supprimer

Barres de soft skills et de langues en %, bloc « Informations personnelles », musique de fond, `Cortana.jsx` vide, 29 des 30 commentaires `FLAG{Welcome_User}`, README du template Vite, liens `github.com/ton-username/...`.

---

## 5. Exigences de qualité

- **Performance** : Lighthouse mobile ≥ 90, LCP < 2,5 s, JS initial < 200 Ko gzip. Les assets passent de 68 Mo à quelques Mo (WebP/AVIF, certificats Coursera recompressés).
- **Accessibilité** : Lighthouse ≥ 95, navigation clavier, contrastes AA, `prefers-reduced-motion`, textes alternatifs.
- **Responsive** : 360 px → 2560 px, aucun scroll horizontal.
- **SEO / partage** : meta + Open Graph par lentille et par dossier, `sitemap.xml`, `robots.txt`, images OG.
- **Honnêteté** : chaque affirmation chiffrée vient d'un dépôt ou d'un certificat. Statut visible sur chaque projet.
- **Sécurité** : en-têtes (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`) servis par le Worker ; formulaire de contact avec validation et limitation.

---

## 6. Étapes de réalisation V1

Une étape = une session Claude Code = une branche git.

| # | Étape | Livrable | Validation par Jérémie |
|---|---|---|---|
| 1 | **Charte & maquette du hero** | `styles/tokens.css`, primitives UI, hero statique + prototype 3D, `docs/design.md` | Captures d'écran desktop + mobile |
| 2 | **Modèle de contenu & rédaction** | `src/content/*` typé, données migrées depuis les composants actuels, nouveaux projets/certifs, textes FR | Relecture des textes |
| 3 | **Squelette de l'app** | Routes, lentilles, i18n, navbar, layout, Worker (meta + en-têtes de sécurité) | Navigation entre lentilles |
| 4 | **Sections — partie 1** | Hero, bandeau 30 s, Dossiers, pages dossier | Captures + relecture |
| 5 | **Sections — partie 2** | Réalisations, Archives, Parcours, Compétences, Certifications, Lab léger, Contact | Captures + relecture |
| 6 | **Traduction EN** | `/en/*` complet | Relecture |
| 7 | **Finitions** | Performance, accessibilité, OG, 404, mentions légales, nettoyage assets | Rapport Lighthouse |
| 8 | **Mise en ligne** | Déploiement de prévisualisation → bascule en production, domaine | Test sur téléphone |

### Ensuite

- **V1.1** : intro vocale clonée (FR/EN/ES/AR) + globe 3D du parcours + « Vraie voix ou clone ? »
- **V2** : agent RAG (Gemini / Cloud Run) + journal des attaques + « Red-team mon agent » + couche vocale neutre
- **V3** : Lab — rooms Docker + prototype navigateur sur *Silence*

---

## 7. Ce que Jérémie doit fournir

- [x] Dates exactes ULIT (début / fin) et intitulé : développeur full-stack (Salesforce), 01/2026 – 06/2026
- [ ] Section certifications de LinkedIn (copier-coller ou export PDF) si autre chose que le dossier `Certifications`
- [ ] Captures d'écran : BlockTrader (dashboard), Argos (CLI + frontend), ZeroDay (sandbox + éditeur), Kubernetes (architecture)
- [ ] Choix du domaine (D4)
- [ ] Photo de profil récente (si changement souhaité)
- [ ] CV : un par lentille (IA / Cyber / Dev) — peut être fait dans une session dédiée

### Hygiène des dépôts (hors portfolio, avant de lier publiquement)

- [ ] **BlockTrader** : retirer l'ID de projet GCP et les détails RPC du README, ajouter un avertissement risque financier, décider du sort de la branche `archive/chatgpt-era`, README anglais, puis rendre public
- [ ] **Kubernetes** : rendre public
- [ ] **Argos** : versionner `frontend/` et `reporting.py`
- [ ] Vérifier que chaque lien GitHub du portfolio pointe vers un dépôt public
