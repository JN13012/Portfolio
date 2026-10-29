# Feuille de route IA

État au 29 octobre 2026 : Sentry est la mascotte du portfolio ; son chat public affiche
un message de conception. Les fiches préparées restent dans l’aperçu de développement.
La présentation vocale préenregistrée est intégrée pour les chapitres Intro, Fraude et Profil.
Les questions libres, les autres chapitres et le défi IA restent à développer.
Voir [l’architecture actuelle](architecture.md).

## Les trois fonctionnalités

### 1. Présentation vocale (voix clonée)
- À gauche de Sentry, bande de lecture à chapitres visible dès l’arrivée, sans lecture automatique ; chevron pour la réduire, choix conservé pendant la session.
- Intro, Fraude et Profil disponibles, avec enchaînement et sélection directe ; Projets, Parcours et Alternance restent désactivés.
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

## Ordre proposé (une branche par étape)

1. Présentation vocale.
2. Chatbot.
3. Défi de jailbreak.
