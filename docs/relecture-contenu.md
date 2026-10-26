# Relecture du contenu V1 (FR)

> Généré par `npm run review` le 2026-10-26 à partir de `src/content/`. Ne pas modifier ce fichier à la main : corriger le contenu source, puis régénérer.
> Les chiffres viennent des dépôts et des certificats (voir les champs `source` dans le code).

## Hero

**Jérémie Nagi** — Développeur IA · Pentester junior

> Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque.

- IBM AI Developer Professional
- TryHackMe Jr Penetration Tester
- Argos : moteur OSINT, couche agents IA en conception

Disponible immédiatement · Alternance · MSc Epitech · Stage possible · Marseille · mobile

## En 30 secondes

5 langues · 6 pays · MSc Epitech cybersécurité · Jr Penetration Tester · IBM AI Developer · Ex-militaire · Disponible immédiatement

## Trois métiers

### IA

Des applications LLM de bout en bout (RAG, voix, orchestration), avec des garde-fous pensés dès la conception.

Preuves : IBM AI Developer Professional · 4 applications LLM publiées · Atelier « Supercharging Your Pentesting With AI »

### Data

Des données publiques à la décision : nettoyage, géotraitement, cartes et indicateurs sourcés.

Preuves : 2e place au hackathon Microsoft × Citiz · Réseau piéton de 16,6 M nœuds

### Cyber

Pentest web et Active Directory avec une méthode documentée de bout en bout, et une montée en compétence côté SOC.

Preuves : Jr Penetration Tester (96 h) · 25 write-ups publiés · Un audit web autorisé · SOC Level 1 en cours

### Dev

Du code testé et automatisé, du prototype à la production.

Preuves : Stage full-stack Salesforce (ULIT) · Un outil interne en production · 56 tests et CI durcie sur BlockTrader

### DevOps

Conteneurs, orchestration et intégration continue, avec un pipeline durci sur BlockTrader.

Preuves : Déploiement Kubernetes multi-nœuds (Bernstein) · Jenkins configuré par le code (My_Marvin) · 56 tests et CI durcie sur BlockTrader

## Dossiers

### BlockTrader — En développement (2026-07 → en cours)

Bot de trading crypto sécurisé, actuellement en phase de test : il conçoit et teste des stratégies sur BTC et ETH, étudie le marché à partir d’une dizaine de sources de données publiques, et vise à être piloté ensuite par une IA qui choisira les stratégies à suivre en fonction du marché.

*Angle ia* : Pensé pour être piloté par une IA : stratégies validées et lecture du marché lui fourniront des conclusions vérifiables, et une règle de sûreté borne déjà ce qu’elle pourra faire.

*Angle data* : Un observatoire du marché qui historise une dizaine de sources publiques, et une méthodologie statistique contre le surapprentissage (Sharpe dégonflé, holdout scellé).

*Angle dev* : Moteur Python compilé (numba), vérifié contre VectorBT et une boucle de référence, 56 tests, CI durcie, exécution serverless.

**Le problème.** Un bot de trading ne vaut que par ses stratégies. Or la plupart des backtests sont trop beaux pour être vrais : à force d’essayer des variantes, on finit par trouver une stratégie qui a « marché » par hasard, ou qui utilise sans le savoir des informations du futur. Et une IA branchée sur de mauvaises stratégies ne ferait qu’amplifier l’erreur.

**Les stratégies.** Le bot fait tourner 40 stratégies en parallèle, réparties en 6 familles : suivre la tendance, choisir entre BTC et ETH, diversifier, racheter dans les chutes, grilles, et des chefs d’orchestre qui répartissent le capital entre stratégies. Chaque protocole est figé par écrit avant le moindre calcul et chaque essai, échecs compris, est inscrit dans un registre (3 349 lignes). Les résultats sont corrigés du nombre d’essais, pour ne pas confondre chance et vraie performance, et une période de test mise de côté ne sert qu’une seule fois.

**La data et l’architecture.** À chaque passage, un observatoire du marché note une dizaine de données publiques, sans clé ni compte : financement et positions ouvertes des contrats perpétuels, volatilité implicite des options, indice Fear & Greed, stablecoins en circulation, réserves des bourses, rapport COT du CME. Il se constitue ainsi un historique daté pour étudier le marché sans regarder dans le futur. Le moteur de backtest, en Python compilé avec numba, est recoupé avec VectorBT et une boucle de référence. Le paper trading tourne toutes les 4 heures sans serveur (Google Cloud Scheduler déclenche GitHub Actions) sur des cotations Uniswap v3 lues on-chain, sur Ethereum et Arbitrum, et un tableau de bord React suit le tout.

**La sécurité.** Aucune clé privée, aucune signature, aucun fonds. La CI est au moindre privilège : lecture seule par défaut, actions épinglées par empreinte SHA, et le seul job autorisé à écrire n’exécute aucun code du projet. Une donnée manquante ou incohérente met le bot en pause, jamais en position. Un test injecte volontairement une stratégie qui « triche » avec le futur et vérifie qu’elle est détectée. Pour un éventuel passage au réel, l’architecture de garde est conçue (fonds dans un Safe, permissions Zodiac, clé dans un HSM Cloud KMS, coupe-circuit Ledger) mais pas implémentée.

**Où en est le projet.** Le banc d’essai a fait son travail : il a montré qu’aucune des stratégies testées n’est statistiquement prouvée sur l’historique, ce qui évite de confier de mauvaises stratégies à une IA. La phase de test tourne depuis le 8 octobre 2026 : un premier verdict sur l’exécution (coûts, signaux, délais) est prévu en janvier 2027 ; la performance, elle, se jugera sur au moins un an de marché.

**La suite : le pilotage par IA.** L’IA n’est pas encore branchée. Elle s’appuiera sur les conclusions de l’observatoire pour choisir parmi les stratégies validées, avec une règle de sûreté déjà écrite : l’IA pourra réduire l’exposition ou mettre en pause, jamais déclencher un achat ni relever une limite. Paper trading uniquement, dépôt privé.

Chiffres : 56 tests · 3 349 essais enregistrés · 13 protocoles pré-enregistrés · 0 € de fonds réels engagés

Stack : Python, NumPy, Numba, pandas, VectorBT, web3.py, GitHub Actions, Google Cloud Scheduler, React, TypeScript

### Argos — En développement (2026-07 → en cours)

Projet de fin d’études Epitech en cybersécurité. Le premier module collecte des informations publiques sur les entreprises en gardant la source de chaque donnée ; une couche d’agents IA est en conception.

*Angle cyber* : Un cadre légal écrit avant le code : sources publiques et API officielles uniquement, données personnelles minimisées.

*Angle ia* : Architecture prévue pour des agents IA (capacités, workflows, pilotage), documentée et pas encore implémentée.

**Le moteur.** Python, connecteur à l’API publique INSEE SIRENE, base SQLite. Chaque observation est enregistrée avec sa source et sa date : une donnée sans provenance est refusée. Les rapports sont générés en Markdown.

**Le cadre légal.** Un document fixe les règles du projet : sources publiques ou API officielles, respect des conditions d’utilisation, organisations plutôt que personnes, aucune prise de contact automatisée.

**Où en est le projet.** Dépôt reconstruit sur une base propre le 10 octobre 2026. L’intégration de modèles de langage viendra une fois le moteur stabilisé.

Chiffres : 62 tests

Stack : Python, httpx, SQLite, pytest

### Pentest - write-ups et audit — Terminé (2026-04 → 2026-10)

25 rapports de tests d’intrusion publiés sur des environnements d’entraînement, et un premier audit web dans un cadre autorisé, accompagnés du parcours TryHackMe Jr Penetration Tester.

**Une méthode documentée.** Chaque rapport suit le même standard : métadonnées structurées, déroulé de la reconnaissance au résultat, et une section d’enseignements. Les environnements viennent d’Epitech (10 machines du module T-SEC-600) et de TryHackMe (15 salles) ; ils couvrent le web, Active Directory, Linux, Windows et la rétro-ingénierie.

**Le premier audit.** Audit de sécurité web mené dans un cadre autorisé sur une infrastructure réelle, environ 20 heures, conclu par un rapport technique. Le client et les résultats restent confidentiels.

Chiffres : 25 write-ups publiés · 96 h parcours Jr Penetration Tester · ≈ 20 h premier audit autorisé

Stack : TryHackMe, Exegol, Nmap, Burp Suite, Metasploit, Hashcat

### ZeroDay — En développement (2026-08 → en cours)

Jeu de stratégie sur le thème de la cybersécurité, en phase de conception : un corpus de game design versionné, une banque de termes alignée sur MITRE ATT&CK et une première fondation technique sous Unity.

*Angle dev* : Cœur de simulation déterministe testé, et un éditeur d’arbres de progression écrit à la main, sans framework.

**La conception d’abord.** Avant de coder le jeu, tout est écrit et versionné : une vision canonique figée, un registre des décisions de design, une boussole de gameplay et 22 documents de segments, soit environ 141 000 mots hors archives.

**La fondation technique.** Unity 6.3 LTS en C#, cible web. Un générateur aléatoire à graine (xorshift32) et une session de simulation rejouable rendent chaque partie reproductible, vérifiées par 5 tests. Un éditeur web maison (HTML, CSS et JavaScript) dessine les arbres de progression : 42 capacités dans l’arbre Propagation, 36 dans Adaptation.

**Les limites.** Pas encore jouable : la fondation M0 est un bac à sable sans gameplay définitif. Dépôt privé.

Chiffres : ≈ 141 000 mots de game design · 78 capacités dans les arbres · 5 tests du cœur déterministe

Stack : Unity 6.3, C#, HTML, CSS, JavaScript, Markdown

## Autres réalisations

### Générateur OTP RCS — Terminé · Équipe de 6 · backend et sécurité applicative

Hackathon inter-écoles : backend d’authentification à deux facteurs qui génère, envoie par RCS (API smsmode) et vérifie des codes à 6 chiffres. Seule l’empreinte SHA-256 des codes est stockée ; expiration, nombre d’essais limité et limitation par numéro et par IP. 3e place.

### Hackathon Microsoft × Citiz — Terminé · Équipe de 5 · data engineer géospatial

Hackathon Epitech : outil d’aide à la décision qui indique où ouvrir une station d’autopartage Citiz pour toucher le plus d’habitants au moindre coût. Réseau piéton, isochrones à 5 minutes, carte d’accès aux transports, modèle de prédiction et liste priorisée sous budget. 2e place.

### ChatFlow — Terminé · Équipe de 4 · backend

Messagerie temps réel façon plateforme communautaire : serveurs, salons, rôles, messages privés, pièces jointes. API Express documentée, client Next.js et application desktop Electron.

### Time Manager — En développement · Équipe de 4 · backend

Application de gestion du temps de travail : API NestJS typée avec Drizzle et Swagger, front React, tests unitaires et de bout en bout avec Vitest.

### Code Executor — Terminé

Éditeur interne pour l’écosystème Salesforce, utilisé en production chez ULIT : exécution, planification et chaînage de scripts, sauvegarde et suivi des logs.

### Bernstein - Kubernetes — Terminé

Déploiement d’une application de vote en microservices sur un cluster k3d multi-nœuds : ingress Traefik, secrets, volumes persistants, RBAC et supervision cAdvisor.

### Bookworm — Terminé

Outil en ligne de commande d’analyse de livres du projet Gutenberg avec spaCy : diversité lexicale, thèmes par section, entités nommées, résumé et fiche de lecture.

### Base de connaissance — En développement

Base de connaissances personnelle sous Obsidian : procédures, cheatsheets, workflows et retours d’expérience en cybersécurité, IA, développement et DevOps.

### CTF du portfolio — Terminé

Parcours d’entraînement en 9 niveaux intégré au site, dans un terminal simulé : de la reconnaissance à l’analyse SIEM, la forensique et le durcissement.

### Argos Security Arena — En développement

Plateforme d’entraînement cyber (parcours, modules, salles, progression), en pause : elle deviendra l’arène d’entraînement d’Argos, un lab où s’exercer à l’attaque et à la défense.

### Smart Fridge — Terminé

Pilotage de la phase de conception d’un produit : analyse de marché (SWOT, PESTEL), personas, cartographie des risques, indicateurs, budget et planning Gantt.

## Applications LLM (certification IBM)

### RAG PDF Chatbot

Projet de certification IBM AI Developer : un chatbot répond aux questions sur des CV en PDF (découpage des documents, embeddings stockés dans FAISS, Llama 3 interrogé via LangChain), conteneurisé avec Docker.

### Meeting Companion

Projet de certification IBM AI Developer : un assistant de réunion transcrit l’audio avec Whisper, puis en tire résumé, plan d’action et analyse de tonalité avec le modèle Granite d’IBM.

### Career Coach

Projet de certification IBM AI Developer : un coach de carrière optimise le CV et rédige des lettres de motivation adaptées à une offre, avec Llama 3.2 sur IBM watsonx.ai.

### Assistant Translator

Projet de certification IBM AI Developer : un traducteur vocal transcrit la parole, la traduit avec Llama 3.3 via Groq, puis la relit à voix haute avec les services Watson.

## Archives

- **Platino** (2025) — Plateforme d’offres d’emploi pour étudiants : comptes, profils, candidatures et favoris, API Express et PostgreSQL.
- **POPEYE** (2025) — Application web distribuée en microservices, orchestrée avec Docker Compose.
- **My_Marvin** (2025) — Instance Jenkins conteneurisée, configurée entièrement par le code (JCasC, Job DSL).
- **Vaultborn** (2025) — Action-RPG 2D en Java : 7 classes jouables, mondes interconnectés, inventaire et sauvegarde, architecture en patterns (Factory, World, Screen).
- **CyberPong** (2025) — Pong futuriste en Python : niveaux progressifs, « virus » qui modifient la physique et introduction scénarisée.
- **Unit Converter** (2025) — Convertisseur d’unités en terminal et en interface graphique Tkinter.
- **AI Voice Assistant** (2026) — Projet de certification IBM AI Developer : un assistant vocal qui raisonne avec Llama 3 via Groq, reconnaît et synthétise la voix avec IBM Watson, dans une interface Flask.
- **LLM Context Wrapper** (2026) — Projet de certification IBM AI Developer : une surcouche Python à Hugging Face Transformers qui garde l’historique de conversation du modèle Blenderbot.

## Lab

25 write-ups indexés depuis JN13012/Cyber-Write-ups (métadonnées seulement).

## Parcours

### Master of Science - Architecte des systèmes d’information — Epitech (2026 – 2028 · diplôme prévu en 2028)

En cours · 1re année de master

Master informatique Bac+5 : une pédagogie par projets, au plus près des conditions de l’entreprise, pour devenir expert de sa spécialité.

- En alternance : 4 jours en entreprise, 1 jour à l’école. Entreprise d’accueil recherchée.
- Concevoir, déployer et piloter des projets techniques : gestion de projet, qualité, méthodes Agile.
- Projet de fin d’études sur un an et demi : de l’analyse du besoin et du design thinking jusqu’à la production.
- Anglais technique, pour travailler dans un environnement international.
- Spécialisation à choisir en janvier 2027.

### Développeur full-stack Salesforce — ULIT (01/2026 – 06/2026)

Stage · 6 mois

Développement sur Salesforce : applications Apex, Lightning Web Components et JavaScript, et un éditeur de scripts interne utilisé en production.

- Éditeur de scripts interne : exécution, historique, sauvegarde, versioning, planification et suivi des logs.
- Résolution de tickets : corrections, évolutions fonctionnelles, traitement des données et des processus métier.
- Mise en place de tests unitaires.

### Pré-MSc — Epitech (09/2025 – 2026)

Année préparatoire au Master of Science.

- La « piscine » : quatre mois d’immersion intensive dans le code pour poser les bases de la programmation.
- Développement en Python et en Java, développement web.
- Initiation au DevOps, à l’IA, la data et à la cybersécurité.

### Investissement et veille crypto — Personnel (Depuis 2022)

Activité personnelle

Après le minage, je reste investi à titre personnel et je suis de près l’écosystème crypto : évolutions des protocoles, sécurité, régulation et trading.

### Infrastructure de minage — Indépendant (2018 – 09/2022)

Conception, assemblage et exploitation de fermes de minage (Ethereum avant le passage au Proof-of-Stake, Bitcoin, Raptoreum, Chia).

- Administration et supervision sous HiveOS, Braiins OS, Linux et Windows ; automatisation des redémarrages, mises à jour et gestion d’erreurs.
- Optimisation des performances, de la consommation et du refroidissement (overclocking, undervolting).
- Diagnostic des pannes et maintenance du matériel.

### Technicien mécanique - compétition et maintenance — G-Drive Racing · Wärtsilä · Renault (2017 – 07/2025)

Mécanique en compétition, puis en maintenance industrielle et en atelier automobile.

- G-Drive Racing : championnat du monde d’endurance 2017, 1re place en LMP2 aux 6 Heures de Spa-Francorchamps (Belgique, 6 mai 2017) et participation aux 24 Heures du Mans. Responsable des pneumatiques sur prototype LMP2 (pressions, préchauffage, préparation des trains de pneus) et ravitaillement en carburant lors des arrêts aux stands.
- Wärtsilä : contrôle et remise en service de pièces de moteurs marins et de groupes électrogènes.
- Renault : diagnostic et réparation automobile.

### Préparateur et développeur de véhicules de compétition (Bac+2) — École de la Performance (2017)

Alternance

Formation en alternance de technicien de compétition : préparer, optimiser et régler une voiture de course, de l’atelier jusqu’au circuit.

- Moteur et boîte de vitesses : préparation et optimisation pour la performance.
- Cartographie : temps d’injection, richesse, avance à l’allumage.
- Châssis et suspensions : réglages pour adapter la voiture au circuit et au pilote.
- Mise en pratique en entreprise et en conditions de course.

### Formation militaire — Armée de terre (2014 – 2016)

De la préparation commando à l’engagement comme militaire du rang : rigueur, endurance et esprit d’équipe en conditions exigeantes.

- Préparation militaire commando au Centre parachutiste d’instruction spécialisée (CPIS) de Perpignan.
- Stage au Centre national d’entraînement commando (CNEC) de Mont-Louis : franchissement, rusticité, autonomie.
- Engagement et formation initiale de militaire du rang au 2e Régiment d’infanterie de marine (2e RIMa).

## Compétences

### ia

- **Applications LLM** : LangChain, RAG, FAISS, IBM watsonx, Llama 3, Groq, Hugging Face Transformers, Gradio
- **Voix et langage** : Whisper, IBM Watson STT / TTS, spaCy, NLP
- **Python et données** : Python, Flask, PyTorch, Pandas, NumPy

### data

- **Traitement de données** : Python, Pandas, NumPy, SciPy, Parquet
- **Géodonnées** : GeoPandas, Shapely, OSMnx, NetworkX

### cyber

- **Pentest web et réseau** : Nmap, Gobuster, Burp Suite, SQLMap, Metasploit, OWASP Top 10
- **Active Directory et Windows** : NetExec, Impacket, Responder, ldapsearch, rpcclient, smbclient
- **Mots de passe et élévation de privilèges** : Hashcat, John the Ripper, Hydra, SUID / sudo / cron, Linux, Windows
- **Défense et analyse** : Splunk, Wireshark, Snort, Fail2ban, FlareVM, REMnux, CyberChef
- **Conformité** : ISO 27001, RGPD

### dev

- **Langages** : TypeScript, JavaScript, Python, Java, C#, Apex, SQL
- **Web et back-end** : React, Next.js, NestJS, Express, Prisma, Drizzle, Socket.IO, Electron, Lightning Web Components
- **Données** : PostgreSQL, MySQL, MongoDB, SQLite, Redis
- **Tests** : Vitest, Jest, pytest

### devops

- **Conteneurs et orchestration** : Docker, Docker Compose, Kubernetes, k3d, Traefik
- **Intégration continue** : GitHub Actions, Jenkins, Groovy

## Certifications

- **Jr Penetration Tester** — TryHackMe, 2026-10-07 · Parcours · HARD · 96 h — Le parcours pentest le plus complet de TryHackMe, dans sa version refaite en 2026 (89 salles, 17 modules). Il prépare à la certification PT1.
  - Reconnaissance : passive et active, scan avec Nmap
  - Web : Burp Suite et OWASP Top 10 2025 : SQLi, XSS, CSRF, SSRF, IDOR, inclusion de fichiers, injection de commandes, API
  - Exploitation : recherche de CVE, Metasploit et shells, attaques de mots de passe
  - Élévation de privilèges : Linux et Windows
  - Active Directory : énumération, collecte d’identifiants, mouvement latéral, pivot
  - IA : pentest de modèles de langage (LLM)
  - Méthode : scripts Python, rédaction de rapport, challenges complets de la reconnaissance à la compromission
- **Security Engineer** — TryHackMe, 2026-10-18 · Parcours · EASY · 65 h — Parcours d’ingénierie sécurité, côté défense : concevoir, durcir et surveiller des systèmes.
  - Réseaux et systèmes : sécurité des réseaux, durcissement des systèmes
  - Développement sécurisé : SSDLC, tests SAST et DAST, sécurité des API
  - Menaces : modélisation des menaces
  - Risques : gestion des vulnérabilités et des risques
  - Incidents : réponse à incident
- **DevSecOps** — TryHackMe, 2026-10-26 · Parcours · MEDIUM · 27 h — Intégrer la sécurité à chaque étape de la chaîne de livraison logicielle : 5 modules, 18 labs pratiques.
  - Développement sécurisé : cycle de développement sécurisé, culture DevSecOps
  - Sécurité du pipeline : outils et configurations de la chaîne CI/CD
  - Tests dans le pipeline : gestion des dépendances, tests SAST et DAST
  - Conteneurs : fonctionnement, failles et durcissement
  - Infrastructure as Code : sur site et dans le cloud
- **Supercharging Your Pentesting With AI** — TryHackMe, 2026-09-30 · Atelier · MEDIUM · 5 h — Workshop animé par Lucas Romano : responsable SOC chez Cequence, chercheur de la Synack Red Team, ancien analyste à la NSA. Objectif : construire un agent IA capable de mener un test d’intrusion, de la reconnaissance à l’exploitation.
  - Donner à l’agent des outils de pentest : sqlmap, serveur MCP de Kali…
  - Répartir le travail entre sous-agents pour préserver le contexte
  - Choisir le modèle selon la tâche et son coût
  - Enchaîner reconnaissance, exploitation, chaînage des failles et revue
  - Vérifier l’efficacité des prompts, contourner des garde-fous et durcir les siens
  - Mettre en pratique dans des labs, puis un CTF
- **Cyber Security 101 (SEC1)** — TryHackMe, 2026-05-24 · Examen · MEDIUM — Examen pratique en scénarios sur 7 domaines, à mener sur une fenêtre de 24 h. 630 / 700 (90 %) · terminé en 9 h 55.
  - Réseau : analyse de captures (DNS, FTP, IMAP, TCP), identifiants en clair
  - Systèmes : audit de configuration Linux et Windows : droits, services, tâches planifiées, journaux
  - Pentest web : énumération, injection SQL, API exposées, upload de fichiers
  - Mots de passe : brute force et cassage (Hydra, John the Ripper, Hashcat)
  - SOC : journaux de pare-feu, alertes et règle Snort, réponse à incident
  - Malware : analyse statique et extraction d’IOC (CAPA, FLOSS)
- **Pre Security (SEC0)** — TryHackMe, 2026-05-19 · Examen · INTRO — Examen d’entrée en cybersécurité sur six domaines : fonctionnement d’un ordinateur, systèmes d’exploitation, bases du logiciel, réseaux, web, attaques et défenses. 540 / 600 (90 %) · terminé en 1 h 58.
- **Pre Security** — TryHackMe, 2026-04-14 · Parcours · INTRO · 20 h — Les fondamentaux avant la sécurité, pour comprendre ce qu’on protège. Première version du parcours terminée en 09/2025 (8 h). Refait en entier après sa refonte par TryHackMe : nouvelle version terminée le 14/04/2026.
  - Réseaux : fonctionnement des réseaux et d’Internet
  - Web : fonctionnement du web
  - Systèmes : Linux et Windows
  - Sécurité : principes de l’attaque et de la défense
- **Cyber Security 101** — TryHackMe, 2025-10-14 · Parcours · EASY · 46 h — Le tronc commun de TryHackMe : les bases de l’attaque comme de la défense.
  - Systèmes : administration Linux et Windows, Active Directory
  - Réseau : analyse réseau, pare-feu et IDS/IPS
  - Cryptographie : chiffrement et attaques de mots de passe
  - Attaque : exploitation de vulnérabilités web et système
  - Défense : réponse à incident et analyse forensique
- **IBM AI Developer** — IBM · Coursera, 2026-04-08 · Certificat professionnel · MEDIUM · 149 h — Certificat professionnel IBM de 10 cours : créer des applications web et des solutions d’IA générative avec Python.
  - Développement : HTML, CSS, JavaScript, Python et Flask, cycle de vie du logiciel
  - Data : Python pour la data science : Pandas, NumPy, API, web scraping
  - IA générative : concepts, prompt engineering, LLM, RAG avec LangChain
  - Projets : analyse de sentiments, légendes d’images, chatbot, assistant vocal, compte rendu de réunion, traducteur vocal
- **Generative AI: Elevate your Software Development Career** — IBM · Coursera, 2026-04-08 · Cours · MEDIUM · 24 h — L’IA générative appliquée à tout le travail du développeur, de la conception à la mise en production.
  - Bases : environnement de développement avec l’IA, prompts, chatbot avec l’API OpenAI
  - Conception : diagrammes d’architecture, schéma de base de données, prototypes web
  - Workflows : revue de code, génération de tests, documentation, Dockerfiles, CI/CD et sécurité
  - Agents : agents IA, RAG avec LangChain, vibe coding
  - Projet final : CodeCraftHub, une plateforme d’apprentissage pour développeurs
- **Building Generative AI-Powered Applications with Python** — IBM · Coursera, 2026-03-29 · Cours · MEDIUM · 14 h — Une application d’IA générative par module, en Python. Six sont publiées sur GitHub et présentées dans les projets.
  - Chatbot : conversation avec mémoire sur un LLM open source (Blenderbot, Hugging Face)
  - Voix : assistant vocal : reconnaissance et synthèse avec IBM Watson, réponses de Llama 3 via Groq
  - Réunions : transcription avec Whisper, résumé et actions par un LLM sur watsonx
  - Documents : questions sur des CV en PDF avec le RAG (LangChain, FAISS, Llama 3)
  - Traduction : traducteur vocal : parole, traduction par LLM, synthèse
  - Coach : CV adapté, lettre de motivation et conseils (Llama 3.2 sur watsonx, Gradio)
  - Image : légendes de photos générées (BLIP, Gradio)
- **Developing AI Applications with Python and Flask** — IBM · Coursera, 2026-01-18 · Cours · MEDIUM · 13 h — Développer, tester et déployer des applications d’IA avec Python et Flask.
  - Code Python : modules et packages, style PEP 8, analyse statique, tests unitaires
  - Web : applications Flask et API REST : routes, GET et POST, erreurs, CRUD, déploiement
  - IA : analyse de sentiments et détecteur d’émotions avec IBM Watson
- **Python for Data Science, AI & Development** — IBM · Coursera, 2025-12-28 · Cours · EASY · 25 h — Python, des bases jusqu’à la collecte et l’analyse de données.
  - Bases : variables, structures de données, boucles, fonctions, classes
  - Données : fichiers CSV, JSON et texte, analyse avec Pandas et NumPy
  - Collecte : API REST et web scraping
  - Outils : notebooks Jupyter, scripts d’automatisation
- **Introduction to HTML, CSS, & JavaScript** — IBM · Coursera, 2025-12-15 · Cours · INTRO · 15 h — Les bases du développement web côté navigateur.
  - HTML : structure des pages, éléments HTML5
  - CSS : mise en forme et mise en page
  - JavaScript : interactivité et manipulation du DOM
  - Projet final : un site portfolio
- **Introduction to Software Engineering** — IBM · Coursera, 2025-12-06 · Cours · INTRO · 15 h — Les principes de l’ingénierie logicielle, du cycle de vie au code.
  - Cycle de vie : SDLC et méthodologies de développement
  - Développement : front-end, back-end, environnements de développement
  - Programmation : bases de la programmation
  - Architecture : conception logicielle, design patterns, UML
- **Generative AI: Prompt Engineering Basics** — IBM · Coursera, 2025-12-07 · Cours · INTRO · 9 h — Écrire des prompts clairs qui donnent des réponses fiables.
  - Techniques : zero-shot, few-shot, Chain-of-Thought, Tree-of-Thought
  - Méthodes : Interview Pattern et Playoff Method pour affiner les réponses
  - Évaluation : juger la justesse et l’utilité des réponses
  - Usages : prompts pour le texte, l’image et le multimodal
- **Generative AI: Introduction and Applications** — IBM · Coursera, 2025-12-06 · Cours · INTRO · 8 h — Ce qu’est l’IA générative, ce qu’elle sait faire et avec quels outils.
  - Concepts : fonctionnement et capacités des modèles génératifs
  - Usages : texte, code, image, audio et vidéo
  - Outils : panorama des outils et cas d’usage par secteur
- **Introduction to Artificial Intelligence (AI)** — IBM · Coursera, 2025-12-03 · Cours · INTRO · 14 h — Les fondamentaux de l’IA et de ses usages.
  - Concepts : machine learning, deep learning, réseaux de neurones, IA générative
  - Domaines : applications de l’IA par domaine
  - Entreprises : transformation des métiers et des carrières
  - Éthique : enjeux, risques et IA responsable

En cours : AI Security (5 % au 2026-10-26) — Parcours de sécurité de l’IA (25 salles, 5 modules), côté attaque et défense. Il prépare à la certification AI1. · SOC Level 1 (50 % au 2026-10-17) — Parcours d’analyste SOC de niveau 1 : surveiller, trier et traiter les alertes.

## Contact

- Échangeons sur une opportunité.
- Recruteur, RH ou porteur de projet : écrivez-moi ici, ou directement par email.
- Marseille · mobile dans toute la France
- Disponible
- Télécharger le CV
- Copier l’adresse
- Copiée
- Nom
- Votre nom
- Email
- prenom.nom@entreprise.com
- Sujet
- Opportunité, alternance, projet…
- Message
- Décrivez votre besoin ou l’opportunité…
- Envoyer
- Envoi…
- Message reçu.
- Merci, je vous réponds par email dès que possible.
- Envoyer un autre message
- Le message n’a pas pu partir.
- Écrire directement par email

## Langues

Français (langue maternelle) · Anglais (C1) · Espagnol (C1) · Arabe (C1, libanais et littéraire) · Allemand (A1)

