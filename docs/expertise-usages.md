# Expertise — « ce que j'en ai fait » (proposition à valider)

Rédigé le 2026-10-24. Le texte de chaque outil passe de la définition générale (« Scan réseau ») à ce que Jérémie en a fait. Il s'affichera dans la case au survol, au toucher ou au focus ; au repos, la case n'affiche que le logo et le nom.

Toutes les phrases sont tirées de sources vérifiables :
- **WU** : les write-ups publiés (`src/content/writeups.json`) ;
- **P** : les fiches projets (`src/content/projects`) ;
- **F** : un parcours de formation (TryHackMe, IBM) ;
- **D** : une déclaration de Jérémie, sans source publique.

Les nombres entre parenthèses indiquent le nombre de write-ups concernés ; ils ne s'afficheront pas sur le site.

Une fois validé, ce texte remplace `note` dans `src/content/expertise.ts`, version anglaise comprise.

## IA appliquée

| Outil | Aujourd'hui | Proposé | Source |
|---|---|---|---|
| LangChain | Pipelines RAG et orchestration LLM | Chatbot RAG sur des CV et des PDF | P applications-llm |
| FAISS | Recherche vectorielle | Index vectoriel du chatbot RAG | P applications-llm |
| Hugging Face Transformers | Bibliothèque de modèles pré-entraînés | Mémoire de conversation pour Blenderbot, embeddings du RAG | P llm-context-wrapper, applications-llm |
| Gradio | Interfaces de démonstration | Interfaces de démo des 4 applications IBM | P applications-llm |
| spaCy | Traitement du langage | Analyse de livres : entités, thèmes, diversité lexicale | P bookworm |
| PyTorch | Machine learning | Exécution du modèle Blenderbot | P llm-context-wrapper |
| Pandas | Manipulation de datasets | Analyse de backtests crypto | P blocktrader |
| NumPy | Calcul numérique | ⚠ aucune fiche projet ne le montre. À retirer, ou à me dire où il a servi | — |
| Flask | API Python des applications IA | Back-end des applications IA (voix, RAG) | P applications-llm, ai-voice-assistant |

## Pentest

| Outil | Aujourd'hui | Proposé | Source |
|---|---|---|---|
| Nmap | Scan et énumération réseau | Première étape de chaque machine : services et versions | WU (23) |
| Gobuster | Fuzzing web | Découverte de pages et fichiers cachés | WU (10) |
| Burp Suite | Proxy et analyse HTTP | Contournement de MFA, IDOR, manipulation de cookies | WU Interceptor, Support, Recruit |
| SQLMap | Injections SQL | Injection SQL aveugle temporelle | WU Daemon Slayer |
| Metasploit | Exploitation et payloads | Payloads msfvenom, sessions Meterpreter | WU Metasploit, Jump |
| NetExec | Énumération Active Directory | Énumération SMB, password spraying en Active Directory | WU (5) Forward, Proxy |
| Impacket | Protocoles Windows (SMB, Kerberos) | Kerberoasting, RBCD, exécution à distance | WU Forward, Proxy |
| BloodHound | Chemins d'attaque Active Directory | Cartographie des chemins vers les comptes à privilèges | WU Dead Drop |
| Responder | Capture de hashs NTLM | Authentification forcée, capture de hashs NetNTLMv2 | WU Proxy |
| Mimikatz | Extraction d'identifiants Windows | Extraction d'identifiants en lab Active Directory | D (lab AD) |
| pypykatz | Analyse de dumps LSASS (Python) | Analyse de dumps LSASS en lab Active Directory | D (lab AD) |
| Hashcat | Cassage de hashs | Cassage hors ligne de hashs Kerberos et NetNTLMv2 | WU (4) |
| John the Ripper | Cassage de mots de passe | Cassage de coffres KeePass et de hashs récupérés | WU (4) |
| Hydra | Audit d'authentification | Brute force ciblé sur SSH, FTP et formulaires web | WU (7) |
| Linux | Élévation de privilèges (SUID, sudo, cron) | Élévation de privilèges : sudo, SUID, cron, PATH | WU (≥ 6) |

## Cyberdéfense

Aucun write-up ni projet ne les utilise : ces outils viennent des parcours TryHackMe. Le texte doit donc le dire.

| Outil | Aujourd'hui | Proposé | Source |
|---|---|---|---|
| Splunk | SIEM et requêtes SPL | Investigation de logs en SPL (TryHackMe) | F SEC1 / SOC L1 |
| Wireshark | Inspection de paquets | Analyse de captures réseau (TryHackMe) | F |
| Snort | Règles IDS | Écriture de règles de détection (TryHackMe) | F |
| Fail2ban | Protection anti brute-force | Blocage des tentatives de brute force (TryHackMe) | F |
| FlareVM | Analyse de malwares Windows | Analyse de malwares Windows en environnement isolé (TryHackMe) | F |
| REMnux | Analyse de malwares Linux | Analyse de malwares et de mémoire (TryHackMe) | F |
| CyberChef | Décodage et transformation | Décodage d'encodages et de charges utiles | WU (base64, base32) + F |

## DevOps

| Outil | Aujourd'hui | Proposé | Source |
|---|---|---|---|
| Docker | Conteneurs et environnements multi-services (Compose) | Conteneurisation de 6 projets avec Compose | P (6) |
| Kubernetes | Orchestration de conteneurs | Cluster k3d multi-nœuds : ingress, RBAC, volumes | P kubernetes (Bernstein) |
| GitHub Actions | CI et vérifications automatiques | CI durcie de BlockTrader | P blocktrader, atlas-academy |
| Jenkins | Pipelines CI/CD | Instance configurée entièrement par le code (JCasC) | P my-marvin |
| Vitest | Tests unitaires (TypeScript) | Tests de Time Manager et d'Atlas Academy | P |
| Jest | Tests unitaires (JavaScript) | Tests de ChatFlow | P chatflow |
| pytest | Tests unitaires (Python) | 62 tests du moteur Argos | P argos |

## Développement

| Outil | Aujourd'hui | Proposé | Source |
|---|---|---|---|
| TypeScript | Front-end et back-end typés | BlockTrader, générateur OTP, Time Manager | P |
| JavaScript | Développement web | Éditeur de scripts Salesforce, CTF du portfolio | P |
| Python | Scripts et API | Argos, BlockTrader, applications IA | P (8) |
| Java | Programmation orientée objet | Jeux et applications en programmation objet | P (à préciser) |
| Apex | Développement Salesforce | Développement Salesforce en alternance (ULIT) | P salesforce-executor + Parcours |
| React | Interfaces web | Interfaces de BlockTrader, ChatFlow, du portfolio | P (5) |
| Next.js | Applications React | Messagerie temps réel ChatFlow | P chatflow |
| NestJS | API Node.js structurées | API du générateur OTP et de Time Manager | P |
| Express | API Node.js | API de ChatFlow | P |
| Prisma | ORM TypeScript | Modèle de données de ChatFlow | P chatflow |
| SQL | Requêtes et modélisation | Modélisation et requêtes sur 5 projets | P |
| PostgreSQL | Base relationnelle | Base des projets Kubernetes et Popeye | P |
| MongoDB | Base documentaire | Base du générateur OTP | P |
| Redis | Cache et files | File de votes de l'application Kubernetes | P kubernetes |

## Points à confirmer par Jérémie

1. **NumPy** : on le retire, ou il a servi dans un projet ?
2. **Java** : quels projets exactement (ZeroDay, Vaultborn) ?
3. **Mimikatz, pypykatz** : la mention « en lab Active Directory » te va ?
4. **Cyberdéfense** : la mention « (TryHackMe) » est-elle acceptable, ou préfères-tu « en formation » ?
