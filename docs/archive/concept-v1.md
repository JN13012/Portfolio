# Concept V1 — storyboard et messages clés

> Archive historique : ce document décrit des propositions antérieures, dont certaines ont été abandonnées.
> Pour le code et les choix actuels, consulter [l’architecture du projet](../architecture.md).

> Étape « concept et structure » décidée le 2026-10-17 après la première maquette (trop pauvre : noyau sans fonction, onglets de lentille inutiles, grille plate, textes faibles).
> **À valider par Jérémie avant tout prototype.** Une fois validé, `docs/archive/plan-v1.md` est mis à jour (§1 Lentilles, §4 Contenu).
> Références étudiées : [calendriercosmique.com](https://calendriercosmique.com/) (ouverture, noyau-interface, décor vivant en couches, événements) et [drisscosta.online](https://www.drisscosta.online/fr) (noir sobre, textes faits de preuves, liste de projets par année, présentation vocale).

---

## 1. Idée directrice

**Le site est la salle de contrôle d'une IA, vue depuis l'orbite.** Le noyau au centre est à la fois l'interface (on navigue avec lui) et le système défendu (il réagit aux attaques du visiteur). Le décor est vivant mais lent ; il y a peu de moments forts, chacun avec un sens. Sous le hero, la page devient sobre et typographique, à la manière de Driss Costa : les preuves parlent.

| On prend au Calendrier cosmique | On prend à Driss Costa | On ne prend pas |
|---|---|---|
| L'ouverture avec un bouton « Entrer » | Le noir profond et la sobriété des sections | Le site entier dans un seul écran qui tourne (mauvais pour les RH et le SEO) |
| Le noyau qui sert d'interface | Les textes faits de chiffres vérifiables | L'or, le style mystique |
| Le décor en couches, des événements ponctuels | La liste complète des projets classée par année | Le monochrome total : on garde cyan et orange |

Charte inchangée : graphite, blanc cassé, **cyan = IA**, **orange = menace**, Cormorant + Inter + JetBrains Mono.

---

## 2. Décor de fond : la Terre de nuit vue d'orbite

Il doit convenir à toutes les cibles (aéronautique et défense, banques, conseil, transport) et aux deux métiers (IA, cyber).

- **Couches**, de la plus lointaine à la plus proche :
  1. ciel profond et poussière d'étoiles ;
  2. le limbe de la Terre en bas de l'écran, une courbe fine éclairée de cyan ;
  3. les lumières des villes en points ;
  4. de rares arcs fins entre les villes (flux de données ou de transactions).
- **Événements ponctuels**, un toutes les 20 à 40 secondes : un satellite qui traverse ; une « étoile filante » orange (une attaque) interceptée par la coque du noyau, avec un éclair et une onde de choc discrète.
- Lien avec la V1.1 : le globe du parcours (Liban, Qatar, Arabie saoudite, Canada, Pérou, France) **est cette même Terre**, qui pivote quand on arrive à la section Parcours.
- Technique : SVG et Canvas 2D (pas de three.js pour le décor). Version allégée sur mobile, figée en `prefers-reduced-motion`.

---

## 3. Le noyau : astrolabe et iris blindé

**Anatomie**, de l'extérieur vers l'intérieur :
1. **Anneau de navigation** : 5 nœuds avec icône (IA, Cyber, Dev, Parcours, Contact).
2. **Anneaux gradués** en SVG, qui tournent lentement à des vitesses et dans des sens différents (graduations, numéros, petits textes en mono).
3. **Coque de garde-fous** : des segments qui s'allument en orange à l'impact.
4. **Iris blindé** : des lames qui s'ouvrent et se ferment comme un diaphragme.
5. **Cœur** : des particules en WebGL sur desktop, un cœur lumineux en SVG sur mobile.

**États :**

| État | Déclencheur | Réaction |
|---|---|---|
| Repos | — | Rotation lente, iris entrouvert, cœur qui « respire » |
| Survol d'un nœud | Souris ou focus clavier | Le nœud s'allume, un libellé apparaît, l'anneau tourne pour l'amener à l'axe |
| Navigation | Clic sur un nœud | L'anneau tourne, puis défilement vers la section ; IA, Cyber et Dev filtrent aussi les projets |
| Attaque | Étoile filante du décor ; plus tard, l'injection de prompt (V2) | Impact orange sur la coque, l'iris se ferme, éclair, onde de choc, puis réouverture |
| Flag trouvé | Un niveau du CTF validé (Lab) | Un anneau se « déverrouille » en cyan, compteur de niveaux sur la graduation |
| Mini-carte | Après le hero | Le noyau rétrécit dans un coin, reste cliquable et réagit toujours |

Tout le noyau est en SVG et en CSS, donc visible aussi sur mobile. Seul le cœur de particules est en WebGL et chargé à la demande. En `prefers-reduced-motion`, il est figé et les réactions passent par un changement d'état statique.

---

## 4. Storyboard de la page unique

| # | Section | Contenu | Moment fort |
|---|---|---|---|
| 0 | **Ouverture** | Noir. L'astrolabe se dessine, compteur d'initialisation lié au vrai chargement, le nom se forme. Boutons **Entrer** et **Passer**. | Le noyau s'assemble. Durée ≤ 3 s, une fois par visite, le contenu est déjà chargé derrière. |
| 1 | **Hero, la salle de contrôle** | À gauche : nom, titre, une phrase, disponibilité, CTA **CV** et **Contact**. Au centre-droite : le noyau et ses 5 nœuds. Derrière : la Terre de nuit. | Une attaque interceptée après quelques secondes. |
| 2 | **En 30 secondes** | Une bande de faits : 5 langues · 6 pays · MSc Epitech cybersécurité · Jr Penetration Tester · IBM AI Developer · ex-militaire · disponible immédiatement. | — |
| 3 | **Trois métiers** | Trois colonnes **IA / Cyber / Dev** : une phrase de positionnement, une ligne de preuves, deux dossiers liés. | En défilant, le nœud du métier s'allume sur la mini-carte. |
| 4 | **Dossiers** | 4 ou 5 études de cas en grands blocs (style Driss) : faits numérotés, stack, statut honnête, lien vers la page dossier. | — |
| 5 | **Tous les projets** | Tableau par année. **Filtres** : métier (IA, Cyber, Dev) et statut. **Tri** : date, envergure. | — |
| 6 | **Lab** | Le CTF (déplacé du hero, fonctionnement inchangé) et l'index des 25 write-ups (liens GitHub). | Chaque flag déverrouille un anneau du noyau. |
| 7 | **Parcours** | Timeline unique (militaire → sport automobile → blockchain → Salesforce → Epitech). | La Terre du décor pivote vers les pays traversés (version légère en V1, globe complet en V1.1). |
| 8 | **Compétences et certifications** | Regroupées par métier, sans pourcentage, liens de vérification. | — |
| 9 | **Contact** | Formulaire existant (Resend), e-mail, LinkedIn, GitHub. | — |

Navigation : la mini-carte du noyau et une barre discrète (Projets, Parcours, Contact, FR/EN), comme chez Driss.

---

## 5. Projets : filtre et tri (à la place des lentilles)

- **Filtres** : métier (IA, Cyber, Dev ; plusieurs au choix) et statut (production, test, développement, conçu). Ils reprennent l'esprit de l'ancien filtre par catégorie de `ProjectSection.jsx`.
- **Tri** : date (le plus récent d'abord, par défaut) et **envergure**. L'envergure remplace l'ancienne « complexité 1–5 » auto-attribuée : elle se calcule à partir de faits vérifiables (durée, taille de l'équipe, nombre de tests) et la grille est affichée.
- Les nœuds IA, Cyber et Dev du noyau appliquent le filtre du métier correspondant.
- L'état du filtre est dans l'URL (`?metier=cyber`). Un lien ciblé dans une candidature reste donc possible sans onglet visible.

---

## 6. Messages clés (brouillons à valider)

Règle : **des preuves, pas des slogans.** Chaque chiffre vient de `docs/archive/plan-v1.md` §4 et sera revérifié dans les dépôts à l'étape 2. Les mentions *(à vérifier)* demandent ta confirmation.

### Positionnement : la double compétence IA × cyber

Le fil rouge du site, décidé le 2026-10-17 : **développeur IA et pentester**, deux compétences réunies dans Argos (des agents IA appliqués à la cybersécurité). C'est le profil « AI securing AI » que cherchent CMA CGM, Thales, Airbus ou les banques. Le développement est le socle commun. La blockchain et le web3 sont un différenciateur, présent dans le parcours, un tag et un dossier, mais pas dans le titre, pour ne pas diluer le message.

### Hero — **option A retenue le 2026-10-17**

| | Titre | Phrase |
|---|---|---|
| **A ✓** | Développeur IA · Pentester junior | « Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque. » |
| **B** | IA × Cybersécurité | « Double compétence : je développe des systèmes d'IA et je les teste en attaquant. Argos réunit les deux : des agents IA au service de la cybersécurité. » |
| **C** | Développeur IA · Pentester junior | « Je développe des agents IA et je les attaque pour savoir où ils cèdent. » |

Sous la phrase, dans tous les cas, une ligne de preuves en mono : `IBM AI Developer Professional · TryHackMe Jr Penetration Tester · Argos : agents IA pour la cyber`.
Statut : Disponible immédiatement · Alternance (stage possible) · Marseille, mobile.

### Les trois colonnes

**IA**
- Positionnement : « Des agents et des applications LLM de bout en bout (RAG, transcription, orchestration), avec des garde-fous pensés dès la conception. »
- Preuves : IBM AI Developer Professional · Argos : architecture d'agents Capability → Workflow → Harness, premier module OSINT où chaque donnée garde sa provenance · 4 applications LLM issues du parcours IBM (RAG/FAISS, Whisper + Granite, LangChain, watsonx) · BlockTrader : règle « l'IA ne peut que réduire l'exposition ».

**Cyber**
- Positionnement : « Pentest web et Active Directory, avec une méthode documentée de bout en bout ; montée en compétence côté SOC. »
- Preuves : Jr Penetration Tester (TryHackMe, 95 h) · 25 write-ups publiés (web, AD, élévation de privilèges, cracking, rétro-ingénierie) · un audit sur une infrastructure réelle, avec autorisation · **SOC Level 1 en cours (50 % au 17/10/2026)**, voir ci-dessous.

**Dev**
- Positionnement : « Du code testé et automatisé, du prototype à la production. »
- Preuves : Développeur full-stack en alternance chez ULIT, sur Salesforce (01/2026 – 06/2026) · BlockTrader (46 tests, CI durcie, parité VectorBT, exécution serverless Cloud Scheduler → GitHub Actions) · ZeroDay (cœur déterministe testé, éditeur d'arbres maison).

### Formations en cours (règle d'affichage)

Un parcours non terminé s'affiche **dans un bloc « En cours », jamais dans les certifications obtenues** :
- un badge « En cours », une barre de progression, **la date de la mesure** (« 50 % au 17/10/2026 ») et un lien vers le profil TryHackMe public pour la vérification ;
- la valeur vit dans `src/content/` avec sa date, et se met à jour à la main (une progression non datée vieillit mal) ;
- à l'obtention, la formation passe dans les certifications avec son identifiant de vérification.

### Accroche humaine (bande « En 30 secondes » ou Parcours)

Le parcours atypique devient une preuve de la double compétence, plus qu'une motivation : « Ex-militaire (2e RIMa), mécanicien aux 24 Heures du Mans 2017, entrepreneur blockchain depuis 2018, aujourd'hui développeur IA et pentester. » *(à valider)*

---

## 7. Garde-fous (inchangés)

- L'ouverture ne bloque jamais la lecture : on peut la passer, elle ne s'affiche qu'une fois par session, le contenu est dans le DOM dès le départ, et elle est absente en `prefers-reduced-motion`.
- Lighthouse mobile ≥ 90, accessibilité ≥ 95, LCP < 2,5 s. Le WebGL ne sert qu'au cœur, il est chargé à la demande.
- Le noyau et ses nœuds sont utilisables au clavier, avec des libellés accessibles.
- Honnêteté : statut sur chaque projet, aucun chiffre non traçable, rien de « live » qui ne l'est pas.

---

## 8. Ce qu'on garde de l'étape 1

Les tokens, les primitives UI, TypeScript, le chargement différé et l'image de remplacement du WebGL, la page `/design.html` pour les prototypes. À jeter : la grille de fond, les onglets de lentille, le noyau sphérique actuel, les textes du hero.

## 9. Suite proposée

1. Tu valides ce document, ou tu l'amendes. Je mets à jour `plan-v1.md`.
2. **Prototype animé** de l'ouverture, du hero (noyau astrolabe et iris avec ses états) et du décor orbital, à voir en direct sur `/design.html`. On l'ajuste ensemble jusqu'à ce que le « wow » soit là.
3. Rédaction complète (étape 2), puis le reste des sections.
