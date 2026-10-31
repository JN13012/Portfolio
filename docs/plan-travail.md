# Plan de travail

Établi le 30 octobre 2026 après la revue de l’état du projet. C’est le document à relire
au début de chaque étape. Cocher au fur et à mesure ; ne pas y recopier le détail du code.

## Méthode

- **Une étape à la fois, deux branches seulement** (décision du 31 octobre) : `main` pour la production,
  `developpement` pour tout le travail. Les étapes se font petit à petit.
- **`/compact` entre chaque étape**, pour limiter la consommation de tokens. Tout ce qu’il faut
  pour reprendre doit donc être écrit ici avant de compacter.
- **`main` déploie la production à chaque push.** Une étape n’y arrive qu’après vérification sur
  l’URL de préversion de `developpement`, et seulement à la demande de Jérémie.

Déroulé d’une étape :

1. Relire ce fichier et se placer sur `developpement`.
2. Réaliser l’étape, avec des captures pour tout changement visuel.
3. Lancer `npm run lint`, `npm run typecheck`, `npm test` et `npm run build`.
4. Cocher ici, noter ce qui reste, commiter.
5. Jérémie vérifie, décide de la mise en ligne, puis `/compact`.

## Décisions du 30 octobre 2026

- **Anglais** : plus maintenu. Tout nouveau texte est en français uniquement. Les textes anglais
  existants restent dans le dépôt, sans garantie d’être à jour ; ils seront repris avec la version anglaise.
- **ULIT** : mission de 6 mois, de janvier à juin 2026. Le site est juste, le CV ne l’est plus.
- **Master** : les dates de la section Parcours font foi (Pré-MSc 2025–2026, MSc 2026–2028).
- **WAF de l’audit web** : le texte du projet (`content/projects/pentest.ts`) est la référence :
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
  du texte. Seul « À retenir » reste, une fois le niveau réussi. Les textes restent dans `content/aiLab.ts`.
- [x] Lab IA : retirer le double en-tête « 01/09 · Consignes » / « Sentry · niveau 1 ».
- [x] Tiroir en menu déroulant sous la barre, sommaire inspiré de Nautilus Trader : texte à gauche, frise sur deux positions, allumée du haut jusqu’au niveau sélectionné, niveau sélectionné
  dans la couleur du Lab (demande du 31 octobre), à valider.
- [x] Bande audio : repli en cascade et comportement par état (`lib/presentationFold.ts`, `autoFoldDelay`), à valider.

- [x] Lab IA : bandeau « en cours de construction » retiré, terminal et fenêtre des défenses alignés sur le terminal du Lab cyber, en bleu (demande du 31 octobre), à valider.
- [x] Fenêtre des défenses : un point par étape active du niveau, un anneau pour les étapes qui peuvent bloquer, seul le modèle dessiné en réseau (3 + 3) et traversé en entier, signal à vitesse constante, le signal s’arrête à la défense qui bloque, avec une zone de texte pour l’étape, le verdict et l’indice (31 octobre, à valider).
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
- [ ] **Secret à poser par Jérémie** : `LAB_IP_SECRET` sur le Worker. Sans lui, le Lab répond « indisponible ».
- [ ] **À vérifier sur la préversion**, après commit et push de `developpement` : la même attaque. Le build lit `WORKERS_CI_BRANCH`.

Créer une ressource distante (binding, base D1) demande l’accord de Jérémie.

**Terminé quand** une vraie attaque fonctionne de bout en bout sur la préversion.

### 5. Niveaux 2 à 4, démonstration, ouverture

- [ ] Niveaux 2 et 3 réels, puis niveau 4 (document piégé).
- [ ] Démonstration enregistrée, banc de test et corpus publiés, avec taux de réussite par niveau.
- [ ] Afficher seulement les niveaux réels dans l’intro et le tiroir publics.
- [ ] Contrôle sécurité ciblé : aucun flag ni consigne dans le build, quotas concurrents, réponses filtrées
  jamais envoyées au navigateur, journaux sans données personnelles.
- [ ] Mesure Lighthouse avant et après.

**Terminé quand** Jérémie décide l’ouverture publique du sélecteur IA.

### 6. Fin du parcours du Lab IA

- [ ] Niveaux 5 à 8 : sources et RAG, agent et outils, reconnaissance et API, chaîne complète.
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

- **Nouveau CV** : ULIT 6 mois (janvier à juin 2026), dates du master selon Parcours, audit web selon
  le texte du projet, positionnement IA et cyber. À sa réception : remettre le PDF dans `src/assets/`,
  son import dans `content/profile.ts` et les liens de téléchargement du Hero et de Contact.
- **Réponses de Sentry** : relire les 11 réponses préparées (`content/assistant.ts`), écrire « points forts »
  et « points faibles ». Elles débloquent l’étape 7.

## État des branches au 31 octobre 2026

- `main` : la production, sur `6f398d0`. Les étapes 0 et 1 n’y sont pas encore.
- `developpement` : tout le travail. Préversion : https://developpement-www.jeremie-nagi.workers.dev
