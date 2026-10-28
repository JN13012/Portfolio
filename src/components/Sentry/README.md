# Sentry

La coque `src/assets/mascot/robot-shell.webp` est une copie exacte du fichier fourni,
avec sa transparence. Le visage SVG utilise un repère normalisé 1280 × 1280 :
les deux yeux sont centrés sur (480, 752) et (790, 752). La lueur d’antenne recouvre
les trois ampoules existantes. Aucun élément métallique n’est redessiné.

```tsx
import { Sentry, SentryChat } from './components/Sentry'

<Sentry size={128} state="searching" />
<SentryChat />
```

`state` accepte `idle`, `reading`, `searching`, `responding` ou `blocked`.
`size` est exprimé en pixels ; sous 64 px, les ramifications sont simplifiées.
Les avatars sont décoratifs (`aria-hidden`) : leur contexte doit nommer Sentry.
Les animations CSS s’arrêtent immédiatement avec `prefers-reduced-motion`.

`src/app/App.jsx` monte directement `SentryChat`. Le Hero et le chat conservent
leur historique partagé via `src/lib/assistantStore.ts`. Les questions prédéfinies montrent des fiches
préparées et leurs sources, annoncées comme telles. Leur lecture anime encore le
réseau existant du Hero. Les questions libres affichent un message d’indisponibilité ;
aucune requête IA ni réponse fabriquée. La présentation vocale reste désactivée.

Les fiches projet et certification citées utilisent les modales partagées de `components/ui/dialogs/`.
Le focus entre dans la fiche, puis revient au bouton source à sa fermeture ; Échap ferme la fiche
sans réduire la conversation avec Sentry. Le clavier du chat n’actionne pas une galerie en arrière-plan.

Le composant accepte les propriétés suivantes :

- `activity?: SentryState` : état contrôlé par les vrais événements de l’assistant.
  `blocked` doit venir d’un événement de sécurité confirmé, jamais du texte saisi.
- `serviceAvailable?: boolean` : afficher « En ligne » seulement après vérification
  réelle de la disponibilité du service. La valeur par défaut est `false`.
  Cette propriété ne connecte aucun backend.
- `introComplete?: boolean` : ne présenter la bulle de bienvenue qu’après la fin
  de l’introduction. `App` fournit la valeur à partir de `gateOpen`.

Aucun écouteur de sécurité, backend, appel vocal ou nouvel événement réseau n’est
installé. La réduction des animations interrompt aussi la lecture progressive des
fiches. Échap replie la fenêtre et replace le focus sur son bouton d’ouverture.

Vérifications du dépôt : `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build`. Le build conserve l’avertissement existant sur la taille des chunks.

Contrôle navigateur effectué sur cette intégration : cinq états à 32/48/128 px,
formats 320 × 568, 390 × 844 et paysage 844 × 390, focus à l’ouverture et retour
avec Échap, voix désactivée, absence de faux statut « En ligne », texte libre
échappé et sans alerte automatique, visibilité de `LAST_UPDATE`, changement à
chaud de la préférence de réduction des animations. Ouverture du CTF et commande
`help` vérifiées avec Sentry disponible en parallèle. Pas de validation complète
des neuf niveaux du CTF, ni de test sur appareil mobile physique.


La commande d’ouverture est une mascotte flottante sur fond transparent : 103,5 px
sur ordinateur et 77,4 px sous 640 px, avec chevron et libellé au survol/focus.
À l’ouverture, le panneau remplace la mascotte au même ancrage en bas à droite
(360 px de largeur et 85 % de la hauteur visible, selon la place disponible).
La mascotte flottante est masquée tant
que la conversation est ouverte ; elle réapparaît à la fermeture avec le focus.
La hauteur s’adapte au paysage et au clavier mobile, en gardant une marge haute
de 80 px pour laisser la navigation fixe accessible.

La bulle de bienvenue a une silhouette asymétrique, une pointe SVG et un contour
vert discret. Elle apparaît 1,2 s après la fin de l’introduction, une fois par
session (`sessionStorage`, clé `sentry-welcome-seen`), puis disparaît après 10 s.
Le survol ou le focus suspend cette disparition ; le délai de 10 s repart à leur sortie. Sa croix et Échap la ferment
et remettent le focus sur Sentry. L’ouverture de la conversation annule également
la bienvenue. Aucun focus n’est déplacé lors de son apparition.

Contrôles complémentaires du lanceur flottant : apparition après la véritable
introduction, pause au survol et au focus, fermeture avec retour du focus,
absence de réapparition après rechargement dans la même session, disparition
automatique après 10 s, et en-tête/saisie non masqués par la navigation aux formats
320 × 568, 390 × 844, 844 × 390, 390 × 320 et 390 × 250.
