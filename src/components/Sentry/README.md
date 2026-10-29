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

Le repos ferme l’ensemble des deux neurones et les remplace brièvement par des
yeux souriants. Le cycle CSS de 22 s contient trois clignements, espacés de 7 à
8 s. La coque reste fixe au repos ; le hochement de réponse anime seulement le visage.
Les ramifications et la connexion s’effacent pendant le sourire de réponse.
Le bouclier garde son rouge pendant toute la réaction, y compris sans animation.

Au survol avec une souris, le regard au repos suit le pointeur sur 2 px au plus
en X et 1,3 px en Y (moins sur les petits avatars). Une transition de 240 ms
amortit le mouvement et le retour au centre. La coque et l’antenne restent fixes.
Le suivi s’efface dès qu’une expression active prend la priorité, qu’on quitte
la mascotte, qu’elle est masquée ou que la préférence de mouvement change.
Il est désactivé avec un pointeur tactile et sous réduction des mouvements.
Le pointeur planifie au plus une frame par déplacement, sans boucle permanente
ni mise à jour de l’état React ; la frame éventuelle est annulée au nettoyage.

Des signaux lumineux parcourent quelques ramifications toutes les 9,6 s,
avec un décalage de 4,2 s entre les yeux. Une impulsion remonte la tige de
l’antenne toutes les 10,6 s, puis éclaire ses trois sphères en décalé. Au survol,
leur luminosité augmente légèrement. La recherche utilise un cycle de 1,8 s ;
le blocage rend la tige et les sphères rouges. Ces effets SVG suivent les mêmes
règles de pause que le clignement et restent fixes sous réduction des mouvements.

`animated={false}` garde les avatars des messages fixes, sans observateur.
Seul le lanceur ou l’avatar d’en-tête est animé. `paused` suspend le lanceur
pendant l’introduction ou l’ouverture du chat. Un IntersectionObserver et
`visibilitychange` suspendent les timelines CSS hors écran et en onglet masqué.
La lecture progressive utilise un timer borné à la durée de la fiche, suspendu
en onglet masqué et pendant l’introduction ; aucun rendu React à chaque frame.

`src/app/App.jsx` monte directement `SentryChat`. Le panneau public affiche seulement
« Je suis en cours de conception, merci de revenir plus tard. », sans questions,
historique, saisie ni bouton audio. Le focus va au bouton de fermeture.
Les expressions, le clignement et les blocages pédagogiques du Hero restent actifs.
Les fiches préparées et leurs sources sont conservées uniquement pour l’aperçu
de développement (`preparedPreview`, ignoré en production). Dans cet aperçu,
leur historique et leur animation partagent `src/lib/assistantStore.ts` avec le Hero.
Les questions libres y affichent un message d’indisponibilité et la voix y reste désactivée.

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
installé. L’événement local `guardBlockedDemo` relie uniquement les blocages
pédagogiques du Hero à une réaction de 1,5 s. Il est émis à l’arrivée du signal
rouge sur le garde-fou, jamais à partir du contenu d’une question. Des événements
successifs prolongent la réaction ; à son expiration, l’activité est recalculée
depuis la fiche ou le brouillon actuels. Les Labs et la voix ne sont pas branchés.
La réduction des animations interrompt aussi la lecture progressive des
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
L’avatar de l’en-tête mesure 72 px sur ordinateur et 64 px sous 640 px ; le nom
et le statut restent à sa droite. Les avatars historiques restent à 32 px.
Sous 360 px de hauteur, l’avatar revient à 48 px et les marges du journal se
réduisent pour garder la saisie accessible, notamment avec un clavier mobile.

`/mockups.html?view=sentry` montre les cinq expressions et permet de piloter
l’avatar du chat, une fiche préparée et un blocage pédagogique temporaire.
Sur petit écran, replier le chat pour accéder aux commandes de l’aperçu.
Cette page et ses libellés de contrôle ne font pas partie du build de production.

La bulle de bienvenue a une silhouette asymétrique, une pointe SVG et un contour
vert discret. Elle apparaît après le dernier salut, une fois par
session (`sessionStorage`, clé `sentry-welcome-seen`), puis disparaît après 10 s.
Le survol ou le focus suspend cette disparition ; le délai de 10 s repart à leur sortie. Sa croix et Échap la ferment
et remettent le focus sur Sentry. L’ouverture de la conversation annule également
la bienvenue. Aucun focus n’est déplacé lors de son apparition.

Le salut comporte trois inclinaisons de 750 ms : droite (+3°), gauche (−3°),
droite (+1,5°), puis au centre. La première suit la révélation réelle de la
fenêtre pendant le zoom (`onPortfolioVisible`, lorsque son fondu est terminé).
La deuxième suit la fermeture effective du globe. La troisième attend deux
secondes après cette ouverture, puis la fin réelle du mouvement précédent.
L’infobulle attend l’événement de fin du dernier mouvement, sans estimer sa durée.
Sans introduction, le premier passage est omis ; une session déjà accueillie
ne rejoue aucun salut. L’ouverture du chat ou la relecture du globe termine l’accueil.

`lib/sentryWelcome.ts` conserve ces repères et bloque seulement les injections
automatiques du réseau jusqu’à la disparition complète ou la fermeture de la
bulle. Les requêtes vertes continuent ; la cadence rouge repart ensuite sans
accumuler de signaux en attente. Le réglage manuel du réseau reste indépendant.
`useSentryInclination.ts` anime la coque sans dépendre de l’état du visage : une
réaction rouge ne coupe pas le salut. Hors écran ou en onglet masqué, le mouvement
est mis en pause et reprend ensuite. Ses observateurs et écouteurs sont retirés
à la fin de chaque passage ; aucune boucle JavaScript n’est ajoutée.
La réduction des animations saute les mouvements, y compris si elle est activée
pendant un salut, tout en conservant l’infobulle. Le délai de deux secondes et
le temps de lecture attendent que l’onglet soit visible.

Au repos, le réseau du Hero émet 20 % moins de requêtes et de signaux rouges
de démonstration, qui circulent 15 % moins vite. Les intervalles sont donc
divisés par 0,8 : 3,75 s entre requêtes et 6,25 s entre signaux rouges en moyenne,
avec la variation aléatoire conservée. Pendant une fiche préparée, les signaux
ciblés gardent leur intervalle de 450 ms et retrouvent leur vitesse initiale,
avec une transition progressive ; la durée de lecture et de génération ne change pas.
La version 2D utilise les mêmes coefficients de repos et retrouve aussi son
rythme initial pendant une fiche préparée, sans charger le moteur 3D.

Contrôles complémentaires du lanceur flottant : apparition après la véritable
introduction, pause au survol et au focus, fermeture avec retour du focus,
absence de réapparition après rechargement dans la même session, disparition
automatique après 10 s, et en-tête/saisie non masqués par la navigation aux formats
320 × 568, 390 × 844, 844 × 390, 390 × 320 et 390 × 250.
