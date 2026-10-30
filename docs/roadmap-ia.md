# Feuille de route IA

État au 30 octobre 2026 : Sentry est la mascotte du portfolio ; son chat public affiche
un message de conception. Les fiches préparées restent dans l’aperçu de développement.
La présentation vocale préenregistrée est intégrée pour les chapitres Intro, Fraude, Profil et Projets.
Les questions libres, les autres chapitres et le défi IA restent à développer.
Voir [l’architecture actuelle](architecture.md). L’ordre de réalisation est dans le [plan de travail](plan-travail.md).

## Les trois fonctionnalités

### 1. Présentation vocale (voix clonée)
- À gauche de Sentry, bande de lecture à chapitres visible dès l’arrivée, sans lecture automatique ; chevron pour la réduire, choix conservé pendant la session.
- Intro, Fraude, Profil et Projets disponibles, avec enchaînement et sélection directe ; Parcours et Alternance restent désactivés.
- Le réseau et Sentry s’activent pendant la lecture réelle, sans analyse d’amplitude sonore.
- Bulle au-dessus de Sentry : barres illustratives et phrases du texte validé, recalées localement sur l’audio ; même affichage dans le chat ouvert.
- Pas de service de synthèse ni de clonage exécuté par le portfolio : le fichier est pré-généré.

### 2. Questions libres sur le portfolio
- Une bulle en bas à droite, sur tout le site, qui s'ouvre en petit panneau et se referme, comme la messagerie LinkedIn.
- Il répond à partir du contenu du site (`src/content`). Chaque réponse cite les sections utilisées, avec un lien pour y aller.
- Sur le hero, le réseau montre le chemin réel de la réponse : la question entre, les nœuds « sources » (les sections retrouvées) s'allument, la réponse sort. Les nœuds illustrent les sources ; la navigation reste dans la barre et les liens du chat.
- Sur les autres sections, une version miniature du réseau est animée en haut du panneau.
- C'est le mode « recruteur » : sérieux, protégé contre les détournements.

### 3. Défi de jailbreak

Lot 1 réalisé localement le 30 octobre 2026 : aperçu interactif accessible par le sélecteur IA
en développement (ou directement via `/?lab=ia#lab`),
avec trois niveaux directs simulés, console, tiroir de parcours et schéma des défenses. Aucun modèle
ni API connecté ; accès public IA toujours désactivé. Prochaine étape : niveau 1 réel et quotas serveur.
Voir le [plan de conception et son avancement](plan-lab-ia.md).
Le [parcours cible Sentry](conception-lab-ia.md) prévoit désormais neuf niveaux :
trois directs, deux indirects, deux sur l’agent/application et deux de défense.
L’écran d’entrée et le tiroir les annoncent ; les trois niveaux directs sont accessibles,
les six suivants restent « À venir ». Les deux Labs proposent le retour à la présentation
et la sélection directe des niveaux disponibles, sans valider les niveaux sautés.

- Dans le Lab, à côté du CTF, avec sa propre interface façon terminal. Le chatbot y renvoie avec un lien « Défier l'IA », mais ce n'est pas le même mode.
- Objectif : faire révéler à l'IA un flag caché dans ses instructions, avec plusieurs niveaux de garde-fous de plus en plus solides.
- Le réseau affiche chaque tentative et indique si les garde-fous l'ont bloquée. Le compteur « tentatives / bloquées » est réel, et un jailbreak réussi s'affiche aussi.

## Contraintes

- **Coûts de l'API** : une limite de messages par visiteur, gérée dans le Worker Cloudflare (`server/worker.js`).
- **Sécurité** : aucun vrai secret dans le défi, des instructions séparées entre le chatbot et le défi, des journaux sans données personnelles.
- **Performance** : le réseau 3D reste chargé seulement sur ordinateur. Sur mobile, le chatbot fonctionne sans l'animation. Lighthouse mobile doit rester à 90 ou plus.
- **Honnêteté** : afficher ce qui tourne vraiment, à savoir le modèle utilisé et ses limites.

## Base existante

- `src/components/Sentry/` : fenêtre de chat, mascotte, questions préparées et états visuels.
- `src/lib/assistantStore.ts` : conversation partagée avec le Hero.
- `src/sections/Hero/core/` : réseau 3D et fallback 2D.
- `dev/mockups/NetworkTuner.tsx` : réglage du même moteur en développement.

## Ordre

Décidé dans le [plan de travail](plan-travail.md) : présentation vocale (déjà en grande partie intégrée),
défi de jailbreak, fiches préparées de Sentry, puis questions libres.
