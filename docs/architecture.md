# Architecture actuelle

Réorganisation du 28 octobre 2026. Ce document décrit le code présent ; les anciennes propositions
de refonte sont conservées dans [archive/](archive/). Elles ne constituent plus le plan d’implémentation.

## Une seule application

`index.html` charge `src/main.jsx`, qui monte `src/app/App.jsx`. Celui-ci assemble une seule fois :

1. L’introduction `Gate/GlobeGate.tsx`, chargée à la demande sur ordinateur.
2. La navigation et le décor de `components/layout/`.
3. Hero, Profile, Expertise, Projects, Lab, Parcours, Certifications et Contact.
4. `components/Sentry/SentryChat.tsx`, disponible sur toute la page.

L’introduction anime la fenêtre contenant le vrai portfolio ; elle ne charge pas une seconde version.
Elle est évitée sur mobile, avec réduction des animations ou Save-Data, et mémorisée par session.

```text
src/
  main.jsx
  app/                   App.jsx, App.css
  sections/
    Gate/                globe, scène, géométrie et données générées
    Hero/                présentation, preuves et core/ (réseau pédagogique)
    Profile/             profil, international, langues et centres d’intérêt
    Expertise/
    Projects/            Projects.jsx, ProjectCard.jsx et modales
    Lab/                 Lab.tsx, CyberLab.tsx, CtfIntro.tsx, ctf/, ia/ (aperçu dev)
    Parcours/
    Certifications/
    Contact/
  components/
    Sentry/              mascotte, fenêtre de chat et bienvenue
    layout/              NavBar.jsx, NetworkBackground.tsx
    ui/                  SectionHeader.jsx, TopicIcon.jsx, StackLine.tsx
      ToolLogo/          logos, registres d’images et emblèmes partagés
      dialogs/           cadre, zoom, galerie, clavier et couches de focus
  content/               données et textes bilingues, sources, garde-fous éditoriaux
  lib/                   état partagé, événements, filtres, animation et utilitaires
  assets/                images, logos et CV utilisés par le portfolio
  styles/                global.css : Tailwind, thème et styles transversaux
server/                  worker.js, contactEmail.js et tests du contact
functions/api/           adaptateur Cloudflare Pages vers le même contact
dev/
  mockups/               maquettes et réglage du réseau
    astrolabe/           ancien prototype de noyau
    components/          anciens décors utilisés par les maquettes
    intro/               prototype Argos
  assets/                images utilisées seulement par les maquettes
scripts/                 génération des assets et documents
docs/
  archive/               anciens concepts, design et plan V1
  assets/archive/        anciens visuels conservés, non utilisés par l’application
```

## Responsabilités et dépendances

- **Contenu** : les composants lisent `src/content/`. Les textes existent en FR/EN ; l’interface utilise
  actuellement le français. `skills.ts` et `tracks.ts` restent des données éditoriales utilisées par
  la relecture, les contrôles de contenu et certaines maquettes.
- **Sentry et Hero** : `lib/assistantStore.ts` partage la conversation ; `lib/brain.ts` décrit sa progression ;
  le réseau du Hero illustre les sources des fiches préparées. Son fallback 2D reste utilisé sans WebGL
  ou avec réduction des animations. Le module 3D est chargé à la demande.
  `lib/sentryWelcome.ts` coordonne le premier accueil à partir des repères du globe et des fins
  d’inclinaison ; les injections pédagogiques automatiques attendent la fermeture de la bulle.
- **Interactions entre sections** : `lib/coreBus.ts` relaie notamment l’ouverture des modales de projets
  et certifications, et la relecture du globe. Sentry ne duplique pas ces modales.
- **CTF** : le terminal appartient au Lab. Sa progression conserve la clé `ctf-progress`, ses neuf niveaux
  et le commentaire unique `FLAG{Welcome_User}` dans `index.html`.
- **Contact** : `server/worker.js` sert le build et `/api/contact`. Le traitement partagé importe les mêmes
  limites que le formulaire. `functions/api/contact.js` est un adaptateur Pages, pas un autre portfolio.

Le JSX existant reste accepté par `allowJs` ; les nouveaux composants peuvent être écrits en TypeScript.
Un fichier `.jsx` n’est donc pas à lui seul un ancien composant inutilisé.

## Maquettes et ressources générées

`/mockups.html` charge `dev/mockups/main.jsx`, pas l’application. Le réglage
`/mockups.html?view=reseau` utilise le même moteur que le Hero. `/intro-preview.html` rejoue
l’introduction intégrée. Ces entrées HTML sont absentes du build standard, qui part uniquement d’`index.html`.
Les réglages `/?placer` et `/?transition=…` sont conditionnés par `import.meta.env.DEV`.

Les données cartographiques de `sections/Gate/` sont produites par `scripts/build-*.mjs`.
Conserver ces générateurs et leur entrée `scripts/data/blackmarble-2016.webp`.
`dist/` et `node_modules/` sont des sorties locales ignorées par Git, pas des sources supplémentaires.
`captures/` contient des captures locales de travail non suivies par Git.

## Nettoyage effectué

L’analyse des imports de l’application, des maquettes, des scripts et des tests a confirmé que
`components/Profile.jsx`, `Presentation.jsx` et `SoundToggle.jsx` n’étaient plus utilisés.
Ils ont été retirés avec la musique inutilisée et les logos/icônes de démonstration React/Vite.
Le téléchargement local de polices de l’ancien design a été déplacé de `public/fonts/` vers
`docs/assets/archive/fonts/`, toujours ignoré par Git, pour ne plus être copié dans le build.
Le fichier vide `Cortana.jsx` avait déjà été supprimé par Jérémie. Les 30 commentaires identiques
du flag d’accueil dans `index.html` ont été réduits à un seul ; le défi conserve le même flag.

Les anciens portraits et autres visuels sans référence sont conservés dans `docs/assets/archive/`.
Les visuels propres aux maquettes sont dans `dev/assets/`. Les historiques Git restent disponibles.
Le relais `sections/Assistant/AssistantDock.tsx`, simple réexport de `SentryChat`, a été retiré.
Les imports, citations de chemins, entrées HTML et configuration Worker suivent les nouveaux emplacements.

La passe suivante a retiré dix classes CSS et huit animations sans usage de `styles/global.css`.
Le style du fond de maquette est désormais dans `dev/mockups/components/LegacyNetworkBackground.css`.
Les animations utilisées par Expertise, le Lab et Sentry sont conservées.
Deux déclarations sans appelant (`projectBySlug`, `trackLabels`) ont été supprimées ; 28 exports
superflus ont été rendus privés, en conservant leurs définitions utiles.
Les exports Cloudflare et les types du modèle public restent disponibles.

`lib/brain.ts` contient uniquement le déroulement des réponses et la sélection de leurs sources.
Les cinq fonctions de l’ancien graphe, utilisées uniquement par quatre tests devenus sans objet,
ont été retirées avec ces tests. Le moteur du Hero dans `sections/Hero/core/` reste inchangé,
y compris son fallback 2D. Cette étape a laissé 39 tests, dont les trois tests conservés
du déroulement des réponses de Sentry.

## Composants partagés et modales

`ToolLogo/` porte les images, Simple Icons, emblèmes et monogrammes utilisés par Expertise,
TopicIcon et les maquettes. `StackLine.tsx` mesure les technologies des cartes Projets et Certifications.
Ces composants n’importent aucune section ; il n’existe plus de réexport `Logo` depuis Expertise,
ni d’import de ProjectCard par Certifications.

`dialogs/ModalFrame.tsx` fournit le portail et le panneau communs ; `ImageLightbox.tsx` fournit le zoom.
`useImageGallery.ts` partage la navigation cyclique et la remise à zéro, avec des états sûrs pour zéro ou une image.
Les sections conservent leur sélection, leurs filtres, leur tri, l’ordre des fiches et leurs événements `coreBus`.
Le retour d’un cours à son certificat parent reste dans Certifications, tout comme les données spécifiques
aux projets restent dans Projets. Les hauteurs, légendes et styles de chaque section sont conservés.

Le clavier est limité à la couche active, sans écouteurs `window.keydown` dans les deux sections.
Tab et Maj+Tab restent dans cette couche ; Échap ferme d’abord le zoom, puis la fiche.
Le fond et les couches inférieures sont `inert` pendant l’ouverture, avec restauration de leur état antérieur.
Le focus revient au bouton d’agrandissement ou à l’ouvreur ; un titre de section sert de recours
si la carte n’existe plus. Une navigation interne, notamment vers le Lab, évite ce retour de focus.
Une fermeture de fiche ouverte depuis Sentry laisse le chat et sa conversation disponibles.

La suite comprend 52 tests : les 39 tests conservés, huit tests de galerie et cinq tests de logos.
Les contrôles navigateur couvrent aussi les parcours métier et le clavier sur ordinateur, mobile,
paysage et au seuil de 768 px. Les comparaisons statiques avec la copie sauvegardée couvrent
18 vues, une fois les images et polices chargées ; les canvases et contours de focus y sont exclus.
Ces comparaisons ne remplacent pas les contrôles d’interaction et ne constituent pas un audit Lighthouse.

## Vérifier une évolution

### Aperçu du Lab IA (lot 1, 30 octobre 2026)

En développement, le sélecteur IA du Lab ouvre une interface chargée à la demande : console,
tiroir des cinq niveaux et schéma SVG. `/?lab=ia#lab` l'ouvre directement.
L'entrée « Red-team Sentry » réutilise sa coque avec une activation visuelle finie ; les défenses
sont visibles avant le premier essai. Sentry reste dans un mode entraînement indépendant du chat du site.
Les deux entrées partagent `components/ui/TerminalStartButton.tsx` : même bouton en relief,
avec palettes verte et bleue. L'entrée IA reprend le quadrillage, les scanlines et la typographie
du Cyber, avec suspension du balayage et du bouton lorsqu'ils ne sont pas visibles.
Leur apparition progressive utilise `lib/useTerminalTyping.ts` et `components/ui/TerminalTypedText.tsx`
(170 caractères/seconde, une fois par session). L'entrée « Laboratoire IA » annonce
« CTF en 5 niveaux · contournez les défenses de Sentry » ; la mission est présentée dans la console.
Le bouton « Commencer » déclenche une extinction CRT de 520 ms, dont la fin ouvre la console.
Cette transition et l'apparition progressive sont immédiates avec réduction des mouvements.
Les réponses et résultats sont des fixtures explicites
dans `dev/mockups/aiLabFixtures.ts` ; aucune API ni modèle n'est connecté.
Les descriptions publiques sont dans `content/aiLab.ts`, sans consignes privées.
L'accès IA reste désactivé dans le build de production, qui exclut le code de l'aperçu.

`Lab.tsx` coordonne les écrans et conserve leur état avec les frontières `Activity` de React.
`CyberLab.tsx` porte le CTF et les write-ups existants. Les effets masqués sont suspendus ;
`ctf/commandTimers.ts` met en pause les opérations différées du terminal et les reprend
avec leur délai restant. Le focus du terminal reste limité à sa propre console.
Le schéma IA suspend sa relecture hors écran et en arrière-plan, et reste statique sur mobile
ou avec réduction des mouvements. Voir le [plan et son avancement](plan-lab-ia.md).

### Contrôles du projet

Depuis la racine : `npm run lint`, `npm run typecheck`, `npm test`, puis `npm run build`.
Après une modification du contenu, exécuter `npm run review`.
Contrôler aussi le navigateur : entrée du globe, navigation, modales, console CTF, Sentry,
formats mobile et ordinateur, puis les maquettes concernées par les déplacements.
Le build peut signaler la taille de certains chunks ; un build réussi ne vaut pas audit Lighthouse.
