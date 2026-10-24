# Feuille de route : l'IA du portfolio (décidé le 2026-10-24, à reprendre plus tard)

Le réseau de neurones du hero n'a de sens que s'il devient le visage d'une vraie IA. Une animation seule, ou une simple navigation qui ne sert qu'une fois, ne vaut pas la place qu'elle prend.

## Les trois fonctionnalités

### 1. Présentation vocale (voix clonée)
- Dans le hero, un bouton « Écouter ma présentation ».
- Le réseau pulse au rythme de l'audio : il devient l'avatar de la présentation.
- Un sous-titre défile pendant la lecture, pour l'accessibilité et pour qui regarde sans le son.
- Il faut les enregistrements de Jérémie, un texte validé et un service de synthèse vocale.

### 2. Chatbot sur le portfolio (RAG)
- Une bulle en bas à droite, sur tout le site, qui s'ouvre en petit panneau et se referme, comme la messagerie LinkedIn.
- Il répond à partir du contenu du site (`src/content`). Chaque réponse cite les sections utilisées, avec un lien pour y aller.
- Sur le hero, le réseau montre le chemin réel de la réponse : la question entre, les nœuds « sources » (les sections retrouvées) s'allument, la réponse sort. Un clic sur un nœud ouvre la section correspondante.
- Sur les autres sections, une version miniature du réseau est animée en haut du panneau.
- C'est le mode « recruteur » : sérieux, protégé contre les détournements.

### 3. Défi de jailbreak
- Dans le Lab, à côté du CTF, avec sa propre interface façon terminal. Le chatbot y renvoie avec un lien « Défier l'IA », mais ce n'est pas le même mode.
- Objectif : faire révéler à l'IA un flag caché dans ses instructions, avec plusieurs niveaux de garde-fous de plus en plus solides.
- Le réseau affiche chaque tentative et indique si les garde-fous l'ont bloquée. Le compteur « tentatives / bloquées » est réel, et un jailbreak réussi s'affiche aussi.

## Contraintes

- **Coûts de l'API** : une limite de messages par visiteur, gérée dans le Worker Cloudflare (`worker.js`).
- **Sécurité** : aucun vrai secret dans le défi, des instructions séparées entre le chatbot et le défi, des journaux sans données personnelles.
- **Performance** : le réseau 3D reste chargé seulement sur ordinateur. Sur mobile, le chatbot fonctionne sans l'animation. Lighthouse mobile doit rester à 90 ou plus.
- **Honnêteté** : afficher ce qui tourne vraiment, à savoir le modèle utilisé et ses limites.

## En attendant

- Épurer le hero.
- Garder le réseau seulement comme avatar, sans les entrées de navigation, avec une place réservée au bouton audio.
- `Neural3D` reste dans le dépôt pour ces étapes.

## Ordre proposé (une branche par étape)

1. Présentation vocale.
2. Chatbot.
3. Défi de jailbreak.
