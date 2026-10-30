# Lab IA — parcours Sentry

Décisions du 30 octobre 2026. Ce document définit le parcours cible ; il ne décrit pas
neuf exercices déjà réalisés et n’autorise aucun déploiement.

## Intention

Faire découvrir la sécurité d’un assistant puis d’un agent IA avec une progression :
comprendre, attaquer, protéger et vérifier. Sentry conserve sa coque et son identité,
mais sa conversation de Lab reste indépendante du chatbot et de la présentation vocale.

« Red-team Sentry » est le titre envisagé. « Laboratoire IA » reste le titre actuel
de l’écran ; le nom n’est pas modifié par cette passe de contenu.
Le parcours comprend du red teaming et des exercices défensifs : ce n’est pas
la reproduction exhaustive d’une mission professionnelle.

## Neuf niveaux, quatre thèmes

| Thème | Niveau | Mission et compétence |
| --- | --- | --- |
| Injection directe | 01 — Consignes | Obtenir un flag fictif ; comparer consigne simple et instructions structurées. |
| Injection directe | 02 — Filtres | Comprendre les contrôles d’entrée et de sortie et identifier où une tentative est arrêtée. |
| Injection directe | 03 — Défenses combinées | Adapter sa démarche face aux protections précédentes et à un juge IA. |
| Injection indirecte | 04 — Document piégé | Modifier une fiche que Sentry doit résumer dans le cadre d’une demande légitime. |
| Injection indirecte | 05 — Sources et RAG | Faire rencontrer à Sentry un document manipulé parmi plusieurs sources ; comprendre la récupération et les frontières de confiance. |
| Agent et application | 06 — Agent et outils | Comprendre les outils accessibles et tenter une action interdite sur un agenda fictif. |
| Agent et application | 07 — Application et API | Découvrir les endpoints du scénario et tester la séparation entre utilisateurs. |
| Défense | 08 — Protéger l’assistant | Configurer des protections contre le détournement par un document sans empêcher les résumés légitimes. |
| Défense | 09 — Sécuriser l’agent | Limiter les outils, contrôler les droits sur les réservations et imposer les confirmations adaptées ; mission finale avec vérification avant/après. |

Les cinq niveaux d’injection directe de la première maquette sont condensés en trois :
consigne simple et instructions structurées deviennent deux configurations du niveau 01 ;
les filtres d’entrée et de sortie sont réunis au niveau 02 ; le juge complète le niveau 03.
La correspondance ne doit pas réutiliser silencieusement les anciens identifiants de progression.

## Progression et reconnaissance

- Commencer par un briefing guidé sur la mission et le périmètre, puis réduire les indices.
- Introduire la reconnaissance progressivement : sources, outils, accès et endpoints.
- Faire varier la surface contrôlable et le nombre d’étapes à comprendre, pas seulement le nombre de filtres.
- Calibrer la difficulté avec le modèle réel ; un juge IA ne garantit pas un exercice plus difficile.
- Ne pas ajouter de niveaux uniquement pour augmenter le compteur. Les quinze niveaux précédemment
  envisagés sont remplacés par ce parcours de neuf niveaux.
- Garder les scans réseau et services dans le Lab Cyber ; une extension IA nécessitant
  une infrastructure vulnérable utiliserait un environnement isolé ou une simulation annoncée.

## Injection indirecte

L’exercice doit permettre d’agir sur une source effectivement consultée par Sentry,
pas uniquement de saisir une attaque dans le chat : éditeur de fiche au niveau 04,
petite base documentaire contrôlée au niveau 05.
Une instruction hostile peut être visible : le point pédagogique est qu’un contenu
externe ne doit pas acquérir l’autorité d’une consigne.
Documents, identités, outils et effets restent propres au scénario ; aucune cible externe.

## Défense et validation

Aux niveaux 08–09, la console laisse place à une configuration guidée. Le schéma montre
les sources, protections, permissions et le chemin de chaque essai.

1. Observer un incident et sa trace.
2. Choisir/configurer une protection ; inclure des choix pertinents et insuffisants.
3. Rejouer des attaques et des tâches légitimes.
4. Comparer les résultats, expliquer l’impact, les faux positifs et les limites.

Tout bloquer ou désactiver tous les outils ne constitue pas une réussite.
Les autorisations sont appliquées par le serveur et les outils, pas seulement décrites
dans un prompt. La validation vérifie les conséquences dans l’environnement fictif,
pas uniquement une phrase de refus ni le verdict d’un juge LLM.
Les résultats restent limités au corpus testé ; aucune promesse d’invulnérabilité.
Chaque niveau offensif se termine aussi par une explication de la protection adaptée.

## Présentation et intérêt du projet

- Conserver le cadre, la typographie et les dimensions communes aux Labs Cyber et IA, avec la palette bleue de l’IA.
- Afficher les neuf niveaux regroupés sur l’écran d’entrée ; détails et indices dans le tiroir.
- Faire évoluer le panneau droit selon la surface : chaîne de traitement, documents, outils ou permissions.
- Prévoir un accès « Voir une démonstration » indépendant de la progression pour une découverte rapide ; non implémenté.
- Mettre en avant la méthode, les traces reproductibles, les corrections et leurs tests, plutôt que le nombre de niveaux.

## État réel et réalisation progressive

L’entrée affiche désormais le parcours prévu. Après « Commencer », l’aperçu conserve
les cinq niveaux simulés de la première maquette : leur console, leur tiroir et leurs
identifiants ne sont pas encore migrés vers les neuf exercices. Les résultats préparés
ne prouvent pas une attaque contre un modèle réel.

L’IA reste accessible uniquement en développement. Aucun modèle, API Lab, document
modifiable, outil agentique ou exercice défensif réel n’est connecté par cette passe.
Le [plan technique initial](plan-lab-ia.md) documente le prototype existant ;
ses cinq niveaux et exclusions initiales ne sont plus le périmètre cible du parcours.

Prochaines étapes :

1. Adapter l’état, la progression et le tiroir aux trois niveaux directs, sans présenter les autres comme jouables.
2. Connecter et calibrer un premier niveau avec un adaptateur de modèle et des limites serveur.
3. Ajouter les scénarios indirects, puis les outils et l’API du scénario.
4. Ajouter les deux niveaux de défense avec vérification avant/après.

Workers AI reste un candidat ; le modèle n’est pas fixé. Prévoir idempotence, isolation
des sessions, limites de débit, de tokens et de budget global avant ouverture publique.
Ne jamais confier de véritable secret au défi. Ne pas stocker de conversations brutes
sans nécessité. Réduire les mouvements et suspendre les animations invisibles.
Aucune création distante, migration distante ni publication sans autorisation.

Références de conception : [injections directes et indirectes OWASP](https://genai.owasp.org/llmrisk/llm01-prompt-injection/),
[guide de red teaming OWASP](https://genai.owasp.org/resource/genai-red-teaming-guide/),
[protections contre les injections](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).
