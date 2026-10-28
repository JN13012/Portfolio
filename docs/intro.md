# Introduction du portfolio

L’introduction et le portfolio partagent une seule application sur `main`.
`src/app/App.jsx` garde le vrai portfolio monté pendant la transition du globe vers le Hero ;
`src/app/App.css` gère sa fenêtre animée. Il n’existe plus de copie de travail séparée à lancer.
Voir [l’architecture](architecture.md) pour l’organisation complète.

Le portrait affiché est `src/assets/portrait-holographique-bleu.webp` ; son original est conservé
sous `docs/assets/portrait-holographique-bleu-source.png`.

## Aperçu

Depuis la racine du dépôt : `npm ci`, puis `npm run dev`.
Ouvrir `/intro-preview.html` sur le serveur local pour rejouer l’introduction à chaque rechargement.
Cette entrée de développement ouvre le vrai portfolio après le plongeon ; elle est absente du build de production.
Le comportement existant reste conservé : introduction sur ordinateur (≥ 1024 px), une fois par session,
ignorée sur mobile, avec Save-Data ou une préférence système pour réduire les animations.

## Direction visuelle

Fond graphite, globe en points issus des données cartographiques existantes, lumières nocturnes,
atmosphère discrète et accent vert conservé. Un seul pays est annoté à la fois, avec son drapeau.
Sur ordinateur, le globe et son bouton partagent un axe horizontal à 55 % de la largeur ; le centre du globe est à 50 % de la hauteur. Sur les écrans de 800 px ou moins, l’axe horizontal est à 50 %. Les positions viennent des variables CSS `--gate-globe-x` et `--gate-globe-y`.
L’en-tête affiche la signature et « IA · Cybersécurité » ; le bouton « Passer l’introduction » se place sous son filet, à droite.
Son diamètre est plafonné à 45 % de la largeur sur les fenêtres étroites et hautes pour laisser le texte lisible.
Le surtitre avec son filet vert est retiré ; le titre est réduit, le paragraphe et les chiffres sont agrandis.
Description : « Des pays, des langues et des expériences qui ont façonné ma façon de voir le monde. » (FR et EN dans `intro.ts`).
Le bouton Entrer est centré horizontalement sous le globe, sur un axe partagé avec le cadrage de la caméra.
La frise, la sélection de pays et les commandes de relecture ont été retirées pour alléger l’écran.
Les annotations affichent le compteur des sept étapes (`01 / 07` à `07 / 07`), puis le drapeau et le pays, reliés au repère par un petit trait. La France porte « Point de départ » au début ; aucun sous-texte n’est affiché à la dernière étape.
Le bouton Entrer fonctionne dès l’ouverture, sans attendre le parcours.
Le trajet complet dure environ six secondes : liaisons régionales rapides, grandes traversées plus progressives.
Une traînée lumineuse suit le mouvement et s’efface dans les 620 ms suivant l’arrivée.
Les liaisons précédentes ne restent pas sur le globe ; les contours des pays visités conservent la mémoire du parcours.

## Géographie confirmée

Marseille → Tripoli (Liban) → Riyadh → Doha → Montréal → Ayacucho → Marseille.
Les villes placent précisément les repères ; les pays restent le niveau de lecture à l’écran.
Les arcs suivent des grands cercles relevés au-dessus de la sphère, y compris sur les traversées longues.
Le retour en France est une étape du parcours, pas un septième pays.

## Transition

Environ 3 s : l’interface s’efface et la caméra vole vers Marseille depuis sa position actuelle.
Le globe garde exactement son orientation au clic. La caméra rejoint la direction de Marseille
en restant au-dessus de la surface, tout en réduisant progressivement sa distance et le décentrage de l’objectif.
À l’approche, une croûte fermée de 66 zones éclate : pays, groupes de petits pays, subdivisions des grands
territoires et blocs océaniques. Les fractures suivent approximativement les frontières et les côtes ;
France, Espagne, Portugal, Italie et Allemagne se séparent notamment en morceaux indépendants.
Chaque pièce possède une face extérieure courbe, une face intérieure et des parois rocheuses d’environ 0,11 unité,
avec de légères variations d’épaisseur et de relief intérieur (environ 7 % du rayon, épaisseur accentuée pour la lecture).
Les grands blocs sont davantage subdivisés, sans réduire uniformément les pays proches de Marseille.
Les deux grandes plaques atlantiques visibles en haut à gauche sont chacune divisées en deux surfaces proches de 60/40,
avec des fractures irrégulières et des mouvements indépendants. Ce découpage reste limité à ces deux plaques.
Les fractures artificielles suivent un champ irrégulier continu sur la sphère, à deux échelles, pour éviter les longs arcs rectilignes,
les vagues répétitives et les raccords à la limite des longitudes. Les deux côtés partagent les mêmes sommets pour rester emboîtables.
Les tranches ont des strates ondulantes et des arêtes discrètement irrégulières. Les côtes viennent de world-atlas,
échantillonnées sur une sphère puis adoucies ; il s’agit d’un découpage visuel, pas d’un modèle de plaques tectoniques.
Les points de la carte et les frontières partagent exactement la transformation de leur morceau : aucune dispersion indépendante.
La caméra commence à se rapprocher dès le clic : sa distance diminue d’environ 15 % dans les 600 premières millisecondes,
avant le début des fractures à 800 ms. Elle continue à avancer plus doucement pendant la séparation, puis accélère vers le portfolio.
Une courbe continue relie ces trois phases, sans arrêt ni repositionnement de la caméra.
Les fractures s’ouvrent progressivement sur environ 1,8 s, avec des directions et rotations indépendantes et des départs
légèrement décalés. À partir de 1,1 s, une petite fenêtre apparaît au centre, derrière les fragments : elle contient
le vrai Hero final, sa navigation, ses preuves et son réseau, avec le même DOM et les mêmes composants que la page finale.
Sa taille suit la perspective de la distance réelle de la caméra : environ 27 % de l’écran à 1,6 s, 51 % à 2,4 s,
puis exactement 100 % à 3 s. Son cadre s’efface à l’approche. Le fond reste opaque à l’extérieur de cette fenêtre.
La page est préparée hors écran pendant le parcours ; son réseau reprend dès le début du plongeon, avant l’apparition de la fenêtre. Son fond cartographique reste figé pendant l’introduction, puis reprend à sa fermeture.
À la fermeture, le conteneur retrouve le flux normal et devient interactif, sans remonter ni remplacer le Hero.
Les paramètres sont préparés une seule fois ; aucune découpe ou simulation physique n’est exécutée à chaque image.
Le rapprochement accélère après la séparation pour garder
les continents lisibles. L’arrière de la coque s’efface en premier ; les vrais espaces entre les volumes révèlent le portfolio.
Le repère de Marseille s’estompe sans grossissement artificiel. Le masque circulaire de l’ancienne version est retiré.
Le globe lisse reste utilisé avant le clic ; la croûte épaisse n’est visible que pendant la transition.
Son fichier compressé est chargé en arrière-plan ; le globe et le bouton n’attendent pas ce chargement.
Le rendu occupe l’écran dès le départ : aucun changement de taille du cadre ni repositionnement préalable.
L’introduction est opaque dès sa première image ; le fondu initial qui laissait apparaître le Hero a été retiré.
Échap et Passer restent disponibles. Le clavier reste dans le dialogue ; le focus revient au site à la fermeture.
Un échec de chargement propose une sphère de secours ; une perte du contexte graphique ouvre directement le site.
La géométrie est générée hors ligne : 136 260 triangles (135 968 dans la version à 64 zones, 143 256 dans celle à 48 zones).
Le fichier compressé mesure 1 310 019 octets, soit 4 990 octets de plus que les 64 zones, et reste sous les 1 325 489 octets des 48 zones.
Les transformations et la visibilité sont regroupées dans trois tableaux de paramètres pour maîtriser le budget des shaders.
La croûte utilise un seul objet de rendu ;
le quadrillage est regroupé et les contours sont réunis par pays. Les données de classement cartographique sont relâchées après association.
Les éléments totalement invisibles ne sont pas soumis au rendu : pic observé de 27 appels graphiques, contre 35 auparavant.
Les vecteurs de caméra, les positions d’annotation et les états de parcours/traînée/fenêtre sont réutilisés pendant l’animation.
Les traînées invisibles ne mettent plus à jour leurs buffers de dessin ni leurs paramètres graphiques ; la position de leur tête n’est calculée que lorsqu’elle est visible. La coque cesse d’être rendue une fois entièrement transparente. Les annotations ne sont ni projetées ni déplacées lorsqu’elles sont masquées sur petit écran ou pendant le plongeon.
La compilation du shader de croûte est préparée au repos via `compileAsync`, avec annulation du travail planifié à la fermeture.
Une requête annulée ne poursuit pas le décodage de la croûte. Le nettoyage est idempotent et détache aussi les groupes de la scène.
Le rendu s’arrête lorsque l’onglet est masqué et une fois le parcours immobile ; un clic sur Entrer le réveille pour la transition. Le réseau 3D du Hero annule aussi sa boucle hors écran, au lieu de conserver un rappel vide à chaque image. Le réseau et le fond suspendent leur boucle dans un onglet masqué, puis reprennent sans intégrer le temps passé en arrière-plan.
À la fermeture, la boucle est annulée, les événements et l’observation de taille sont retirés, les géométries, matériaux et textures
propres à l’introduction sont libérés, puis son contexte graphique est fermé et son canvas retiré. Les sprites possèdent leur propre
géométrie afin de ne pas toucher aux buffers partagés des autres scènes du portfolio.
La croûte n’est chargée qu’après validation des données de base et création du moteur graphique : un échec initial ne laisse pas de géométrie décodée sans propriétaire. Le démontage du réseau du Hero libère également ses géométries, matériaux, texture, temporisations et contexte graphique.

## Fichiers principaux

- `src/content/intro.ts` : itinéraire et textes FR/EN.
- `src/app/App.jsx` et `src/app/App.css` : conteneur du vrai portfolio, inertie et fenêtre synchronisée avec le plongeon.
- `src/sections/Gate/GlobeGate.tsx` : interface, entrée et accessibilité.
- `src/sections/Gate/globeGate.css` : styles limités à l’introduction.
- `src/sections/Gate/globeScene.ts` : rendu et animation.
- `src/sections/Gate/globeCrust.ts` : chargement et transformations rigides partagées entre volumes et cartographie.
- `src/sections/Gate/globeCrust.bin` et `globeCrust.json` : géométrie compressée et descriptif des zones.
- `scripts/build-globe-crust.mjs` : génération reproductible depuis world-atlas (`node scripts/build-globe-crust.mjs`).
- `src/sections/Gate/globeCrust.test.ts` : épaisseur, fermeture des bords, géographie et maintien de la carte sur les blocs.
- `src/sections/Gate/journeyGeometry.ts` et son test : géométrie des arcs.
- `intro-preview.html` et ce document : prévisualisation et intégration.

## Inspection locale de la transition

Uniquement en développement : `/intro-preview.html?transition=slow` ralentit la transition,
et `?transition=inspect` la fige à mi-ouverture après le clic pour contrôler les fragments.
Ajouter `&phase=approach` fige l’approche à 600 ms ; `&phase=passage` contrôle le zoom final à 2,4 s.
Échap permet de fermer cette inspection. Le lien sans paramètre utilise la vitesse normale.

## Vérification

Les tests de géométrie et de contenu font partie de `npm test` (52 tests au total).
Compléter avec `npm run typecheck`, `npm run lint` et `npm run build`.
Dans le navigateur, vérifier Entrer, Passer, Échap, « Revoir le globe », le maintien d’un seul Hero
et le retour du focus sur son titre à la fermeture. Le mobile doit accéder directement au portfolio.
Le diagnostic de développement `#root[data-intro-performance]` distingue les mesures CPU et
les intervalles d’images du parcours et du plongeon. Ces mesures ne constituent pas un audit Lighthouse
ni une garantie de fluidité sur un appareil physique. Les diagnostics sont absents de la production.

Contrôle du 28 octobre 2026 : lint, typage, 52 tests et build réussis. Vérifications Chromium :
parcours puis plongeon, entrée immédiate, Passer, Échap, relectures successives, pause/reprise de visibilité simulée,
perte de contexte et échecs de chargement des points ou de la croûte. Le Hero reste monté et retrouve le focus.
Pendant le parcours, aucun redessin récurrent du fond caché ni rendu du réseau hors écran n’a été observé ;
la boucle du globe s’arrête au repos. Après chaque fermeture contrôlée, ses compteurs GPU reviennent à zéro.
Le build a aussi été contrôlé sur mobile, en mouvement réduit et avec Save-Data.
Le navigateur de test utilise SwiftShader : les intervalles d’images mesurés restent élevés dans cet environnement
logiciel et ne permettent pas de certifier une animation sans saccade sur la machine du visiteur.
Le préchargement et la compilation ponctuelle de la croûte sont conservés pour préparer la transition.
