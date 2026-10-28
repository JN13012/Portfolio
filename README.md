# Portfolio — Jérémie Nagi

Portfolio personnel : IA, cybersécurité et développement. React 19, Vite, TypeScript/JSX,
Tailwind CSS 4 et three.js. Une seule application assemble l’introduction, les sections et Sentry.

## Développement

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:5173/ et laisser le terminal actif. Le port est fixe : Vite signale
une erreur si 5173 est déjà occupé. Le serveur écoute sur `0.0.0.0` pour l’accès depuis Windows/WSL.

## Organisation

| Dossier | Rôle |
| --- | --- |
| `src/app/` | Assemblage de la page et transition d’entrée |
| `src/sections/` | Sections du portfolio, console CTF dans `Lab/ctf/` |
| `src/components/` | Sentry, navigation, décor et composants partagés |
| `src/content/` | Textes FR/EN, projets, certifications et sources |
| `src/assets/`, `src/styles/` | Visuels utilisés et styles globaux |
| `server/` | Worker Cloudflare et envoi du formulaire de contact |
| `dev/` | Maquettes, prototypes et visuels propres au développement |
| `scripts/` | Génération cartographique, images, write-ups et relecture |
| `docs/` | Documentation actuelle ; anciens concepts dans `archive/` |

Voir [l’architecture détaillée](docs/architecture.md), [l’introduction](docs/intro.md),
[Sentry](src/components/Sentry/README.md) et la [feuille de route IA](docs/roadmap-ia.md).

## Vérifications

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run review` régénère la [relecture du contenu français](docs/relecture-contenu.md).
`npm run sync:writeups` met à jour les métadonnées depuis le dépôt public Cyber-Write-ups.

Les aperçus `/mockups.html?view=reseau`, `/intro-preview.html` et le réglage `/?placer`
servent au développement. `npm run preview` sert le build de production, sans ces pages de maquettes.

## Contact et hébergement

`npm run dev` sert l’interface ; il ne démarre pas l’API Cloudflare `/api/contact`.
Le Worker configuré dans `wrangler.toml` sert `dist/` et traite le contact via Resend.
Il utilise le secret `RESEND_API_KEY`, les variables optionnelles `CONTACT_FROM_EMAIL` /
`CONTACT_TO_EMAIL`, ainsi que le binding `CONTACT_LIMITER`.

`npm run deploy:worker` construit puis publie le site ; l’exécuter seulement pour un déploiement demandé.
L’adaptateur `functions/api/contact.js` est conservé pour Cloudflare Pages et partage le même traitement.

Sentry affiche actuellement des réponses préparées et leurs sources. Les questions libres par IA
et la voix sont prévues, pas connectées.
