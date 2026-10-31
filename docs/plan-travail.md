# Plan de travail

Établi le 30 octobre 2026 après la revue de l’état du projet. C’est le document à relire
au début de chaque étape. Cocher au fur et à mesure ; ne pas y recopier le détail du code.

## Méthode

- **Une étape à la fois, une branche par étape.** Les étapes se font petit à petit.
- **`/compact` entre chaque étape**, pour limiter la consommation de tokens. Tout ce qu’il faut
  pour reprendre doit donc être écrit ici avant de compacter.
- **`main` déploie la production à chaque push.** Une étape n’y arrive qu’après vérification sur
  l’URL de préversion de sa branche, et seulement à la demande de Jérémie.

Déroulé d’une étape :

1. Relire ce fichier et se placer sur la branche de l’étape.
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

### 0. Stabilisation — branche `etape-0-stabilisation`

- [x] Mettre le tiroir en cours à l’abri sur sa branche (`etape-2-tiroir`).
- [x] Écrire ce plan.
- [x] Retirer l’obligation de l’anglais (règle, type `Localized`, test de contenu).
- [x] Corriger les documents périmés (voix, chapitres audio, Git, nombre de tests).

### 1. Corrections visibles en ligne — branche `etape-1-corrections-prod`

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
- [x] **Réseau du Hero** : mention « Illustration animée : aucun modèle n’est connecté ».

**Terminé quand** le Hero est lisible sur téléphone et que le site ne diffuse plus d’information fausse.

### 2. Finir le tiroir du Lab — branche `etape-2-tiroir`

- [ ] Le lecteur audio ne masque plus le bas du tiroir ni le champ de saisie du Lab IA.
- [ ] Renommer le bouton « Parcours » en « Niveaux » (conflit avec la section du même nom).
- [ ] Un seul nom par niveau (« FOOTPRINTING » / « Découverte et recherche de flag »).
- [ ] Lab IA : séparer la mission des indices, retirer « de la première maquette » du texte visible.
- [ ] Lab IA : retirer le double en-tête « 01/09 · Consignes » / « Sentry · niveau 1 ».

**Terminé quand** Jérémie valide le visuel. Le visuel du Lab IA n’est plus retouché avant l’étape 4,
car son panneau de défenses dépend des résultats du vrai modèle.

### 3. Conception du Lab IA — document seul

Fusionner `plan-lab-ia.md` (5 niveaux, sans RAG ni outils) et `conception-lab-ia.md` (9 niveaux, avec RAG
et outils), qui se contredisent. Décisions à inscrire, avec la recommandation de départ :

- [ ] **Première ouverture** : niveaux 01 à 03 réels, puis 04 (document piégé). Le reste n’est pas affiché.
- [ ] **Recruteur pressé** : démonstration tirée de vraies tentatives enregistrées, dès la première version.
- [ ] **Abus du modèle public** : limiter les réponses hors sujet ou offensantes publiées au nom de Jérémie,
  et l’usage comme LLM gratuit. Les quotas limitent le coût, pas le contenu.
- [ ] **Preuve** : publier le corpus d’attaques et les résultats par niveau, avec leurs limites.
- [ ] **Lien avec Argos Security Arena** : vérifier ce qui peut être réutilisé.

**Terminé quand** il ne reste qu’un seul plan, sans décision ouverte pour les étapes 4 et 5.

### 4. Vrai modèle et niveau 1

- [ ] Tester des modèles candidats en français sur un petit corpus, avec des appels réels bornés.
- [ ] Connecter le niveau 1 : routes, sessions, flag côté serveur, quotas et budget global.

Créer une ressource distante (binding, base D1) demande l’accord de Jérémie.

**Terminé quand** une vraie attaque fonctionne de bout en bout sur la préversion.

### 5. Niveaux 2 et 3, démonstration, ouverture

- [ ] Niveaux 2 et 3 réels, puis démonstration enregistrée.
- [ ] Contrôle sécurité ciblé : aucun flag ni consigne dans le build, quotas concurrents, réponses filtrées
  jamais envoyées au navigateur, journaux sans données personnelles.
- [ ] Mesure Lighthouse avant et après.

**Terminé quand** Jérémie décide l’ouverture publique du sélecteur IA.

### 6. Sentry

- [ ] Ouvrir en production les réponses préparées, une fois validées par Jérémie.
- [ ] Chapitres audio Parcours et Alternance.
- [ ] Questions libres, à décider après le retour d’expérience du Lab IA.

**Terminé quand** le chat ne répond plus « revenez plus tard ».

### 7. Performance et densité

- [ ] Mobile : 56 mesuré le 30 octobre pour un objectif de 90. Le titre apparaît après 7,5 s
  (JavaScript principal de 700 Ko) : découper le bundle, précharger le contenu du Hero.
- [ ] Ordinateur : 46 mesuré, à revoir avec le chargement du globe.
- [ ] Réduire le lecteur audio après le Hero, alléger le Hero (quatre blocs de preuves).
- [ ] Raccourcir le téléphone : 21 300 px au total, dont près de 5 000 px chacun pour Parcours et Projets.

### 8. Audit complet avant la campagne de candidatures

- [ ] Parcours recruteur complet, contact, modales, audio, CTF, accessibilité, mobile et relecture du contenu.

## À fournir par Jérémie, à son rythme

- **Nouveau CV** : ULIT 6 mois (janvier à juin 2026), dates du master selon Parcours, audit web selon
  le texte du projet, positionnement IA et cyber. À sa réception : remettre le PDF dans `src/assets/`,
  son import dans `content/profile.ts` et les liens de téléchargement du Hero et de Contact.
- **Réponses de Sentry** : relire les 11 réponses préparées (`content/assistant.ts`), écrire « points forts »
  et « points faibles ». Elles débloquent l’étape 6.

## État des branches au 30 octobre 2026

- `main` : un commit local non poussé (`6f398d0`), qui partira avec la prochaine mise en ligne.
- `etape-0-stabilisation` : ce plan et les corrections de documents. Rien n’est encore poussé.
- `etape-1-corrections-prod` : part de l’étape 0, étape 1 réalisée, à vérifier sur sa préversion.
- `etape-2-tiroir` : part de l’étape 0, contient le tiroir en cours.
