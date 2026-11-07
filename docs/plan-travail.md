# Plan de travail

Établi le 30 octobre 2026 après la revue de l’état du projet. C’est le document à relire
au début de chaque étape. Cocher au fur et à mesure ; ne pas y recopier le détail du code.

## Méthode

- **Une étape à la fois, deux branches seulement** (décision du 31 octobre) : `main` pour la production,
  `developpement` pour tout le travail. Les étapes se font petit à petit.
- **`main` déploie la production à chaque push.** Une étape n’y arrive qu’après vérification sur
  l’URL de préversion de `developpement`, et seulement à la demande de Jérémie.

Déroulé d’une étape :

1. Relire ce fichier et se placer sur `developpement`.
2. Réaliser l’étape, avec des captures pour tout changement visuel.
3. Lancer `npm run lint`, `npm run typecheck`, `npm test` et `npm run build`.
4. Cocher ici, noter ce qui reste, commiter.
5. Jérémie vérifie et décide de la mise en ligne.

## Décisions du 30 octobre 2026

- **Anglais** : plus maintenu. Tout nouveau texte est en français uniquement. Les textes anglais
  existants restent dans le dépôt, sans garantie d’être à jour ; ils seront repris avec la version anglaise.
- **ULIT** : mission de 6 mois, de janvier à juin 2026. Le site est juste, le CV ne l’est plus.
- **Master** : les dates de la section Parcours font foi (Pré-MSc 2025–2026, MSc 2026–2028).
- **WAF de l’audit web** : le texte du projet (`content/projects/audit-web.ts`) est la référence :
  WAF observé, tests de filtrage via Tor.
- **CV** : le PDF actuel est périmé. Le bouton est grisé avec « CV en cours de mise à jour » jusqu’à
  ce que Jérémie fournisse le nouveau, plutôt que de diffuser une information fausse.

## Étapes

### 0. Stabilisation

- [x] Mettre le tiroir en cours à l’abri sur sa branche.
- [x] Écrire ce plan.
- [x] Retirer l’obligation de l’anglais (règle, type `Localized`, test de contenu).
- [x] Corriger les documents périmés (voix, chapitres audio, Git, nombre de tests).

### 1. Corrections visibles en ligne

- [x] **Hero sur téléphone** : titre, sous-titre et bouton Menu tiennent à 320, 360, 390, 430 et 768 px.
- [x] **CV** : mention grisée dans le Hero et Contact, `CV.pdf` retiré du dépôt et du build,
  « Me contacter » est l’action principale du Hero.
- [x] **CV de retour** (1er novembre) : CV général IA × cyber, sans téléphone, téléchargeable depuis le Hero et Contact.
- [x] **Trois CV** (5 novembre) : développeur IA, cybersécurité, blockchain, sans téléphone (`src/assets/Jeremie_Nagi_CV_*.pdf`), dans un menu « Télécharger mon CV » du Hero et de Contact (`components/ui/CvMenu.tsx`).
- [x] **CTF Blockchain** (5 novembre) : 3ᵉ onglet du CTF, niveau 1 (réentrance) jouable sur une vraie EVM dans le navigateur, contrats du dépôt public `JN13012/smart-contract-ctf` ; catégorie et onglet Blockchain dans Projets, domaine Blockchain en Expertise, 3 CTF dans le Hero, liens `?metier=cyber|ia|blockchain`.
- **CTF Blockchain, niveau 2** (initialisation non protégée, `SharedWallet` derrière un `ERC1967Proxy`), décidé le 6 novembre, sans bonus sur l’implémentation :
  - [x] Guider le joueur au niveau 1 : `cast interface <contrat>`, messages qui nomment l’argument attendu et ce qui a été reçu, lecture et écriture distinguées (`call`/`send`), montants en wei signalés, explication sous chaque erreur Solidity, syntaxe exacte de `cast` affichée quand la signature est abrégée.
  - [x] Console commune aux niveaux (`console.ts`) et un fichier par niveau (`levels/`) ; messages de la console dans `src/content/lab/blockchain.ts`, erreurs Solidity expliquées par contrat (`Contrat.Erreur`).
  - [x] `SharedWallet` et `ERC1967Proxy` (OpenZeppelin) dans `scripts/sync-blockchain-ctf.mjs` ; dans `chain.ts`, le proxy répond avec l’ABI de `SharedWallet` (`useAbi`), et `transfer` envoie des ETH sans données.
  - [x] Niveau 2 : Alice propriétaire de `wallet` (10 ETH), Mallory 2 ETH ; réussi quand le portefeuille est vide.
  - [x] Contenu (objectif, indices, texte de réussite, write-up), choix du niveau depuis l’intro et le tiroir, progression par niveau.
  - [x] Tests (console et niveau 2 joué dans le navigateur), `npm run review`, `architecture.md`, textes du Hero et du projet.
  - [ ] Lighthouse mobile sur la préversion, puis mise en ligne quand Jérémie le décide.
- **CTF Blockchain, niveau 3** (hasard prévisible, `Lottery` et `LotteryAttacker`), plan du 6 novembre :
  - [x] Blocs réalistes dans `chain.ts` : chaque transaction dans un nouveau bloc (numéro +1, horodatage +12 s, `prevrandao` aléatoire), passé à `runCall` ; aujourd’hui, tout s’exécute dans un bloc vide et le tirage serait constant.
  - [x] `Lottery` et `LotteryAttacker` dans `scripts/sync-blockchain-ctf.mjs` ; `cast block` (numéro, horodatage, prevrandao du dernier bloc) pour montrer que les ingrédients du tirage sont publics ; arguments des events affichés (`Played` : guess, winningNumber, prize).
  - [x] Niveau 3 : cagnotte de 10 ETH, ticket à 0,1 ETH, chiffre de 0 à 9, Mallory 1 ETH. Le flag exige une victoire certaine (choix validé le 6 novembre), par `LotteryAttacker` : un ticket gagnant joué à la main (1 chance sur 10) vide la loterie mais affiche « Gagné par chance », sans flag, avec `reset` pour rejouer.
  - [x] Contenu (objectif, indices, explications des fonctions et des erreurs, write-up `03-randomness.md`), `available: true`, textes du Hero et du projet.
  - [x] Tests (tirage différent d’un bloc à l’autre, victoire certaine par l’attaquant, chance sans flag), navigateur ; en production le 6 novembre.
- **Performance mobile** (Lighthouse en production le 6 novembre : 52, LCP 8,6 s, 1,8 Mo d’images au chargement) :
  - [x] Images : fonds des cartes de projets chargés à l’approche de l’écran (`lib/useNearViewport.ts`), images hors écran en `loading="lazy"`, versions réduites du robot Sentry et des vignettes ZeroDay et Coursera du Hero. Mesure locale (`vite preview`) : 69, LCP 4,5 s, 328 Ko d’images.
  - [x] Différer le code des sections basses : Projets, CTF, Expertise, Certifications, Parcours et Contact en fichiers séparés (`lazy` dans `App.jsx`), défilement vers l’ancre une fois chargées. JS principal : 249 → 193 Ko compressés. Mesure locale : 73 à 75, LCP 4,1 s.
  - [x] Premier écran pré-rendu au build et hydraté (`scripts/prerender.mjs`) : le texte du Hero s’affiche avant le JavaScript. Téléphone simulé : LCP observé 1,4 s au lieu d’environ 3,2 s ; Lighthouse local 78 à 81.
  - [x] Intro : variables de la fenêtre non héritées. Le réseau 3D du Hero reste animé pendant la plongée (essai de le figer annulé le 7 novembre : moins beau, et l’intro est fluide sur PC).
- **Lighthouse mobile ≥ 90 n’est plus obligatoire** (décision du 7 novembre) : c’est un repère, à suivre sans bloquer une étape.
- [x] **Description Google** et réponse préparée « Qui est Jérémie ? » : intitulé de Parcours
  à la place de « MSc cybersécurité ».
- [x] **En-têtes de sécurité** dans `public/_headers`, car le Worker ne s’exécute pas pour les fichiers statiques :
  CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`.
  Testé sous le Worker local : globe, audio, modale, envoi du formulaire jusqu’au Worker, aucun blocage CSP.
- [ ] **À vérifier sur la préversion** : envoi réel d’un message de contact et mesure Web Analytics
  (non testables en local : pas de clé d’envoi, CORS de Cloudflare sur localhost).
- [x] **Aperçu de partage** : balises Open Graph et image (`public/og-image.png`, source `dev/assets/og-image.html`).
- [ ] **À vérifier après la mise en ligne** : un vrai partage LinkedIn, car l’image pointe vers l’URL de production.
- [x] **`llms.txt` et `sitemap.xml`** : vrais fichiers, `sitemap.xml` déclaré dans `robots.txt`.
- [x] **Réseau du Hero** : mention « Illustration animée : aucun modèle n’est connecté », retirée à la demande de Jérémie le 31 octobre.

**Terminé quand** le Hero est lisible sur téléphone et que le site ne diffuse plus d’information fausse.

### 2. Finir le tiroir du Lab

- [x] Le lecteur audio ne masque plus le bas du tiroir ni le champ de saisie : la page se décale à l’ouverture
  du tiroir et au focus d’un champ (`lib/keepClearOfPlayer.ts`).
- [x] Renommer le bouton « Parcours » en « Niveaux » (conflit avec la section du même nom).
- [x] Intro du Lab IA : plus de lien « Parcours » sous « Commencer », ni de « Démonstration actuelle ».
- [x] Noms du terminal corrigés : « FORENSICS » et « HARDENING » (31 octobre). « FOOTPRINTING » reste le nom du niveau 1.
- [x] Lab cyber : intro en « NOM : description courte », tiroir avec le nom seul et la description en infobulle au survol (demande du 31 octobre), textes à valider.
- [x] Lab IA : retirer du tiroir « Mission » et « Indices » (décision du 31 octobre) et « de la première maquette »
  du texte. Seul « À retenir » reste, une fois le niveau réussi. Les textes restent dans `content/lab/ai.ts`.
- [x] Lab IA : retirer le double en-tête « 01/09 · Consignes » / « Sentry · niveau 1 ».
- [x] Tiroir en menu déroulant sous la barre, sommaire inspiré de Nautilus Trader : texte à gauche, frise sur deux positions, allumée du haut jusqu’au niveau sélectionné, niveau sélectionné
  dans la couleur du Lab (demande du 31 octobre), à valider.
- [x] Bande audio : repli en cascade et comportement par état (`lib/presentationFold.ts`, `autoFoldDelay`), à valider.

- [x] Lab IA : bandeau « en cours de construction » retiré, terminal et fenêtre des défenses alignés sur le terminal du Lab cyber, en bleu (demande du 31 octobre), à valider.
- [x] Fenêtre des défenses : un point par étape active du niveau, un anneau pour les étapes qui peuvent bloquer, signal à vitesse constante, le signal s’arrête à la défense qui bloque, avec une zone de texte pour l’étape, le verdict et l’indice (31 octobre, à valider).
- [x] Bande audio réduite : après 6 s sans usage, seul le chevron reste (31 octobre, à valider).
- [x] Fenêtre des défenses : réseau en haut, texte juste dessous, « Simulation » retiré, Sentry dans la barre, bleu réduit (31 octobre, à valider).
- [x] Écran IA renommé « Red-team Sentry » (31 octobre). Fenêtre des défenses sur toute la hauteur, palette bleutée et or pour l’indice, à valider.

**Terminé** : visuel validé par Jérémie le 31 octobre. Le contenu du panneau de défenses sera revu à l’étape 4,
car il dépend des résultats du vrai modèle.

### 3. Conception du Lab IA — document seul

- [x] Un seul plan : [`conception-lab-ia.md`](conception-lab-ia.md). L’ancien plan technique est archivé.
- [x] Périmètre (31 octobre) : mini-jeu pédagogique pour le portfolio, comme le Lab cyber, qui couvre le red team
  d’un agent puis la remédiation et le durcissement, en 10 niveaux. Les niveaux 6 à 10 sont à confirmer à l’étape 4.
- [x] Décisions inscrites : affichage public, accès libre, quotas, empreinte d’IP, garde-fou contre les abus,
  démonstration enregistrée, corpus publié.

### 4. Vrai modèle et niveau 1

- [x] Modèles testés en français, appels d’outils compris (résultats dans [le plan du Lab](conception-lab-ia.md#résultats-des-modèles)) :
  GLM 4.7 Flash au niveau 1, niveaux 6 à 10 confirmés avec Llama 3.3 comme candidat pour l’agent.
- [x] Aperçu aligné sur le plan : 10 niveaux, « Classifieur IA », trois indices à la demande, résultats préparés supprimés.
- [x] Niveau 1 connecté : routes, sessions, flag côté serveur, garde-fou, quotas (session, IP sur 1 h, 5 h et 24 h), budget global.
- [x] Base D1 `portfolio-lab` (`LAB_DB`) créée et migrée ; binding Workers AI déclaré.
- [x] Vraie attaque validée de bout en bout sous le Worker local : vrai modèle, flag révélé puis validé par le serveur, 1440 et 390 px.
- [x] Secret `LAB_IP_SECRET` posé par Jérémie sur le Worker, sans déploiement en production.
- [x] Même attaque validée sur la préversion le 31 octobre, à 1440 et 390 px, sans erreur dans la console. Production inchangée.

Créer une ressource distante (binding, base D1) demande l’accord de Jérémie.

**Terminé quand** une vraie attaque fonctionne de bout en bout sur la préversion.

### 5. Niveaux 2 à 4, démonstration

- [x] Ouverture publique du sélecteur IA avec le seul niveau 1, décidée par Jérémie le 31 octobre. Les autres restent « À venir ».
- [x] Niveau 2 réel, sur `developpement` : filtres d’entrée et de sortie, mesurés sur le vrai modèle le 1er novembre (voir [le plan du Lab](conception-lab-ia.md#filtres-dentrée-et-de-sortie-02)).
- [x] Niveau 3 réel, sur `developpement` : classifieur Gemma 4, mesuré sur le vrai modèle le 1er novembre (voir [le plan du Lab](conception-lab-ia.md#classifieur-ia-03)).
- [x] Niveaux 2 et 3 publiés en production le 2 novembre, à la demande de Jérémie.
- [x] Niveau 4 réel, sur `developpement` : CV piégé, mesuré sur le vrai modèle le 2 novembre (voir [le plan du Lab](conception-lab-ia.md#cv-piégé-04)).
- [ ] Démonstration enregistrée à décider, banc de test et corpus publiés, avec taux de réussite par niveau.
- [ ] Refaire le contrôle sécurité à chaque niveau ajouté.

**Terminé quand** les niveaux 2 à 4 sont réels et publiés.

### 6. Fin du parcours du Lab IA

- [x] Niveau 5 réel, sur `developpement` : fournisseur homonyme et fraude à l’IBAN, recherche BGE-M3, mesuré sur le vrai modèle le 3 novembre (voir [le plan du Lab](conception-lab-ia.md#fournisseur-homonyme-05)).
- [x] Niveau 6 réel, sur `developpement` : agent du support informatique de Norvel, vrais outils sur un annuaire fictif, accès vérifié dans l’annuaire, mesuré sur le vrai modèle le 7 novembre (voir [le plan du Lab](conception-lab-ia.md#support-informatique-06)).
- [ ] Niveau 6 : vérification dans le navigateur par Jérémie, puis mise en ligne quand il le décide.
- [x] Guidage par scripts dans la fenêtre d’analyse (7 novembre) : « Flag » vérifié et « Absent », titre « Pas de flag dans la réponse », ligne « À tenter » par niveau et par résultat, invitation à l’indice 1 après 3 échecs.
- [ ] Plus tard, à décider : bouton « Analyser mon essai » avec un second modèle, à la demande et limité.
- [ ] Niveaux 7 et 8 : reconnaissance et API, puis chaîne complète par email piégé (fuite par le rendu de la réponse).
- [ ] Niveaux 9 et 10 : remédiation et durcissement, avec vérification avant/après.
- [ ] Rapport de fin de parcours, généré à partir des vraies traces.
- [ ] Hauteur du tiroir à revoir une fois tous les niveaux affichés.

**Terminé quand** tous les niveaux du parcours sont réels et publiés.

### 7. Sentry

- [ ] Ouvrir en production les réponses préparées, une fois validées par Jérémie.
- [ ] Chapitres audio Parcours et Alternance.
- [ ] Questions libres, à décider après le retour d’expérience du Lab IA.

**Terminé quand** le chat ne répond plus « revenez plus tard ».

### 8. Performance et densité

- [ ] Mobile : 56 mesuré le 30 octobre pour un objectif de 90. Le titre apparaît après 7,5 s
  (JavaScript principal de 700 Ko) : découper le bundle, précharger le contenu du Hero.
- [ ] Ordinateur : 46 mesuré, à revoir avec le chargement du globe.
- [ ] Réduire le lecteur audio après le Hero, alléger le Hero (quatre blocs de preuves).
- [ ] Raccourcir le téléphone : 21 300 px au total, dont près de 5 000 px chacun pour Parcours et Projets.

### 9. Audit complet avant la campagne de candidatures

- [ ] Parcours recruteur complet, contact, modales, audio, CTF, accessibilité, mobile et relecture du contenu.

## À fournir par Jérémie, à son rythme

- **Réponses de Sentry** : relire les 11 réponses préparées (`content/assistant.ts`), écrire « points forts »
  et « points faibles ». Elles débloquent l’étape 7.

- **Nouveaux projets** : valider les notes de complexité proposées pour Chronox (3), Maria Agent (2), FraudSignal (4) et Lab IA (4).

## État des branches au 2 novembre 2026

- `main` : la production, avec les étapes 0 à 4 et le Lab IA ouvert sur ses niveaux 1 à 4, publiés à la demande de Jérémie.
- `developpement` : tout le travail. Préversion : https://developpement-www.jeremie-nagi.workers.dev
