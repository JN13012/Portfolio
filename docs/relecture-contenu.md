# Relecture du contenu V1 (FR)

> Généré par `npm run review` le 2026-10-24 à partir de `src/content/`. Ne pas modifier ce fichier à la main : corriger le contenu source, puis régénérer.
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

### Cyber

Pentest web et Active Directory avec une méthode documentée de bout en bout, et une montée en compétence côté SOC.

Preuves : Jr Penetration Tester (95 h) · 25 write-ups publiés · Un audit web autorisé · SOC Level 1 en cours

### Dev

Du code testé et automatisé, du prototype à la production.

Preuves : Alternance full-stack Salesforce (ULIT) · Un outil interne en production · 46 tests et CI durcie sur BlockTrader

## Dossiers

### BlockTrader — En développement (2026-07 → en cours)

Banc de recherche pour stratégies de trading crypto, conçu pour ne pas se mentir : protocoles écrits avant les calculs, chaque essai enregistré, garde-fous contre le surapprentissage. En paper trading uniquement.

*Angle dev* : Moteur Python compilé (numba), vérifié contre VectorBT et une boucle de référence, 46 tests, CI durcie, exécution serverless.

*Angle cyber* : Aucune clé ni signature, CI au moindre privilège avec actions épinglées par SHA, architecture de garde conçue pour le passage au réel.

*Angle ia* : Méthodologie statistique contre le surapprentissage (Sharpe dégonflé, holdout scellé) et une règle de sûreté : l’IA ne pourra que réduire l’exposition.

**Le problème.** La plupart des backtests sont trop beaux pour être vrais : à force d’essayer des variantes, on finit par trouver une stratégie qui a « marché » par hasard, ou qui utilise sans le savoir des informations du futur.

**La méthode.** Chaque protocole est figé par écrit avant le moindre calcul (13 pré-enregistrements, commités avant leurs résultats). Chaque essai, échecs compris, est inscrit dans un registre (3 349 lignes). Le Sharpe est corrigé du nombre d’essais (Bailey et López de Prado, 2014), et une période de test scellée ne peut être consommée qu’une fois.

**L’architecture.** Moteur de backtest en Python 3.12 compilé avec numba, dont les résultats sont recoupés avec VectorBT et avec une boucle de référence. Le paper trading tourne toutes les 4 heures sans serveur : Google Cloud Scheduler déclenche un workflow GitHub Actions, qui lit des cotations on-chain en lecture seule (Uniswap v3) sur Ethereum et Arbitrum. Un tableau de bord React suit le journal.

**La sécurité.** Aucune clé privée, aucune signature, aucun fonds. La CI est au moindre privilège : lecture seule par défaut, actions épinglées par empreinte SHA, et le seul job autorisé à écrire n’exécute aucun code du projet. Un test injecte volontairement une stratégie qui « triche » avec le futur et vérifie qu’elle est détectée. Pour un éventuel passage au réel, l’architecture de garde est conçue (fonds dans un Safe, permissions Zodiac, clé dans un HSM Cloud KMS, coupe-circuit Ledger) mais pas implémentée.

**Le résultat.** Le banc a fait son travail : il a montré qu’aucune des stratégies testées n’est statistiquement prouvée sur l’historique. Le paper trading tourne depuis le 8 octobre 2026 ; un verdict sur l’exécution est prévu à trois mois, aucun verdict de performance avant un an.

**Les limites.** Paper trading uniquement. Aucun module d’IA n’est encore branché : la règle « l’IA ne peut que freiner » est une contrainte de conception. Dépôt privé.

Chiffres : 46 tests · 3 349 essais enregistrés · 13 protocoles pré-enregistrés · 0 € de fonds réels engagés

Stack : Python, numba, pandas, VectorBT, web3.py, GitHub Actions, Google Cloud Scheduler, React, TypeScript

### Argos — En développement (2026-07 → en cours)

Projet de fin d’études Epitech en cybersécurité. Le premier module collecte des informations publiques sur les entreprises en gardant la source de chaque donnée ; une couche d’agents IA est en conception.

*Angle cyber* : Un cadre légal écrit avant le code : sources publiques et API officielles uniquement, données personnelles minimisées.

*Angle ia* : Architecture prévue pour des agents IA (capacités, workflows, pilotage), documentée et pas encore implémentée.

**Le moteur.** Python, connecteur à l’API publique INSEE SIRENE, base SQLite. Chaque observation est enregistrée avec sa source et sa date : une donnée sans provenance est refusée. Les rapports sont générés en Markdown.

**Le cadre légal.** Un document fixe les règles du projet : sources publiques ou API officielles, respect des conditions d’utilisation, organisations plutôt que personnes, aucune prise de contact automatisée.

**Où en est le projet.** Dépôt reconstruit sur une base propre le 10 octobre 2026. L’intégration de modèles de langage viendra une fois le moteur stabilisé.

Chiffres : 62 tests

Stack : Python, httpx, SQLite, pytest

### Pentest — write-ups et audit — Terminé (2026-04 → 2026-10)

25 rapports de tests d’intrusion publiés sur des environnements d’entraînement, et un premier audit web dans un cadre autorisé, accompagnés du parcours TryHackMe Jr Penetration Tester.

**Une méthode documentée.** Chaque rapport suit le même standard : métadonnées structurées, déroulé de la reconnaissance au résultat, et une section d’enseignements. Les environnements viennent d’Epitech (10 machines du module T-SEC-600) et de TryHackMe (15 salles) ; ils couvrent le web, Active Directory, Linux, Windows et la rétro-ingénierie.

**Le premier audit.** Audit de sécurité web mené dans un cadre autorisé sur une infrastructure réelle, environ 20 heures, conclu par un rapport technique. Le client et les résultats restent confidentiels.

Chiffres : 25 write-ups publiés · 95 h parcours Jr Penetration Tester · ≈ 20 h premier audit autorisé

Stack : TryHackMe, Exegol, Nmap, Burp Suite, Metasploit, Hashcat

### ZeroDay — En développement (2026-08 → en cours)

Jeu de stratégie sur le thème de la cybersécurité, en phase de conception : un corpus de game design versionné, une banque de termes alignée sur MITRE ATT&CK et une première fondation technique sous Unity.

*Angle dev* : Cœur de simulation déterministe testé, et un éditeur d’arbres de progression écrit à la main, sans framework.

*Angle cyber* : Un vocabulaire de jeu calé sur MITRE ATT&CK, mais pensé pour rester compréhensible sans connaissances en cybersécurité.

**La conception d’abord.** Avant de coder le jeu, tout est écrit et versionné : une vision canonique figée, un registre des décisions de design, une boussole de gameplay et 22 documents de segments, soit environ 141 000 mots hors archives.

**La fondation technique.** Unity 6.3 LTS en C#, cible web. Un générateur aléatoire à graine (xorshift32) et une session de simulation rejouable rendent chaque partie reproductible, vérifiées par 5 tests. Un éditeur web maison (HTML, CSS et JavaScript) dessine les arbres de progression : 42 capacités dans l’arbre Propagation, 36 dans Adaptation.

**Les limites.** Pas encore jouable : la fondation M0 est un bac à sable sans gameplay définitif. Dépôt privé.

Chiffres : ≈ 141 000 mots de game design · 78 capacités dans les arbres · 5 tests du cœur déterministe

Stack : Unity 6.3, C#, HTML, CSS, JavaScript, Markdown

## Autres réalisations

### Générateur OTP RCS — Terminé · équipe de 6, hackathon

Backend d’authentification à deux facteurs : génération, envoi par RCS (API smsmode) et vérification de codes à 6 chiffres. Seule l’empreinte SHA-256 des codes est stockée ; expiration, nombre d’essais limité et limitation par numéro et par IP.

### ChatFlow — Terminé · équipe de 4, Epitech

Messagerie temps réel façon plateforme communautaire : serveurs, salons, rôles, messages privés, pièces jointes. API Express documentée, client Next.js et application desktop Electron.

### Time Manager — Terminé · binôme, Epitech

Application de gestion du temps de travail : API NestJS typée avec Drizzle et Swagger, front React, tests unitaires et de bout en bout avec Vitest.

### Salesforce Executor — Terminé · alternance chez ULIT

Éditeur interne pour l’écosystème Salesforce, utilisé en production chez ULIT : exécution, planification et chaînage de scripts, sauvegarde et suivi des logs.

### Bernstein — Kubernetes — Terminé

Déploiement d’une application de vote en microservices sur un cluster k3d multi-nœuds : ingress Traefik, secrets, volumes persistants, RBAC et supervision cAdvisor.

### Bookworm — Terminé

Outil en ligne de commande d’analyse de livres du projet Gutenberg avec spaCy : diversité lexicale, thèmes par section, entités nommées, résumé et fiche de lecture.

### Base de connaissance — En développement

Base de connaissances personnelle sous Obsidian : procédures, cheatsheets, workflows et retours d’expérience en cybersécurité, IA, développement et DevOps.

### CTF du portfolio — Terminé

Parcours d’entraînement en 9 niveaux intégré au site, dans un terminal simulé : de la reconnaissance à l’analyse SIEM, la forensique et le durcissement.

### Atlas Academy — En développement

Plateforme d’apprentissage cybersécurité et IA (parcours, modules, salles, progression), en pause : son moteur servira aux salles du Lab.

### Smart Fridge — Terminé

Pilotage de la phase de conception d’un produit : analyse de marché (SWOT, PESTEL), personas, cartographie des risques, indicateurs, budget et planning Gantt.

## Archives

- **Platino** (2025) — Plateforme d’offres d’emploi pour étudiants : comptes, profils, candidatures et favoris, API Express et PostgreSQL.
- **POPEYE** (2025) — Application web distribuée en microservices, orchestrée avec Docker Compose.
- **My_Marvin** (2025) — Instance Jenkins conteneurisée, configurée entièrement par le code (JCasC, Job DSL).
- **Vaultborn** (2025) — Action-RPG 2D en Java : 7 classes jouables, mondes interconnectés, inventaire et sauvegarde, architecture en patterns (Factory, World, Screen).
- **CyberPong** (2025) — Pong futuriste en Python : niveaux progressifs, « virus » qui modifient la physique et introduction scénarisée.
- **Unit Converter** (2025) — Convertisseur d’unités en terminal et en interface graphique Tkinter.
- **AI Voice Assistant** (2026) — Assistant vocal : Llama 3 via Groq pour le raisonnement, IBM Watson pour la reconnaissance et la synthèse vocales, interface Flask.
- **LLM Context Wrapper** (2026) — Surcouche Python à Hugging Face Transformers qui garde l’historique de conversation du modèle Blenderbot.

## Lab

25 write-ups indexés depuis JN13012/Cyber-Write-ups (métadonnées seulement).

## Parcours

### Master of Science — Architecte des systèmes d’information, spécialité cybersécurité — Epitech (2025 – 2028)

Cursus en alternance : architecture systèmes et réseaux, ingénierie logicielle, DevSecOps et cloud, sécurité réseau, audits et tests d’intrusion, gestion des risques et conformité (ISO 2700x, RGPD).

### Développeur full-stack (alternance) — ULIT (2026-01 → 2026-06)

Développement sur Salesforce : applications Apex, Lightning Web Components et JavaScript, et un éditeur de scripts interne.

- Éditeur de scripts interne : exécution, historique, sauvegarde, versioning, planification et suivi des logs.
- Résolution de tickets : corrections, évolutions fonctionnelles, traitement des données et des processus métier.
- Mise en place de tests unitaires.

### Entrepreneur — infrastructure blockchain — Indépendant (Depuis 2018)

Conception, assemblage et exploitation de fermes de minage (Ethereum avant le passage au Proof-of-Stake, Bitcoin, Raptoreum, Chia).

- Administration et supervision sous HiveOS, Braiins OS, Linux et Windows ; automatisation des redémarrages, mises à jour et gestion d’erreurs.
- Optimisation des performances, de la consommation et du refroidissement (overclocking, undervolting).
- Diagnostic des pannes et maintenance du matériel.

### Technicien mécanique — compétition et maintenance — G-Drive Racing · Renault · Wärtsilä (5 ans, dont la saison WEC 2017)

Championnat du monde d’endurance 2017 avec G-Drive Racing, dont les 24 Heures du Mans : responsable des pneumatiques sur prototype LMP2.

- Pressions, préchauffage et préparation des trains de pneus ; ravitaillement et coordination des arrêts aux stands.
- Diagnostic et réparation automobile chez Renault.
- Contrôle et remise en service de pièces de moteurs marins et de groupes électrogènes chez Wärtsilä.

### Préparateur et développeur de véhicules de compétition (Bac+2) — École de la Performance (2017)

Formation aux métiers de technicien motoriste en sport automobile.

### Combattant de l’infanterie — 2e Régiment d’Infanterie de Marine (2 ans)

Formation militaire initiale, CPIS de Perpignan, stage au CNEC de Mont-Louis (franchissement, rusticité, autonomie).

- Sang-froid, prise de décision et sens des responsabilités, utiles en environnement technique sous pression.

## Compétences

### ia

- **Applications LLM** : LangChain, RAG, FAISS, IBM watsonx, Llama 3, Groq, Hugging Face Transformers, Gradio
- **Voix et langage** : Whisper, IBM Watson STT / TTS, spaCy, NLP
- **Python et données** : Python, Flask, PyTorch, Pandas, NumPy

### cyber

- **Pentest web et réseau** : Nmap, Gobuster, Burp Suite, SQLMap, Metasploit, OWASP Top 10
- **Active Directory et Windows** : NetExec, Impacket, Responder, ldapsearch, rpcclient, smbclient
- **Mots de passe et élévation de privilèges** : Hashcat, John the Ripper, Hydra, SUID / sudo / cron, Linux, Windows
- **Défense et analyse** : Splunk, Wireshark, Snort, Fail2ban, FlareVM, REMnux, CyberChef
- **Conformité** : ISO 27001, RGPD

### dev

- **Langages** : TypeScript, JavaScript, Python, Java, Apex, SQL
- **Web et back-end** : React, Next.js, NestJS, Express, Prisma, Drizzle, Socket.IO, Electron, Lightning Web Components
- **Données** : PostgreSQL, MySQL, MongoDB, SQLite, Redis
- **Tests, CI et déploiement** : Vitest, Jest, pytest, GitHub Actions, Docker, Docker Compose, Kubernetes, Jenkins

## Certifications

- **Jr Penetration Tester** — TryHackMe, 2026-10-07 — Parcours pentest : reconnaissance, web (OWASP), exploitation, élévation de privilèges, Metasploit, Burp Suite.
- **IBM AI Developer** — IBM · Coursera, 2026-04-08 — 10 cours : IA générative, prompt engineering, applications Python et Flask, chatbots et applications LLM.
- **Cyber Security 101 (SEC1)** — TryHackMe, 2026-05-24 — Certification à examen : réseau, Linux et Windows, outils offensifs et défensifs, cryptographie, sécurité web.
- **Supercharging Your Pentesting With AI** — TryHackMe, 2026-10-05 — Atelier de 5 crédits CPE : pentest assisté par IA, workflows agentiques, construction de harness, durcissement de prompts, CTF.
- Cyber Security 101 — TryHackMe, 2025-10-14
- Pre Security (SEC0) — TryHackMe, 2026-05-19
- Pre Security — TryHackMe, 2026-04-14

En cours : SOC Level 1 (50 % au 2026-10-17)

## Langues

Français (langue maternelle) · Anglais (C1) · Espagnol (C1) · Arabe (C1, libanais et littéraire) · Allemand (A1)

