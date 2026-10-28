# Charte graphique — « Salle de contrôle »

> Archive historique : ce document décrit des propositions antérieures, dont certaines ont été abandonnées.
> Pour le code et les choix actuels, consulter [l’architecture du projet](../architecture.md).

> Référence de la charte V1 (étape 1 du plan, piste B retenue le 2026-10-15).
> Source de vérité des valeurs : `src/styles/tokens.css`. Ce document explique **quoi utiliser et pourquoi**.
> Aperçu vivant : `npm run dev` → <http://localhost:5173/design.html> (page dev uniquement, absente du build).

---

## 1. Principes

1. **Le SOC d'une IA, version sobre et premium.** Une salle de contrôle calme, pas un jeu vidéo : grille fine, repères d'angle, données en mono, titres éditoriaux.
2. **Deux couleurs porteuses de sens, pas plus.** Cyan = IA (et interface). Orange = menace. Tout le reste est graphite et encre.
3. **Lisible en 30 secondes.** Nom, poste, disponibilité, CV et contact sont visibles au premier écran, sans animation requise.
4. **L'emphase change, la charte reste.** Les lentilles `/ia`, `/cyber`, `/dev` ne changent que l'accent et l'ordre, jamais la mise en page.
5. **Honnêteté visible.** Statut sur chaque projet, chiffres traçables, aucun effet qui laisse croire à du « live » qui n'existe pas.

---

## 2. Couleurs

Thème sombre uniquement. Utiliser les **noms sémantiques** dans les composants ; les valeurs brutes ne servent qu'à définir la palette.

| Rôle | Token (utilitaire Tailwind) | Valeur | Contraste sur `canvas` |
|---|---|---|---|
| Fond de page | `canvas` (`bg-canvas`) | `#0b0d10` | — |
| Panneau | `surface` | `#10141a` | — |
| Carte surélevée | `raised` | `#161c24` | — |
| Texte principal | `ink` (`text-ink`) | `#e7ecef` | 16,35:1 AAA |
| Texte secondaire | `ink-muted` | `#93a0ab` | 7,28:1 AAA (6,41:1 sur `raised`) |
| Décor seulement | `ink-faint` | `#5b6670` | 3,32:1 — **jamais pour du texte utile** |
| IA / interface | `ai` | `#3fd8f2` | 11,41:1 AAA |
| Texte sur cyan | `on-ai` | `#061015` | 11,27:1 sur `ai` |
| Menace | `threat` | `#ff6a2b` | 6,81:1 AA (6,00:1 sur `raised`) |
| Filets | `line` / `line-strong` | cyan-gris 14 % / 28 % | — |
| Grille de fond | `grid` | cyan-gris 4,5 % | — |
| Accent de lentille | `accent` | variable (voir §6) | — |

Règles :
- **Cyan** : actions principales, focus clavier, éléments IA, flux de requêtes. Le bouton principal est cyan sur toutes les lentilles.
- **Orange** : uniquement ce qui évoque une menace, une attaque ou un risque (attaques bloquées, tag Cyber, chiffres de vulnérabilité). Jamais pour un bouton d'action ni pour un statut de projet.
- **Pas de vert** (fin du vert « Matrix »), pas de rouge d'alerte en plus de l'orange, pas de dégradés multicolores.
- Les opacités passent par les modificateurs Tailwind (`border-ai/40`, `bg-surface/80`).

---

## 3. Typographie

| Usage | Police | Token | Taille |
|---|---|---|---|
| Nom (hero) | Cormorant Garamond, semi-bold | `font-display text-display` | 56 → 124 px, fluide |
| Titres de section | Cormorant Garamond | `text-h1` / `text-h2` / `text-h3` | 40→72 / 32→48 / 24→30 px |
| Ligne de titre du hero | Inter, medium | `text-role` | 18 → 22 px |
| Chapeau | Inter | `text-lead` | 17 → 19 px |
| Texte courant | Inter | `text-body` | 16 px, interligne 1,6 |
| Données, horodatages, tags | JetBrains Mono | `font-mono text-data` | 13 px |
| Labels de section | JetBrains Mono, capitales | `font-mono text-label uppercase` | 11,5 px, approche 0,12 em |

- **Cormorant seulement à 24 px et plus.** Sa petite hauteur d'x le rend peu lisible en dessous.
- L'italique Cormorant met en valeur un mot dans un titre (`<em className="text-ai">`), avec parcimonie.
- Toutes les polices sont **auto-hébergées** (`@fontsource-variable/*`, woff2 variables découpés par `unicode-range`). Aucun appel à Google Fonts : meilleur pour la performance et pour le RGPD.
- Chiffres dans les données : mono. Chiffres mis en avant dans une fiche (ex. « ~3 350 ») : Cormorant.

---

## 4. Espacements, mise en page, formes

| Token | Valeur | Usage |
|---|---|---|
| `px-gutter` | 5 % de la largeur (20 px minimum) | Marges latérales : le contenu occupe environ 90 % de l'écran |
| `py-section` | 64 → 128 px | Espacement vertical entre sections |
| `--spacing-stack` | 24 → 36 px | Respiration entre blocs d'une section |
| `max-w-page` | 2400 px | Plafond pour les très grands écrans |
| `max-w-measure` | 640 px | Longueur de ligne confortable |

L'échelle Tailwind de 4 px (`gap-3`, `p-6`…) reste disponible pour le détail.

- **Rayons** : `rounded-xs` 2 px, `rounded-sm` 4 px (boutons, tags, panneaux), `rounded-md` 6 px, `rounded-pill` (badges de statut). Pas de grands arrondis.
- **Ombres** : surtout des filets. `shadow-focus` (anneau cyan), `shadow-raised` (cartes), `shadow-halo-ai` / `shadow-halo-threat` (pastilles).
- **Décor** : `.bg-grid` (grille de 48 px) sur le fond de page, `.corner-marks` (repères d'angle cyan) sur les panneaux importants. Ne pas les cumuler sur des éléments imbriqués.

---

## 5. Mouvement

- Courbes : `ease-out` (`cubic-bezier(.22,1,.36,1)`) pour les entrées, `ease-in-out` pour les boucles.
- Durées : `--duration-fast` 120 ms, `--duration-base` 220 ms, `--duration-slow` 480 ms.
- Animations disponibles : `animate-pulse-dot` (pastille « Disponible »), `animate-reveal` (apparition au scroll, étape 4).
- **`prefers-reduced-motion`** : les durées tombent à 0, les animations CSS sont neutralisées dans `base.css`, le noyau et le décor sont figés, et l'ouverture est sautée.

---

## 6. Accent par métier

Les onglets de lentille sont abandonnés (voir `docs/archive/concept-v1.md`). L'attribut `data-lens` reste disponible pour colorer un bloc selon son métier, par exemple les trois colonnes ou un filtre actif : `ia` → cyan, `cyber` → orange, `dev` → encre. On utilise `text-accent` / `border-accent` dans ces blocs, et `text-ai` / `text-threat` pour ce qui a un sens fixe.

## 7. Primitives (`src/components/ui`)

| Composant | Usage | À faire / à éviter |
|---|---|---|
| `Button` | `variant` = `primary` (cyan, une seule par zone), `secondary` (contour), `ghost` (lien discret). Rendu en `<a>` si `href`, sinon `<button>`. `trailing` pour un glyphe (↓ →). | Un seul primaire par écran. Pas de bouton orange. |
| `Tag` | `tone` = `ia` / `cyber` / `dev` pour les métiers, neutre pour les technologies. | Pas plus de 6 tags par carte. |
| `StatusBadge` | `status` = `production` / `test` / `development` / `designed`. Le statut se lit par la forme (plein, demi, anneau, pointillé) **et** le libellé. | Obligatoire sur chaque projet. Jamais « live » si ce n'est pas vrai. |
| `Redacted` | Barre de caviardage hachurée, levée au survol, au focus clavier ou au tap. Le texte reste dans le DOM. | Décor uniquement : ne jamais cacher une information dont un recruteur a besoin. Rien de confidentiel dedans (le texte est lisible dans le code source). |
| `CaseNumber` | `CASE-0001 / TLP:CLEAR / date`. `TLP:CLEAR` est exact : tout le site est public. | Dates réelles uniquement (mise à jour, date d'un fait). |
| `SectionHeader` | Numéro de dossier + titre serif + chapeau. Un par section, avec `id` pour `aria-labelledby`. | Numérotation continue dans la page. |

Le contenu ne vit jamais dans les composants : libellés dans `src/content/ui.ts` (déplacés vers `src/i18n` à l'étape 3), textes du hero dans `src/content/profile.ts` et `src/content/lenses.ts`, toujours en `{ fr, en }`.

---

## 8. Noyau et décor (hero)

Fichiers : `src/sections/Hero/` (prototype de l'étape « concept », voir `docs/archive/concept-v1.md` §2-3).

- **Noyau** (`core/Astrolabe.tsx`) : anneau de navigation à 5 nœuds (liens accessibles au clavier), anneau gradué et anneau « GRD » qui tournent, orbites inclinées, coque de garde-fous en 12 segments, iris blindé à 8 lames, cœur de particules (`core/CoreHeart.tsx`, Canvas 2D).
  - Chaque anneau tournant est une couche SVG à part, tournée par le compositeur (pas de repeint). Seul l'iris est redessiné à chaque image.
  - Réactions via `src/lib/coreBus.ts` : `attack` (le segment touché s'allume en orange, l'iris se ferme, onde de choc, le cœur clignote), `flag` (l'anneau GRD se déverrouille en cyan, compteur « FLAG n »).
- **Décor** (`OrbitalBackdrop.tsx`, Canvas 2D) : étoiles, limbe éclairé, lumières des villes qui dérivent, arcs de données ; un satellite toutes les 18 à 32 s ; une attaque (météore orange) toutes les 14 à 24 s, qui vise le noyau et déclenche `attack` à l'impact. Le ciel et la Terre sont pré-rendus, les villes redessinées 2 à 3 fois par seconde.
- **Ouverture** (`Gate.tsx`) : l'astrolabe se dessine, compteur lié au vrai chargement (polices + `load`, 1,6 s minimum), « Entrer » ouvre l'iris, « Passer » ou Échap ferment tout de suite. Une fois par session, jamais en `prefers-reduced-motion`. Rendue dans un portail : le reste de la page est `inert` pendant l'ouverture.
- `prefers-reduced-motion` : rotations figées, une seule image du décor, pas de météores ni d'ouverture.

## 9. Accessibilité

- Contrastes AA minimum pour tout texte (voir §2). `ink-faint` est réservé au décor (séparateurs `/` et `·`, marqués `aria-hidden`).
- Focus visible partout : anneau cyan (`shadow-focus` sur les boutons, `outline` cyan ailleurs).
- Le conteneur du noyau porte `role="img"` et un texte alternatif (canvas et SVG sont `aria-hidden`) ; la légende visuelle est `aria-hidden`.
- Le statut d'un projet ne repose jamais sur la couleur seule.
- Les cibles tactiles des CTA font au moins 48 px de haut.

---

## 10. Mesures (page `/design.html`, build de production, gzip)

**Prototype noyau + décor (2026-10-17)** : JS total 73 Ko (plus de chunk 3D) · Lighthouse mobile Perf 90 · A11y 100 · LCP 2,4 s · TBT 250 ms · CLS 0,002 · Lighthouse desktop Perf 100 · A11y 100 · axe : 0 violation (desktop, mobile, ouverture).

**Première maquette (2026-10-15), pour mémoire :**

| Mesure | Résultat | Cible §5 |
|---|---|---|
| JS initial (React + hero + planche) | 68,6 Ko | < 200 Ko |
| Chunk 3D (three + r3f), différé | 246 Ko | hors budget, chargé après `load` sur desktop uniquement |
| Lighthouse mobile | Perf 95 · A11y 100 · Bonnes pratiques 96 · LCP 2,4 s · CLS 0,002 | ≥ 90 / ≥ 95 / LCP < 2,5 s |
| Lighthouse desktop (WebGL logiciel SwiftShader) | Perf 83 · A11y 100 · LCP 0,8 s · TBT 390 ms | à remesurer sur GPU réel (étape 7) |
| axe-core (WCAG 2.2 AA + bonnes pratiques) | 0 violation (3 lentilles, desktop + mobile) | 0 |

SEO = 50 sur cette page : elle est volontairement `noindex` et sans description. Le SEO se traite à l'étape 7.

---

## 11. Fichiers

```
src/styles/fonts.css      polices auto-hébergées
src/styles/tokens.css     tokens (@theme Tailwind 4) + lentilles + reduced-motion
src/styles/base.css       styles de base, .bg-grid, .corner-marks, .redacted
src/components/ui/        primitives
src/content/              profile.ts, lenses.ts, ui.ts, types.ts (ébauche du modèle de l'étape 2)
src/sections/Hero/        Hero, Gate, OrbitalBackdrop, core/ (Astrolabe, CoreHeart, geometry)
src/lib/                  coreBus (événements du noyau), useReducedMotion, color, cx
design.html, src/design/  page d'aperçu dev uniquement
```

Une feuille d'entrée importe, dans l'ordre : `tailwindcss`, `fonts.css`, `tokens.css`, `base.css` (voir `src/design/design.css`).
