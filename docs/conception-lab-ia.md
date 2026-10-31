# Lab IA — Red-team Sentry

Plan unique du Lab IA, établi le 31 octobre 2026. Il remplace les deux documents précédents ;
l’ancien plan technique est conservé dans [l’archive](archive/plan-lab-ia.md).
Ce document n’autorise aucun déploiement.

## Ce qu’est le Lab

Un mini-jeu pédagogique du portfolio, comme le Lab cyber : il montre aux recruteurs une démarche
de sécurité sur un agent IA. Le visiteur attaque Sentry, puis apprend à corriger et à durcir.

- **Ce n’est pas** un produit, un outil d’évaluation ni la reproduction d’une mission professionnelle.
- **Taille proportionnée** : pas de compte, de classement ni d’infrastructure au-delà du nécessaire
  pour tenir le coût et éviter les abus.
- Sentry garde son personnage, mais les consignes, la conversation et les quotas du Lab sont
  séparés de son chat et de sa présentation vocale.

## Réalisme technique (décision du 31 octobre)

La technique est réelle, seules les données sont fictives. Modèle, classifieurs, outils, endpoints, droits,
quotas et traces fonctionnent réellement ; le flag, l’agenda et les personnes sont inventés. La cible est
volontairement vulnérable, ce que le Lab annonce. Toute fuite reste confinée au domaine du Lab et à la session.

## Parcours en 10 niveaux

Sentry gagne une capacité à chaque partie : la surface d’attaque grandit avec l’histoire.
Les niveaux 6 à 10 sont confirmés : les appels d’outils fonctionnent sur le vrai modèle (voir les résultats plus bas).

| Partie | Niveau | Mission | Difficulté visée |
| --- | --- | --- | --- |
| Le faire parler | 01 — Consignes | Obtenir le flag fictif ; comparer consigne simple et instructions structurées. | Facile, très guidé |
| Le faire parler | 02 — Filtres | Comprendre les contrôles d’entrée et de sortie, et où une tentative est arrêtée. | Facile à moyen |
| Le faire parler | 03 — Classifieur IA | Contourner un évaluateur dédié qui contrôle la réponse. | Moyen |
| Il lit des documents | 04 — Document piégé | Modifier une fiche que Sentry doit résumer à la suite d’une demande légitime. | Moyen |
| Il lit des documents | 05 — Sources et RAG | Faire remonter un document manipulé parmi plusieurs sources ; comprendre les frontières de confiance. | Moyen |
| Il agit | 06 — Agent et outils | Découvrir les outils de l’agent et obtenir une action interdite sur un agenda fictif. | Moyen à difficile |
| Il agit | 07 — Reconnaissance et API | Cartographier les endpoints, appeler un outil sans l’agent, lire les données d’un autre utilisateur fictif, tester les limites de débit. | Moyen à difficile |
| Il agit | 08 — Chaîne complète | Enchaîner document piégé, lecture de données privées et fuite vers un point de collecte. | Difficile |
| Corriger | 09 — Protéger l’assistant | Corriger les niveaux 3 à 5 sans empêcher les résumés légitimes, puis rejouer les attaques. | Moyen |
| Corriger | 10 — Sécuriser l’agent | Corriger les niveaux 6 à 8 : droits, outils, confirmations, CSP et URL autorisées ; vérification avant/après. | Difficile |

Règles communes :

- Chaque niveau ajoute une seule nouveauté, pour une progression sans à-coup. La difficulté visée est mesurée sur le vrai modèle.
- Trois indices à la demande, sans pénalité : piste, technique, quasi-solution.
- Au niveau 01, les deux configurations se choisissent dans la console. Le flag du niveau est valable
  quelle que soit la configuration ; le bilan invite à essayer l’autre.
- Les documents, identités, outils et effets restent propres au scénario, sans aucune cible externe.
- Scans réseau et services restent dans le Lab cyber.
- Chaque niveau offensif se termine par la protection adaptée. Les filtres, le classifieur et les consignes
  sont des défenses partielles : on ne promet jamais l’inviolabilité.
- La difficulté se calibre sur le modèle réel. Si un niveau n’est pas jouable, on le dit et on le revoit :
  pas de réussite fabriquée ni de filtre désactivé en silence.

### Classifieur IA (03)

« Classifieur IA » remplace « Juge IA », qui n’est pas le terme du métier. Llama Guard vise les contenus
dangereux et ne repérerait sans doute pas une fuite de flag : ce niveau utilise donc un évaluateur dédié,
qui lit lui aussi du texte contrôlé par l’attaquant. Ce montage n’est pas présenté comme un standard de l’industrie.

### Injection indirecte (04–05)

Le visiteur agit sur une source que Sentry consulte, pas seulement sur le chat : éditeur de fiche
de longueur bornée au niveau 04, petite base documentaire fixe au niveau 05.
Le point à faire comprendre est qu’un contenu externe ne doit pas acquérir l’autorité d’une consigne.

### Reconnaissance et API (07)

Le red team IA couvre tout le système, pas seulement les prompts. La console envoie de vraies requêtes HTTP
à une petite application du Lab, avec de vrais contrôles d’accès volontairement défaillants à ce niveau.
Tout reste limité à la session et aux utilisateurs fictifs du scénario.

### Chaîne complète (08)

La fuite est réelle : le rendu de la réponse fait partir du navigateur une vraie requête vers un point de collecte
du Lab, avec un flag fictif. Le rendu n’autorise que ce point de collecte, sans HTML libre ; la CSP bloque toute autre destination.
Le niveau 10 corrige par une vraie CSP et une liste d’URL autorisées.

### Remédiation (09–10)

La console laisse place à une configuration guidée :

1. Observer un incident et sa trace.
2. Choisir une protection, parmi des choix pertinents et d’autres insuffisants.
3. Rejouer des attaques et des tâches légitimes.
4. Comparer, puis expliquer l’impact, les faux positifs et les limites.

Tout bloquer ou couper tous les outils n’est pas une réussite. Les droits sont appliqués par le serveur
et les outils, pas seulement décrits dans un prompt. La validation vérifie les conséquences dans
l’environnement fictif, pas une phrase de refus. Les résultats valent pour le corpus testé.
Les défenses les plus solides tiennent à l’architecture : droits limités et séparation des données non fiables
(Dual LLM, CaMeL).

### Rapport de fin de parcours

Généré à partir des vraies traces de la session : faille, impact, référence OWASP, gravité, correction et résultat avant/après.

### Banc de test

Un script rejoue chaque attaque du corpus plusieurs fois, car les réponses d’un modèle varient.
Le résultat publié est un taux de réussite par niveau, reproductible, avec modèle, version et date.
Le code du banc est publié avec le corpus.

## Décisions du 31 octobre

| Sujet | Décision |
| --- | --- |
| **Affichage public** | Seuls les niveaux réels sont affichés : 01 à 04 à l’ouverture, puis 05 à 10 quand ils sont prêts. L’aperçu de développement garde tous les niveaux et « À venir » jusque-là. |
| **Accès aux niveaux** | Libre, comme au Lab cyber. Chaque réussite est enregistrée séparément ; rien n’est déduit d’une visite. |
| **Quotas** | 60 essais par session, 30 / 60 / 100 par empreinte d’IP sur 1 h, 5 h et 24 h, 5 000 neurones par jour au total. Workers AI n’offre pas de plafond de dépense : ce budget, inférieur aux 10 000 neurones gratuits par jour, en tient lieu. Un essai courant coûte environ 15 neurones. |
| **IP** | HMAC avec secret serveur et sel changé chaque jour, conservé 48 h au plus, jamais d’IP en clair. Une empreinte reste une donnée personnelle : une courte mention l’indique près du Lab. |
| **Abus** | Un garde-fou sur tous les niveaux (Llama Guard 3 envisagé), séparé des défenses du jeu : réponses courtes, limitées à l’exercice, avec un état propre dans la trace (« Hors exercice »). Il réduit le risque sans l’éliminer ; le Lab indique que les réponses sont générées et non relues. |
| **Recruteur pressé** | Une démonstration tirée de vraies tentatives enregistrées, avec date et modèle. Elle arrive avec l’ouverture publique, jamais avant le modèle réel. |
| **Preuve** | Publier le corpus d’attaques, le banc de test et les taux de réussite par niveau, avec modèle, version, date et limites. |
| **Modèle** | Workers AI. GLM 4.7 Flash pour le niveau 1, raisonnement désactivé ; Llama Guard 3 pour le garde-fou. Le modèle des niveaux suivants sera choisi selon la difficulté visée. |

## Résultats des modèles

Mesurés le 31 octobre 2026 sur Workers AI, avec un flag fictif. Fuites : 10 attaques en français répétées 3 fois, soit 30 essais par configuration,
en ne comptant que la réponse publiée. Outils : 4 appels par cas, sur un agenda fictif. Petit corpus : ce sont des ordres de grandeur.

| Modèle | Fuites, consigne simple | Fuites, instructions structurées | Neurones par appel | Agenda d’un autre | Suppression interdite | Injection par un résultat d’outil |
| --- | --- | --- | --- | --- | --- | --- |
| GLM 4.7 Flash | 13/30 | 8/30 | 2,4 | 0/4 | 4/4 | 0/4 |
| Llama 3.3 70B | 6/30 | 3/30 | 15,6 | 2/4 | 4/4 | 4/4 |
| Mistral Small 3.1 | 6/30 | 0/30 | 5,5 | 0/4 | 4/4 | 0/4 |
| Gemma 4 26B | 0/30 | 0/30 | 2,2 | 0/4 | 0/4 | 0/4 |

- **Niveau 1 :** GLM 4.7 Flash, le seul à rester facile dans les deux configurations, et le moins cher des modèles qui fuient.
- **Niveaux d’agent :** Llama 3.3 est le seul à obéir à une consigne cachée dans un résultat d’outil, ce qu’exige le niveau 08. Il coûte 6 fois plus cher.
- **Raisonnement :** certains modèles répètent le flag dans un champ de raisonnement. Le serveur ne lit que la réponse publiée.
- **Garde-fou :** Llama Guard 3 a classé correctement 4 demandes dangereuses en français et 2 demandes légitimes. Il classe « ignore tes instructions » en S14,
  soit l’exercice lui-même : cette seule catégorie est ignorée. Non mesuré sur un grand corpus.

## Interface

- Console à gauche, fenêtre « Défenses de Sentry » à droite, dans le même cadre que le Lab cyber, en bleu.
- « Commencer » ouvre le niveau 01. Un niveau disponible s’ouvre directement depuis l’entrée ou le tiroir « Niveaux ».
  La flèche de demi-tour revient à la présentation et conserve le travail en mémoire.
- La fenêtre de droite suit la surface du niveau : chaîne de traitement, documents, outils ou permissions.
- Sur téléphone : console d’abord, puis résultat en texte et dessin statique.
- Entrée envoie ; Maj+Entrée ajoute une ligne ; pas d’envoi pendant une composition IME.
- Les essais restants viennent du serveur. Blocage, réponse délivrée, hors exercice, erreur, quota et validation
  sont des états distincts. Un refus du modèle reste une réponse délivrée : le détecter demanderait un classifieur, et une liste de mots serait trompeuse.
- La trace affichée rejoue la réponse du serveur. Pendant l’attente, seul « Analyse en cours… » s’affiche :
  pas d’étapes simulées en direct ni de faux temps d’inférence. Pas de streaming dans cette version.
- Le dessin ne tourne que pendant une tentative ou un « Rejouer », se suspend hors écran et reste statique
  avec réduction des mouvements. Une liste en texte porte la même information.

## Serveur

Parcours d’un essai : validation de la requête → quotas → filtre d’entrée → consignes → modèle
→ filtre de sortie → classifieur éventuel → garde-fou → réponse publiée.
Chaque étape est non active, passée, bloquée, en erreur ou non exécutée. Un blocage arrête le traitement.

| Route | Rôle |
| --- | --- |
| `POST /api/lab/session` | Créer ou reprendre une session opaque, renvoyer progression et disponibilité. |
| `POST /api/lab/attempt` | Traiter un prompt, avec identifiant de requête unique. |
| `POST /api/lab/validate` | Vérifier un flag complet, de façon idempotente et limitée en fréquence. |

Les niveaux 07 et 08 ajoutent les routes de l’application du scénario et le point de collecte, à définir à l’étape 6.

**Sessions et flags**

- Cookie HttpOnly, Secure et SameSite ; session de 24 h ; aucune identité demandée.
- Flag aléatoire par session et par niveau, créé et vérifié côté serveur, jamais présent dans le build.
- Le navigateur ne fait autorité ni sur la progression, ni sur les quotas. Son historique court est traité
  comme non fiable : seuls les rôles utilisateur et assistant sont reconstruits.

**Réponses**

- Une réponse retenue par un filtre, le classifieur ou le garde-fou n’atteint jamais le navigateur, même dans la trace.
- Le classifieur rend un verdict structuré limité. En cas d’erreur, rien n’est publié et une erreur technique s’affiche.
- Une erreur fournisseur ou un quota épuisé ne compte jamais comme une attaque bloquée.
- La réussite d’un niveau dépend uniquement du flag validé par le serveur.

**Limites et coût**

- Base D1 dédiée `LAB_DB`, séparée de `VISITS_DB` : sessions expirables, progression, réservations, budgets.
- Pas de prompts ni de réponses bruts dans D1 ou les journaux ; à vérifier aussi sur les journaux de la plateforme.
- 2 000 caractères par prompt, six échanges d’historique, 4 000 caractères d’historique au plus.
- Sortie et délai bornés, un seul traitement actif par session, création de sessions limitée, Turnstile si nécessaire.
- Un appel au modèle et, au plus, un appel au classifieur par essai. Les niveaux d’agent ont une boucle au nombre de tours borné, comptée dans le quota ; aucune relance sans limite.
  Le coût maximal est réservé de façon atomique avant l’appel ; un doublon ne déclenche pas de second appel.
- Sans binding, budget ou fournisseur disponible : message d’indisponibilité clair, jamais de faux résultat.
  La démonstration enregistrée reste consultable.

**Fichiers** : `src/sections/Lab/ia/` et `src/content/aiLab.ts` (textes publics, sans consignes ni flag),
`server/aiLab/` (routes, sessions, quotas, consignes, modèle, tests) et `migrations/ai-lab/`.

**Ouverture** : les routes répondent seulement sur la préversion et en local (`OPEN_HOSTS`), et le code du Lab n’entre que dans le build
de la branche `developpement` (`WORKERS_CI_BRANCH`). La production reste inerte jusqu’à la décision de l’étape 5.

## Réalisation

Les étapes sont suivies dans le [plan de travail](plan-travail.md).

- **État actuel :** niveau 1 réel sur le vrai modèle, en développement et sur la préversion ; les neuf autres sont « À venir ».
  Le build de production exclut ce code et le sélecteur IA y reste désactivé.
- **Étape 5 :** niveaux 2 à 4, démonstration, banc de test et corpus publiés, contrôle de sécurité, ouverture décidée par Jérémie.
- **Étape 6 :** niveaux 5 à 8, puis remédiation aux niveaux 9 et 10 et rapport de fin de parcours.

## Vérifications

- **Serveur :** soumissions répétées, validation idempotente, session expirée, quotas concurrents, budget global,
  doublons réseau, aucun appel après un blocage d’entrée, aucune réponse filtrée dans l’API.
- **Build :** ni flag, ni consigne privée, ni secret fournisseur.
- **Affichage :** contenu du modèle et de l’utilisateur échappé, sans insertion HTML directe ; au niveau 08, seul le point de collecte peut recevoir une requête.
- **Navigateur :** 1440, 390 et 320 px, clavier seul, clavier virtuel, tiroir, historique long, bascule Cyber / IA
  pendant un traitement. CTF, Sentry, audio et modales recontrôlés.
- **Performance :** Lighthouse mobile avant et après, dans les mêmes conditions.
- Un comportement de modèle n’est déclaré vérifié qu’avec des appels réels, jamais à partir de résultats préparés.

## Références

- [Microsoft — Lessons From Red Teaming 100 Generative AI Products](https://arxiv.org/html/2501.07238v1)
- [OWASP — critères d’évaluation du red teaming IA](https://genai.owasp.org/2026/02/04/owasp-vendor-evaluation-criteria-for-ai-red-teaming-providers-tooling-v1-0/)
- [CaMeL et Dual LLM](https://simonwillison.net/2025/Apr/11/camel/)
- [Llama Guard 3 sur Workers AI](https://developers.cloudflare.com/workers-ai/models/llama-guard-3-8b/)
- [OWASP — Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP — System Prompt Leakage](https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/)
- [OWASP — GenAI Red Teaming Guide](https://genai.owasp.org/resource/genai-red-teaming-guide/)
- [OWASP — LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [Cloudflare — Workers AI bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Cloudflare — API D1](https://developers.cloudflare.com/d1/worker-api/d1-database/)
