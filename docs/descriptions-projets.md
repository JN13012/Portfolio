# Descriptions des projets : lot 1, version 2 (2026-10-26)

À valider ou corriger par Jérémie : écris « OK » ou ta version sous chaque bloc, je reporterai dans `src/content/projects`.

Sources relues pour cette version : dépôts locaux (`~/work/Block-Trader`, `Argos`, `ZeroDay`, `Lab_CTF`), GitHub (`Code-Executor---Salesforce`, `CyberPong`, `Unit_converter`), le coffre Obsidian (`Work/Argos/*`, comptage des notes) et `ctfData.js`.

---

## 0. Trois changements de forme, valables pour tous les projets

### 0.1 Une accroche pour la carte
La carte n'affiche que 2 lignes, soit environ 90 caractères. Chaque projet reçoit une **accroche** (une phrase complète, 90 caractères maximum). Le **résumé** reste dans la fenêtre.

### 0.2 Les chiffres de la fenêtre : de l'envergure, plus des tests
Tu as raison : « 62 tests » ne dit rien à un recruteur. Le nombre de tests est une preuve de rigueur, pas une mesure de ce que fait le projet.

**Nouvelle règle proposée** : 3 ou 4 chiffres d'**envergure** par grand projet, c'est-à-dire ce que le projet couvre ou fait (stratégies, domaines, niveaux, classes…). Chaque chiffre reste vérifiable dans un dépôt ou un document. Le nombre de tests passe dans le texte de l'angle « dev », là où il a du sens.

### 0.3 Des listes plutôt que des pavés
Les sections de la fenêtre (Le problème, L'architecture…) ont souvent 4 ou 5 phrases d'affilée. Je propose le même format que les certifications : **une phrase d'intro, puis une courte liste** avec un mot en gras par ligne. Il faut ajouter un champ `points` aux sections ; c'est un petit changement.

---

## 1. BlockTrader

**Accroche (80 car.)**
> Bot de trading crypto en test : 40 stratégies validées contre le surapprentissage.

**Résumé**
> Bot de trading crypto en phase de test, sans fonds réels : 40 stratégies sur BTC et ETH, validées par une méthode statistique, et un observatoire du marché. Une IA doit ensuite choisir les stratégies ; elle n'est pas encore branchée.

**Chiffres**

| Avant | Proposé | Source |
|---|---|---|
| 56 tests | **40** stratégies | page Stratégies du tableau de bord |
| 3 349 essais enregistrés | **6** familles de stratégies | idem |
| 13 protocoles pré-enregistrés | **11** indicateurs de marché suivis | `blocktrader/data/observatoire.py` (11 sources) |
| 0 € de fonds réels engagés | **0 €** de fonds réels engagés (je le garde : c'est un gage d'honnêteté) | `docs/SAFETY.md` |

Le nombre d'essais (3 973 aujourd'hui) reste dans le texte, mais il n'est plus en vitrine.

**Sections raccourcies**

- **Le problème** : la plupart des backtests sont trop beaux pour être vrais. À force d'essayer des variantes, une stratégie finit par « marcher » par hasard ou par utiliser sans le savoir des données du futur. Une IA branchée dessus ne ferait qu'amplifier l'erreur.
- **Les stratégies** : 40 stratégies réparties en 6 familles.
  - **Méthode** : chaque protocole est écrit avant le calcul.
  - **Registre** : chaque essai est inscrit au registre, échecs compris (3 973).
  - **Correction** : les résultats sont corrigés du nombre d'essais.
  - **Validation** : une période de test mise de côté ne sert qu'une fois.
- **La data et l'architecture**
  - **Observatoire** : 11 indicateurs publics, sans clé ni compte (financement des perpétuels, volatilité implicite, Fear & Greed, stablecoins, réserves des bourses, rapport COT du CME…), historisés et datés.
  - **Moteur** : Python compilé avec numba, recoupé avec VectorBT.
  - **Paper trading** : toutes les 4 h sans serveur (Cloud Scheduler déclenche GitHub Actions), sur des cotations Uniswap v3 lues sur Ethereum et Arbitrum ; tableau de bord React.
- **La sécurité**
  - **Aucun secret** : aucune clé privée, aucune signature, aucun fonds.
  - **CI** : au moindre privilège, actions épinglées par empreinte.
  - **Données** : une donnée manquante met le bot en pause, jamais en position.
  - **Contrôle** : un test injecte une stratégie qui triche avec le futur et vérifie qu'elle est détectée.
  - **Passage au réel** : l'architecture de garde est conçue, pas codée.
- **Où en est le projet** : le banc d'essai a montré qu'aucune stratégie n'est statistiquement prouvée sur l'historique. Le test en conditions réelles (sans argent) tourne depuis le 8 octobre 2026 : un verdict sur l'exécution est prévu en janvier 2027, et la performance se jugera sur au moins un an.
- **La suite : le pilotage par IA** : l'IA n'est pas encore branchée. Elle choisira parmi les stratégies validées, et une règle est déjà écrite : elle pourra réduire l'exposition ou mettre en pause, jamais acheter.

## 2. Argos (projet personnel)

C'est corrigé : je retire « projet de fin d'études Epitech », et Argos reste classé « personnel ».

**Vérification de ta roadmap.** Elle est conforme à ta note Obsidian `Work/Argos/Vision Version.md` (V1 à V6, 23 sous-étapes, plus un « socle commun dès V1 »). Deux points à trancher :
1. **OSINT** : il est présenté comme le module déjà en cours (validé le 26/10).
2. Ton Product Brief (v2.4, juillet) définit Argos comme une plateforme de **pentest offensif piloté par IA**. La roadmap V1–V6 va plus loin : V5 couvre la surveillance et la réponse aux incidents. La vision ci-dessous suit la roadmap, la plus récente (24/10).

**Accroche (88 car.)**
> Plateforme de cybersécurité pilotée par IA pour les PME, du web à l'industrie, en 6 étapes.

**Résumé**
> Une plateforme de cybersécurité pilotée par IA, pensée pour les PME sans équipe cyber : auditer, surveiller et faire corriger leur sécurité, avec une validation humaine à chaque étape. Le moteur OSINT est en développement : collecte, scraping, analyse et corrélation de données publiques, avec la source de chaque donnée. Les agents IA sont conçus, pas encore codés.

**Sections (remplacent « Le moteur » et « Le cadre légal »)**

- **La vision** : beaucoup de PME dépendent de leur informatique sans avoir les moyens d'un pentest régulier ni d'une équipe sécurité. Argos veut leur apporter une démarche professionnelle et continue. L'IA assiste, mais les capacités essentielles fonctionnent sans elle.
- **Ce qu'Argos couvrira**
  - **V1 · Applications web** : audit externe, authentification et sessions, API, code source et CI/CD.
  - **V2 · IA, LLM et agents** : prompt injection et fuites, RAG et bases vectorielles, agents, outils et MCP.
  - **V3 · Réseau et infrastructures** : exposition Internet, réseau interne, Windows, Linux, stockage, sauvegardes.
  - **V4 · Identités, messagerie et cloud** : Microsoft 365, Active Directory, cloud, conteneurs et Kubernetes.
  - **V5 · Surveillance et réponse aux incidents** : détection, investigation, réponse et reprise.
  - **V6 · Environnements spécialisés** : mobile, objets connectés et firmware, industrie (OT).
- **Le socle commun, dès la V1** : inventaire, risques, preuves, rapports, suivi des corrections, protection des données et validation humaine. Les règles sont fixées par écrit avant le code : sources publiques ou API officielles, mandat et périmètre non contournables.
- **Le moteur OSINT, en cours** : il sert de base à tout le reste.
  - **Collecte** : API publiques, crawling et scraping de sites web.
  - **Traitement** : nettoyage, analyse, corrélation, avec la source et la date de chaque donnée.
  - **IA et NLP** : comprendre les textes collectés, classer et rapprocher les profils.
  - **Usages** : prospection ciblée et cartographie d'une surface d'attaque.
    - Exemple de prospection : trouver des PME, hôtels, garages ou artisans qui pourraient avoir besoin d'un agent vocal, d'un site refait ou d'un pentest.
    - Avant un audit, la même recherche sert à cartographier ce que la cible expose.
- **Où en est le projet** : la première brique du moteur OSINT est codée. Elle recherche des entreprises dans la base publique SIRENE de l'INSEE, garde la source et la date de chaque donnée et produit un rapport lisible. Le crawling, l'analyse, l'IA, les étapes V1 à V6 et les agents sont conçus, pas encore développés.

**⚠ Point d'attention : la recherche de personnes.** Chercher des *personnes* par centres d'intérêt ou par profession (par exemple des fans de jeux vidéo pour promouvoir ZeroDay) touche aux données personnelles. Le RGPD l'encadre fortement : il faut une base légale, une information des personnes, et la prospection par email vers des particuliers exige leur consentement. Ton propre cadre (`CADRE.md`) dit d'ailleurs « organisations plutôt que personnes ». Sur un portfolio lu par des RSSI et des recruteurs cyber, l'exemple « lister des particuliers selon leurs goûts » risque de faire mauvaise impression. Je propose donc d'afficher la prospection **d'entreprises**, et de ne pas mettre l'exemple ZeroDay. Si tu veux garder les personnes, j'ajoute « dans le respect du RGPD ».

**Chiffres**

| Avant | Proposé | Source |
|---|---|---|
| 62 tests | **6** domaines de sécurité prévus | `Vision Version.md` |
| | **23** périmètres d'audit | idem (V1.0 à V6.2) |
| | **1er** module en développement : OSINT | README du dépôt |

## 3. Pentest : write-ups et audit

**Tes questions**
- **« Premier audit web professionnel »** : oui. Pour un recruteur, c'est l'information la plus importante du projet. Le mot « professionnel » est juste : un vrai client, une infrastructure réelle, un rapport.
- **Le parcours Jr Penetration Tester** : je suis d'accord, c'est redondant avec la section Certifications. Je le retire du résumé et des chiffres.
- **Exegol** : c'est corrigé, j'écris « 10 machines Exegol », sans Epitech ni T-SEC-600.
- **La date** : tes write-ups continuent, donc je retire la date de fin. La carte affichera « En cours ». Le statut actuel « Terminé » serait faux. Je propose un statut **« En continu »**, plus juste que « En développement » pour une série de rapports.
- **Séparer l'audit des write-ups ?** Je déconseille. L'audit est confidentiel : sans client ni résultats, une carte à part n'aurait presque rien à montrer. Je le mets plutôt **en tête du projet** et dans le titre.

**Titre** : « Pentest : audit professionnel et write-ups »

**Accroche (68 car.)**
> Un premier audit web professionnel et 25 rapports de pentest publiés.

**Résumé**
> Un premier audit de sécurité web professionnel, mené dans un cadre autorisé sur une infrastructure réelle, et 25 rapports de tests d'intrusion publiés, enrichis au fil de l'entraînement.

**Sections**
- **Le premier audit professionnel** : audit web d'environ 20 heures, autorisé, sur une infrastructure réelle, conclu par un rapport technique. Le client et les résultats restent confidentiels.
- **Une méthode documentée** : chaque rapport suit le même standard (métadonnées, déroulé de la reconnaissance au résultat, enseignements). Les rapports couvrent 10 machines Exegol et 15 salles TryHackMe, sur le web, Active Directory, Linux, Windows et la rétro-ingénierie.

**Chiffres** : **1** audit professionnel (≈ 20 h) · **25** write-ups publiés · **5** domaines couverts (web, AD, Linux, Windows, rétro-ingénierie).

## 4. ZeroDay

**Ce que disent tes documents** (Vision canonique v1.14) : c'est un **jeu mobile**. Les builds de développement tournent sur le web.

**Ajouté par Jérémie le 26/10** (pas encore dans les documents du dépôt, donc présenté comme prévu) :
- un **multijoueur avec classement** ;
- une **V2 où l'on incarne l'humanité**, face au malware.

**Accroche (85 car.)**
> Jeu mobile de stratégie : incarner un malware qui se propage, face aux défenses du monde.

**Résumé**
> Jeu mobile de stratégie, en conception : le joueur incarne un malware qui se propage dans le monde entier, pendant que les pays réagissent, se défendent et construisent un remède. Inspiré de Plague Inc., mais sur les infrastructures numériques. Un multijoueur avec classement et une version où l'on joue l'humanité sont prévus.

**Sections**
- **Le concept** : le joueur ne contrôle pas une armée. Il fait évoluer un code malveillant, exploite les dépendances numériques des sociétés et provoque des pannes en chaîne. Chaque pays réagit à sa façon, et le monde coopère pour bâtir un « Neutralisateur ».
- **L'envergure prévue**
  - **9 classes de malware** : Ver, Trojan, Virus polymorphe, RAT, Rootkit, Botnet, Ransomware, Wiper, IA rogue.
  - **3 arbres d'évolution** : Propagation, Adaptation, Impact.
  - **3 difficultés** : Facile, Normal, Brutal.
  - **Une carte du monde pays par pays**, avec 28 types de cibles (PC, smartphones, objets connectés, véhicules, data centers…).
  - **Une progression permanente** entre les parties.
  - **Prévu ensuite** : un multijoueur avec classement, et une V2 où l'on joue l'humanité qui se défend.
- **La conception d'abord** : tout le game design est écrit et versionné avant le code, soit environ 141 000 mots, un registre des décisions et des termes alignés sur MITRE ATT&CK.
- **La technique** (version simplifiée de « La fondation technique ») : le jeu est sous Unity en C#. Une partie peut être rejouée à l'identique, ce qui permet de tester et d'équilibrer le jeu. Un éditeur web fait maison sert à dessiner les arbres d'évolution.
- **Où en est le projet** (nouveau, oui c'est utile) :
  - les arbres Propagation et Adaptation sont figés ;
  - l'arbre Impact est en cours ;
  - le premier prototype jouable (Ver, carte du monde, propagation, victoire) viendra une fois le game design terminé.
  - Le jeu n'est pas encore jouable. Le dépôt est privé.

**Chiffres** : **9** classes de malware · **3** arbres d'évolution · **3** difficultés · **≈ 141 000** mots de game design.

## 5. Code Executor (Salesforce)

Lu dans le dépôt GitHub (privé), 41 commits du 21/01 au 27/02/2026. Le travail s'est poursuivi sur un autre dépôt GitHub, celui de l'entreprise, auquel je n'ai pas accès. Le chaînage vient de toi (26/10).

**Accroche (88 car.)**
> Éditeur Apex dans Salesforce : chaînage de scripts, planification, logs. En production.

**Résumé**
> Outil interne pour écrire, exécuter, enchaîner et planifier des scripts Apex directement dans Salesforce, avec la trace de chaque exécution et de chaque version. Utilisé en production chez ULIT.

**Section « Ce qu'il fait »**
- **Exécution** : le code Apex est lancé par l'API Tooling. Les erreurs sont localisées à la ligne et à la colonne, avec coloration syntaxique.
- **Chaînage de scripts** : A, puis B si A réussit, puis C si B réussit. Au premier échec, la chaîne s'arrête et un message d'erreur est envoyé.
- **Logs** : niveaux de log réglables par catégorie (Apex, base de données, appels externes…). Les journaux bruts sont sauvegardés avec chaque exécution, suivis et téléchargeables.
- **Sessions** : plusieurs exécutions regroupées dans un même journal.
- **Sauvegarde et versions** : chaque script est enregistré avec un nom et une version automatiques. Une modification crée la version suivante. Historique des versions, import et export.
- **Planification** : exécution unique, quotidienne ou hebdomadaire, avec la liste des tâches et leur suppression.
- **Historique** : toutes les exécutions d'un script, et la dernière affichée à côté de son nom.
- **Droits** : les droits d'accès Salesforce sont vérifiés avant chaque lecture ou écriture.

**Stack** : Apex, Lightning Web Components, JavaScript, API Tooling, HTML, CSS.

**Réponses de Jérémie (26/10)**
- **Utilisateurs** : toutes les équipes QA et dev d'ULIT, environ 20 personnes.
- **Période** : de 01/2026 à 06/2026, c'est-à-dire la fin de son contrat. L'outil est toujours en production.

**Chiffres** : **≈ 20** utilisateurs (équipes QA et dev) · **3** fréquences de planification (unique, quotidienne, hebdomadaire).

**Résumé, version finale**
> Outil interne pour écrire, exécuter, enchaîner et planifier des scripts Apex directement dans Salesforce, avec la trace de chaque exécution et de chaque version. Utilisé par les équipes QA et dev d'ULIT (une vingtaine de personnes), toujours en production.

## 6. CTF du portfolio

**Accroche (78 car.)**
> CTF en 9 niveaux jouable sur ce site : attaquer une machine, puis la défendre.

**Résumé**
> Un CTF jouable dans le Lab de ce site, dans un terminal simulé. On attaque d'abord une machine fictive, de la reconnaissance à l'exploitation, puis on passe côté défense : analyser l'attaque, la contenir et durcir l'infrastructure. La progression est gardée dans le navigateur.

**Section « Les 9 niveaux »**
- **Attaque**
  1. **Reconnaissance** : un flag caché dans le code source de la page.
  2. **Commandes Linux** : fouiller les fichiers avec `find` et `grep`.
  3. **Scan de services** : énumérer les ports et les versions avec `nmap`.
  4. **Exploitation web** : découvrir des pages cachées (`gobuster`), puis une injection SQL (`sqlmap`).
  5. **Mots de passe** : casser des empreintes MD5 (`john`, `hashcat`), puis se connecter en SSH.
  6. **Exploitation système** : la faille SMB MS17-010 avec Metasploit.
- **Défense**
  7. **SOC** : retrouver l'IP de l'attaquant dans un SIEM type Splunk.
  8. **Forensique** : analyser le binaire, retrouver le processus malveillant et l'arrêter.
  9. **Durcissement** : pare-feu, WAF et IDS (Snort).

**Chiffres** : **9** niveaux · **2** rôles (attaquant, puis défenseur) · **21** commandes et outils simulés.

**Période** : d'après git, le CTF a été fait du 29/04 au 28/05/2026. Je mets 04/2026 → 05/2026, soit 2 mois (la fiche disait 05 → 06 et 5 mois).

## 7. Base de connaissance

**Mis à jour** : il y a aujourd'hui **728 notes** (659 le 17/10).

**Accroche (82 car.)**
> 728 notes Obsidian : cours, méthodes de pentest et notes de projets, cyber, IA et dev.

**Résumé**
> Une base de connaissances personnelle sous Obsidian, tenue au fil des formations et des projets : notes de cours, méthodes, cheatsheets et retours d'expérience.

**Section « Ce qu'elle couvre »**
- **Cybersécurité (414 notes)** : 370 notes de cours TryHackMe et 43 fiches de méthode pentest.
- **Projets (257 notes)** : conception et suivi d'Argos, BlockTrader, ZeroDay…
- **IA (34 notes)** : le parcours IBM AI Developer.
- **Salesforce (10 notes)** et **DevOps (7 notes)**.

**Chiffres** : **728** notes · **5** domaines.

## 8. Argos Security Arena

**Ce que j'ai trouvé**
1. **Le dépôt `Lab_CTF` ne s'appelle plus « Argos Security Arena »** : son README le présente comme **« Atlas Academy »**. C'est une plateforme d'apprentissage façon TryHackMe, avec deux domaines :
   - la **cyber**, ouverte ;
   - l'**IA**, en aperçu.

   Elle contient 13 modules et 10 salles machines. C'est un front seul : il n'y a pas encore de backend ni de comptes. Le dernier commit date du 02/10.
2. **Ton Product Brief Argos dit qu'Argos et Argos Arena sont deux produits indépendants** (dépôts, bases et déploiements séparés). Le résumé actuel, « elle deviendra l'arène d'Argos », est donc **à corriger**.

**Ta question : pour les humains, les agents IA, ou les deux ?** Je recommande **« les humains d'abord, les agents IA ensuite »** :
- **Ce qui existe sert les humains** : des parcours, des salles et une progression.
- **Pour les agents IA, c'est le Brief qui le prévoit** : un « cyber range » qui sert aussi de banc d'essai pour les agents. C'est encore du design, donc je l'écris comme une direction, pas comme une fonctionnalité.
- **Le croisement cyber et IA te distingue** : ton étude de marché du 01/10 en fait ta différence, et ça colle à ton profil.

**Accroche (84 car.)**
> Plateforme d'entraînement cyber et IA façon TryHackMe, en pause : 13 modules, 10 salles.

**Résumé**
> Une plateforme d'entraînement pratique en cybersécurité et en IA : parcours, modules, salles et progression, sur le modèle de TryHackMe. Elle est en pause : l'interface existe, le backend et les machines réelles restent à faire. À terme, elle doit aussi servir de banc d'essai aux agents IA de sécurité.

**Nom affiché** : « Argos Security Arena » (choix de Jérémie, 26/10).

---

## 9. Archives : CyberPong et Unit Converter

### CyberPong
**Accroche (76 car.)**
> Mon premier jeu vidéo : un Pong futuriste où 7 virus déforment la partie.

**Résumé**
> Mon premier jeu vidéo, en Python. Une introduction scénarisée façon terminal de hacker « infecte » le jeu. Ensuite, à chaque niveau, un nouveau virus change les règles.

**Les 7 virus**
- **Shrinking Virus** : les raquettes rétrécissent.
- **Hyper Worm** : la balle accélère.
- **Crazy Virus** : les rebonds partent dans des angles aléatoires.
- **Interference** : l'écran tremble.
- **Trojan Distortion** : la balle rétrécit.
- **Firewall Block** : un mur-obstacle apparaît au milieu.
- **Critical Error** : l'écran clignote en continu.

En plus : une musique et un son par virus, un score, un chronomètre, et l'introduction qu'on peut passer avec Échap.

### Unit Converter
**Accroche (73 car.)**
> Convertisseur d'unités en Python : 8 catégories, en terminal et en interface.

**Résumé**
> Un outil Python qui convertit une valeur dans 8 catégories (température, masse, longueur, temps, volume, surface, vitesse, stockage informatique) et affiche le résultat dans toutes les autres unités à la fois, en terminal ou dans une interface Tkinter.

---

## Ce que je ferai après ta validation

1. **Modèle** :
   - ajouter l'accroche, les listes dans les sections et le statut « En continu » ;
   - afficher l'accroche sur les cartes.
2. **Textes** :
   - reporter les textes et les chiffres validés ;
   - régénérer `docs/relecture-contenu.md`.
3. **Lot 2** : passer aux projets de formation avec la même méthode :
   - OTP, Citiz, ChatFlow, Time Manager, Kubernetes, Bookworm, Smart Fridge ;
   - les applications LLM ;
   - les archives Epitech.
