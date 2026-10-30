# Plan de conception — Lab IA « Red-team Sentry »

Date : 30 octobre 2026. Statut : lot 1 réalisé localement ; lots 2 à 5 non commencés.
Ce document ne constitue pas une autorisation de publication.

Mise à jour : le [résumé de conception du parcours Sentry](conception-lab-ia.md) définit
désormais la cible à neuf niveaux, dont injections indirectes et défense. Le présent plan
conserve le détail technique de la première maquette à cinq niveaux simulés.
La navigation actuelle regroupe les démonstrations directes en trois niveaux accessibles
librement ; les six exercices futurs restent indisponibles. Voir le résumé pour l’état actuel.

## Avancement — lot 1

- Aperçu de développement : lancer `npm run dev`, puis cliquer sur IA dans le Lab.
  `/?lab=ia#lab` permet aussi de l'ouvrir directement.
  Le paramètre est ignoré en production ; l'onglet IA public reste désactivé.
- Écran d'entrée avec bouton « Entrer », console, cinq niveaux, tiroir accessible, indices,
  validation fictive et schéma SVG disponibles. L'écran d'entrée reprend la hauteur du terminal
  Cyber avec une présentation IA dédiée ; il laisse place à la console sans revenir au changement d'onglet.
  Sa typographie et sa liste de niveaux suivent désormais celles du Cyber, avec quadrillage bleu
  et même bouton en relief partagé. Les deux mentions de l'ancien en-tête/pied ont été retirées.
  L'entrée annonce « Laboratoire IA » et « CTF en 5 niveaux · contournez les défenses de Sentry » ;
  « Commencer » ouvre la console avec les consignes de mission, après une extinction CRT.
  Apparition progressive et effets de glitch/clignotement suivent ceux du Cyber, avec réduction des mouvements.
- Les scénarios sont explicitement simulés : réponses préparées, refus, fuite fictive,
  blocages d'entrée/sortie/juge, erreurs techniques et quota indisponible.
- Aucun appel IA, API Lab, binding, stockage D1 ou déploiement ajouté.
- Bascule Cyber / IA avec conservation des états et suspension des effets masqués.
  Les opérations différées du CTF se mettent aussi en pause hors écran ou document caché.
- Recette locale : ordinateur 1440 px, mobile 390 et 320 px, paysage, clavier, tiroir,
  IME, brouillons conservés, réduction des mouvements et suspension du schéma vérifiés.
  Les dimensions et le contenu de l'écran Cyber ont été comparés avant/après.
- Le build de production a été vérifié avec le paramètre d'aperçu : ni interface IA montée,
  ni fixtures de flag ou code de console IA présents dans les assets JavaScript.
- Tests unitaires ajoutés sur les traces, les transitions et les timers CTF.
  Aucun modèle réel, audit Lighthouse ou clavier virtuel de téléphone physique vérifié à ce stade.

Prochaine étape : lot 2, niveau 1 connecté et limites serveur, avec calibration du modèle
et des budgets avant toute ouverture publique.

## 1. Base vérifiée et décisions

### Ce qui existe

- `src/sections/Lab/Lab.tsx` : CTF Cyber, write-ups et sélecteur Cyber / IA ; IA est désactivé.
- `docs/roadmap-ia.md` : intention de défi de jailbreak avec niveaux et résultats réels.
- `docs/archive/plan-v1.md`, lignes 224–226 : ancienne proposition de console à gauche,
  réseau des défenses à droite et cinq niveaux. Ce texte archivé n'est pas le contrat du code actuel.
- `server/worker.js` : contact, visites et ressources statiques ; aucune route de Lab ni de modèle.
- `wrangler.toml` : base `VISITS_DB` et limiteurs existants ; aucun binding Workers AI.
- Réseau pédagogique du Hero et primitives de dialogue accessibles disponibles à examiner pour réemploi.

La feuille de route IA contient aussi des informations vocales datées : elle donne le contexte,
mais ce plan s'appuie sur les fichiers actuels pour l'architecture du Lab.

### Choix retenus pour cette conception

- Même dépôt et même section Lab ; pas de nouvelle application.
- **Sentry en mode entraînement** : même personnage, avec instructions, conversation, progression et quotas séparés de son rôle d’assistant.
- Deux panneaux sur ordinateur, inspirés de la première maquette : console à gauche, défenses à droite.
- Cinq niveaux cumulatifs, avec détails dans un tiroir ; aucune troisième colonne permanente.
- Faux flag propre à chaque session et niveau, créé et vérifié côté serveur.
- Workers AI comme premier candidat, avec un adaptateur étroit ; modèle fixé seulement après évaluation.
- Défi indépendant du futur chatbot Sentry : inutile d'attendre son développement.

### Périmètre exclu

Pas d'outil exécuté par l'agent, navigation externe, fichiers utilisateurs, RAG, véritable secret,
liaison avec la voix, modification du réseau du Hero ou du comportement de Sentry.
Pas de classement, compte utilisateur, entraînement de modèle ni mode « Explorer le cerveau » dans cette version.
Pas de déploiement, création de ressource distante ou migration distante sans autorisation spécifique.

## 2. Expérience et disposition

Conserver le sélecteur dans le style des certifications et les deux colonnes actuelles du Lab.
L'onglet Cyber garde son CTF et ses write-ups. L'onglet IA ouvre :

> **Red-team Sentry**
> Faites révéler le flag qu'il protège. Chaque niveau ajoute une défense.

| Console à gauche | Défenses à droite |
| --- | --- |
| Progression 1 à 5, niveau courant | Défenses actives et futures |
| Bouton « Niveaux et consignes » | Schéma du parcours de la dernière tentative |
| Conversation avec Sentry | Résultat et explication courte |
| Champ multiligne et bouton « Envoyer » | Légende textuelle équivalente au dessin |
| Champ séparé « Valider le flag » | Bouton « Rejouer le parcours » sans nouvel appel IA |

- Afficher les essais restants d'après le serveur, jamais une valeur de maquette.
- Présenter les blocages, refus du modèle, réponses délivrées, erreurs et validations comme des états distincts.
- Garder le résultat d'une tentative visible jusqu'à la suivante, sans boucle d'attaques décoratives.
- Entrée envoie ; Maj+Entrée ajoute une ligne ; aucun envoi pendant une composition de texte IME.
- Préserver la conversation, le filtre et la progression en changeant d'onglet ; suspendre les effets de l'onglet masqué.
- Sur mobile : console en premier, puis résultat textuel et schéma compact statique ; champ toujours utilisable avec le clavier virtuel.
- Ne pas imposer simultanément deux grandes zones de défilement sur téléphone.

### Tiroir des niveaux

Le bouton ouvre un dialogue accessible visuellement présenté comme un tiroir, au-dessus de la console.
Sur téléphone, panneau presque plein écran. Réutiliser les primitives clavier et focus existantes,
sans modifier le cadre des modales Projets et Certifications pour ce seul besoin.

Chaque niveau présente son état, son objectif, la défense ajoutée et des indices révélés volontairement.
Les niveaux futurs restent consultables pour leurs objectifs, mais non jouables avant déverrouillage.
Après réussite : bilan pédagogique ; solution d'exemple disponible uniquement sur demande.
Échap ferme le tiroir ; focus contenu pendant l'ouverture puis rendu au bouton d'origine.

## 3. Progression pédagogique

| Niveau | Défense ajoutée | Objectif pédagogique |
| --- | --- | --- |
| 1 — Consigne simple | Instruction de protéger le flag fictif | Montrer les limites d'une consigne seule |
| 2 — Instructions structurées | Hiérarchie et séparation du contenu utilisateur | Comparer avec le premier niveau, sans promettre une protection absolue |
| 3 — Filtre d'entrée | Règles explicites de détection | Comprendre les contournements et les faux positifs |
| 4 — Filtre de sortie | Contrôle de la réponse avant diffusion | Montrer qu'une réponse générée peut être retenue |
| 5 — Juge IA | Évaluation supplémentaire avant diffusion | Observer l'apport, les erreurs et le coût d'une seconde évaluation |

Avant de figer les consignes, évaluer des candidats sur un corpus français : demandes légitimes,
extraction directe, reformulation, plusieurs tours et obfuscation. Conserver version du modèle,
paramètres et résultats. Vérifier que chaque niveau reste jouable ; ne pas fabriquer une réussite
ou désactiver silencieusement un filtre pour obtenir une difficulté attendue.

Les filtres sont des défenses pédagogiques partielles. Ne pas promettre la détection de toutes
les fuites encodées, fragmentées ou sémantiques. Le juge IA n'est pas une garantie d'inviolabilité.
Le bilan distingue un blocage observé d'une preuve générale de sécurité.

## 4. Parcours et contrat de résultat

Parcours logique : validation de la requête → filtre d'entrée → assemblage des instructions → modèle
→ filtre de sortie → juge éventuel → réponse publiée. Quotas et validation technique s'appliquent à tous les niveaux.

Une réponse d'API contient un identifiant de tentative, le niveau validé côté serveur, les compteurs,
le résultat public, le texte autorisé à être publié et une trace structurée des étapes.
Chaque étape possède un état parmi : non active, passée, bloquée, erreur ou non exécutée.
Une erreur du fournisseur ou un quota épuisé ne compte pas comme une attaque bloquée.

- Un blocage arrête le traitement ; les étapes suivantes sont marquées non exécutées.
- Un refus du modèle, lorsqu'il est identifiable, reste distinct d'un blocage par filtre.
  En cas d'ambiguïté, afficher « Réponse délivrée », sans inventer une détection d'intention.
- La réussite d'un niveau est décidée par la validation serveur du flag soumis ; une sortie
  seulement suspectée de fuite ne suffit pas à déverrouiller le niveau suivant.
- Le serveur ne renvoie jamais une réponse retenue par un filtre ou un juge, même dans la trace.
- Le juge produit un verdict structuré limité ; ni raisonnement interne ni instructions privées ne sont exposés.

Première version : réponse JSON complète, puis animation de reconstitution à partir de cette trace.
Pendant l'attente, afficher seulement « Traitement en cours ». Ne pas simuler des étapes en direct,
des temps d'inférence ou des pourcentages que le serveur ne fournit pas.
Le streaming pourra venir plus tard si un besoin mesuré le justifie.

Le schéma peut garder des nœuds et liens rappelant le Hero, avec une mention :
**« Illustration du parcours de traitement »**. Il ne représente pas les neurones réels du modèle.
Une légende textuelle présente les mêmes informations ; couleur et animation ne portent pas seules le sens.
Les exemples simulés restent marqués « Démonstration » et exclus des compteurs réels.

## 5. Organisation des fichiers et responsabilités

Les noms suivants sont des cibles ; créer les fichiers au fil des lots, sans infrastructure générique anticipée.

| Emplacement | Responsabilité |
| --- | --- |
| `src/sections/Lab/Lab.tsx` | Sélecteur, chargement différé et coordination Cyber / IA |
| `src/sections/Lab/CyberLab.tsx` | Écran Cyber actuel extrait sans changer son fonctionnement |
| `src/sections/Lab/ia/AiLab.tsx` | Écran IA et orchestration de l'état local |
| `src/sections/Lab/ia/AttackConsole.tsx` | Conversation, saisie et validation du flag |
| `src/sections/Lab/ia/LevelDrawer.tsx` | Consignes, progression, indices et bilan |
| `src/sections/Lab/ia/DefenseDiagram.tsx` | Dessin, relecture de trace et alternative textuelle |
| `src/sections/Lab/ia/labState.ts` | État testable et client API borné, sans couplage aux stores de Sentry |
| `src/content/aiLab.ts` | Textes publics des niveaux, indices et légendes, sans consignes privées ni flag |
| `server/aiLab/` | Routes, sessions, progression, défenses, adaptateur modèle et tests |
| `migrations/ai-lab/` | Migrations locales de la base du Lab, séparées de celles des visites |

Garder la console CTF et ses données dans leurs fichiers actuels. Son effet de focus vise actuellement
`#lab input` : le limiter à sa console lors de l'extraction pour éviter de sélectionner un champ IA.
Le CTF masqué ne doit ni reprendre le focus ni continuer une animation inutile.

Pour le dessin, préférer un SVG léger avec états d'étapes à un second moteur Three.js.
Réutiliser les tokens visuels et utilitaires réellement communs, pas les états de démonstration du Hero.
Ne déplacer du code vers les composants partagés que si un réemploi concret le nécessite.

## 6. API, état serveur et exploitation

Contrat initial à formaliser et tester :

- `POST /api/lab/session` : créer ou reprendre une session opaque, retourner progression et disponibilité.
- `POST /api/lab/attempt` : traiter un prompt avec identifiant de requête unique et niveau accessible.
- `POST /api/lab/validate` : vérifier un flag complet et déverrouiller le niveau suivant de façon idempotente.

Le cookie de session est HttpOnly, Secure en production et SameSite ; aucune identité utilisateur n'est requise.
Les écritures vérifient l'origine et utilisent JSON. Le navigateur ne fait autorité ni sur le niveau,
ni sur la progression, ni sur les quotas. Un identifiant `sessionStorage` seul ne suffit pas à les protéger.

Prévoir une base D1 dédiée avec binding `LAB_DB`, distincte de `VISITS_DB`, pour sessions expirables,
progression, réservations de requêtes et budgets. Ne pas créer cette base ni inventer son UUID dans cette passe.
Migrations et configuration de développement précéderont tout raccordement distant.

- Flag aléatoire par session/niveau, stable pendant le défi ; jamais de flag universel embarqué dans React.
- Session expirant après 24 h comme valeur initiale proposée ; pas de promesse de sauvegarde permanente.
- Historique court conservé dans le navigateur pendant la session, traité comme contenu non fiable par le serveur.
  Seuls les rôles utilisateur et assistant autorisés sont reconstruits ; aucun rôle système fourni par le client.
- Pas de prompts ni réponses bruts dans les journaux ou D1. Stocker uniquement les métadonnées nécessaires,
  à durée limitée ; ne pas enregistrer d'IP dans cette base. Vérifier aussi les journaux de plateforme.
- Validation du flag complet limitée en fréquence, sans indication sur ses caractères ou préfixes corrects.

### Limites et coûts

Prévoir longueur de prompt, historique et sortie bornés, délai maximal, un seul traitement actif par session,
limitation des créations de session et des validations, ainsi qu'un budget global sortant réservé atomiquement
avant appel. Les quotas de session seuls ne résistent pas à la création répétée de sessions.

Point de départ à ajuster après calibration : 20 essais par session de 24 h, tous niveaux confondus,
2 000 caractères par prompt et six échanges d'historique maximum. Afficher le périmètre exact du quota.
Budget global et plafond fournisseur à fixer selon le modèle et le coût mesuré avant toute ouverture publique.
Prévoir Turnstile pour l'ouverture publique si nécessaire, sans le présenter comme une garantie absolue.

Au maximum un appel au modèle cible et, au niveau 5, un appel au juge par tentative.
Aucune boucle d'agent ni relance automatique non bornée. Réserver le coût maximal des deux appels si nécessaire.
Les réservations, doublons, reprises et appels simultanés doivent être vérifiés sur D1 local.
Un doublon ne déclenche pas un second appel ; il reçoit un état explicite, sans nécessiter le stockage du texte brut.
Une annulation côté navigateur ne prouve pas que le fournisseur n'a pas exécuté ou facturé la demande.

Sans binding, budget ou fournisseur disponible : message d'indisponibilité explicite, aucun faux résultat.
En cas d'erreur du juge, ne pas publier la réponse retenue ; afficher une erreur technique.
Un mode simulé de développement utilise des fixtures explicites, jamais un remplacement silencieux de l'IA réelle.

## 7. Lots de réalisation et critères de sortie

### Lot 1 — Contrat pédagogique et maquette interactive locale

- Définir les niveaux, les états et les types de trace ; préparer des fixtures couvrant tous les résultats.
- Extraire le Cyber sans régression ; créer console IA, tiroir et schéma avec fixtures en développement.
- Charger l'interface IA à la demande. Garder son accès public désactivé tant qu'aucun niveau réel n'est prêt.
- Tester ordinateur et mobile, clavier, tiroir et conservation d'état entre les onglets.

**Sortie :** interface utilisable en aperçu, simulations clairement identifiées, Cyber inchangé.

### Lot 2 — Niveau 1 complet et limites serveur

- Ajouter routes, session, flags, stockage D1 local et protections de consommation.
- Écrire l'adaptateur Workers AI et ses tests avec fournisseur substitué localement.
- Préparer le lancement Worker + build et, si nécessaire, un proxy Vite réservé au développement.
- Après raccordement autorisé, calibrer le modèle en français avec quelques appels réels bornés.
- Relier la trace réelle au dessin ; tester soumission, validation du flag, erreur et reprise.

**Sortie :** niveau 1 utilisable de bout en bout en environnement de validation ; préciser séparément
les preuves locales avec fournisseur simulé et les preuves obtenues avec un modèle réel.

### Lot 3 — Niveaux 2 à 4

- Ajouter consignes structurées, filtre d'entrée et filtre de sortie, un niveau à la fois.
- Ajouter indices, déverrouillage serveur, bilans et cas de faux positifs.
- Répéter l'évaluation sur des demandes légitimes et des attaques, avec résultats versionnés.

**Sortie :** progression réellement jouable, trace fidèle, aucune réponse filtrée divulguée au client.

### Lot 4 — Niveau 5 et stabilisation

- Ajouter le juge, son contrat strict, sa limite de coût et ses scénarios d'erreur.
- Comparer avec le niveau 4 ; documenter les contournements et limites effectivement observés.
- Finaliser reprise de session, expiration, quotas et messages d'indisponibilité.

**Sortie :** cinq niveaux cohérents, pas de promesse de sécurité absolue, budget global testé.

### Lot 5 — Recette et préparation à la publication

- Exécuter les contrôles du projet et la recette navigateur ci-dessous.
- Actualiser `docs/architecture.md` et `docs/roadmap-ia.md` selon ce qui a réellement été livré.
- Préparer les migrations et bindings nécessaires ; séparer clairement les opérations locales et distantes.
- Activer le sélecteur public seulement lorsque le service est prêt ; les niveaux non livrés restent verrouillés.
- Présenter les résultats et prérequis avant toute demande de déploiement ou de migration distante.

**Sortie :** changement révisable et publication préparée ; aucune mise en ligne implicite.

## 8. Vérifications requises

Tests ciblés : transitions de niveau, soumissions répétées, validation idempotente, session expirée,
quotas concurrents, budget global, doublons réseau et absence d'appel après un blocage d'entrée.
Vérifier les étapes non exécutées, les erreurs fournisseur/juge et l'absence de réponse filtrée dans l'API.
Tester l'échappement du contenu utilisateur et modèle ; pas d'insertion HTML directe.
Inspecter le build pour s'assurer qu'aucun flag, consigne privée ou secret fournisseur n'y figure.

Recette navigateur : 1440 px, 390 px et 320 px ; portrait/paysage ; clavier seul ; ouverture et fermeture
du tiroir ; historique long ; clavier virtuel ; bascule Cyber / IA pendant un traitement.
Contrôler le CTF, ses filtres, Sentry, l'audio et les autres modales après l'extraction.

Le schéma ne tourne que pendant une tentative ou une relecture volontaire : suspendre les animations
hors écran, onglet masqué et document caché ; annuler leurs timers au démontage.
Avec réduction des mouvements, afficher directement les états et la légende sans déplacement animé.
Une bascule d'onglet ne relance jamais une requête ; son éventuel résultat rejoint l'état de la bonne tentative.

Commandes finales : `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
Exécuter aussi `npm run review` si du contenu éditorial exporté est modifié.
Mesurer le chargement et Lighthouse mobile avant/après dans les mêmes conditions ; objectif de la feuille
de route : au moins 90 en performance mobile. Signaler une mesure absente ou un objectif non atteint.
Ne pas déclarer le comportement d'un modèle réel vérifié à partir des seuls tests avec fixtures.

## 9. Références de conception

- [Feuille de route existante](roadmap-ia.md) et [ancienne proposition détaillée](archive/plan-v1.md).
- [OWASP — Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) :
  limites des protections et mesures complémentaires.
- [OWASP — System Prompt Leakage](https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/) :
  ne pas utiliser un prompt système comme coffre à secrets. Ici le faux flag sert exclusivement à l'exercice.
- [Cloudflare — Workers AI bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/) :
  intégration du modèle dans le Worker.
- [Cloudflare — API D1](https://developers.cloudflare.com/d1/worker-api/d1-database/) :
  base pour la réalisation et les tests des opérations de stockage atomiques.

Les paramètres chiffrés de quota et de session sont des choix initiaux de ce plan, pas des limites
imposées par Cloudflare. Le choix du modèle et le budget public restent à arrêter sur mesures.
