# Projets : vérification et notes de complexité (2026-10-24)

**Notes validées** : elles sont appliquées dans `src/content/complexity.ts`, qui fait foi. Changements de Jérémie par rapport à la proposition ci-dessous : Argos 5 et ZeroDay 5 (notés sur leur ambition), RAG PDF Chatbot 3, Career Coach 2. Le CTF est terminé (06/2026), Smart Fridge reste en « Gestion de projet », tous les projets sont gardés, et les projets sans lien public affichent « Code privé ».

Ce tableau est à valider ou corriger par Jérémie. Une fois validé, chaque note va dans `src/content/projects`, avec sa justification en champ éditorial non affiché.

## Le système de note (1 à 5)

Note = **1** + Difficulté technique (0–2) + Contraintes réelles (0–1) + Aboutissement (0–1).

- **Difficulté technique** : 0 = simple · 1 = plusieurs briques à intégrer · 2 = architecture ou sujet pointu.
- **Contraintes réelles** : vrais utilisateurs, production, sécurité, données sensibles, cadre autorisé.
- **Aboutissement** : fini et soigné (tests, doc, démo), et le projet impressionne.

Tri « Plus complexes » : note décroissante, puis le plus récent en premier.

## Le tableau

D = difficulté, C = contraintes, A = aboutissement.

| Projet | Métier | Fin | Équipe | D | C | A | **Note** | Justification |
|---|---|---|---|---|---|---|---|---|
| BlockTrader | dev, cyber, ia | en cours | 1 | 2 | 1 | 1 | **5** | Moteur de backtest, protocoles anti-surapprentissage, données de marché réelles ; 46 tests, CI durcie |
| Pentest — write-ups et audit | cyber | 10/2026 | 1 | 2 | 1 | 1 | **5** | Active Directory et élévation de privilèges ; un audit autorisé chez un client ; 25 rapports publiés |
| Salesforce Executor | dev | 06/2026 | 1 | 2 | 1 | 1 | **5** | Outil interne complet (exécution, planification, logs), en production chez ULIT |
| Argos | cyber, ia | en cours | 1 | 2 | 1 | 0 | **4** | Moteur OSINT avec provenance de chaque donnée, cadre légal écrit ; dépôt reconstruit le 10/10, encore jeune |
| ChatFlow | dev | 04/2026 | 4 | 2 | 0 | 1 | **4** | Messagerie temps réel web et desktop (Socket.IO, Electron) ; 110 tests |
| CTF du portfolio | cyber | en cours | 1 | 1 | 1 | 1 | **4** | 9 niveaux dans un terminal simulé, joué par de vrais visiteurs |
| Générateur OTP RCS | cyber, dev | 06/2026 | 6 | 1 | 1 | 0 | **3** | Authentification à deux facteurs par une API réelle d'envoi (hackathon) |
| Time Manager | dev | 10/2026 | 2 | 1 | 0 | 1 | **3** | API typée et front React ; 68 tests |
| Gandalf — Kubernetes | dev | 06/2026 | 1 | 2 | 0 | 0 | **3** | Cluster multi-nœuds : ingress, secrets, volumes, RBAC, supervision |
| Vaultborn | dev | 10/2025 | 1 | 1 | 0 | 1 | **3** | Action-RPG 2D complet : 7 classes, mondes, sauvegarde, patterns |
| ZeroDay | dev, cyber | en cours | 1 | 1 | 0 | 0 | **2** | En phase de conception (game design, première base technique) |
| RAG PDF Chatbot | ia | 05/2026 | 1 | 1 | 0 | 0 | **2** | RAG complet (FAISS, LangChain, Llama 3, Docker), projet guidé IBM |
| Meeting Companion | ia | 03/2026 | 1 | 1 | 0 | 0 | **2** | Chaîne voix vers texte puis LLM, projet guidé IBM |
| Assistant Translator | ia | 04/2026 | 1 | 1 | 0 | 0 | **2** | Chaîne voix, traduction et synthèse, projet guidé IBM |
| AI Voice Assistant | ia | 03/2026 | 1 | 1 | 0 | 0 | **2** | Assistant vocal (Watson, Groq), projet guidé IBM |
| LLM Context Wrapper | ia | 03/2026 | 1 | 1 | 0 | 0 | **2** | Mémoire de conversation autour d'un modèle Transformers, projet guidé IBM |
| Bookworm | ia | 06/2026 | 1 | 1 | 0 | 0 | **2** | Analyse de livres avec spaCy |
| Atlas Academy | cyber, ia | en cours | 1 | 1 | 0 | 0 | **2** | Plateforme d'apprentissage, en pause |
| Base de connaissance | cyber, ia, dev | en cours | 1 | 0 | 0 | 1 | **2** | 659 notes structurées sous Obsidian |
| Platino | dev | 10/2025 | 4 | 1 | 0 | 0 | **2** | Application web Express et PostgreSQL |
| POPEYE | dev | 11/2025 | 1 | 1 | 0 | 0 | **2** | Application multi-services avec Docker Compose |
| My_Marvin | dev | 11/2025 | 1 | 1 | 0 | 0 | **2** | Jenkins configuré entièrement par le code |
| Career Coach | ia | 04/2026 | 1 | 0 | 0 | 0 | **1** | Appel d'un LLM avec interface Gradio, projet guidé IBM |
| CyberPong | dev | 10/2025 | 1 | 0 | 0 | 0 | **1** | Jeu Pong en Python |
| Unit Converter | dev | 09/2025 | 1 | 0 | 0 | 0 | **1** | Convertisseur avec interface Tkinter |
| Smart Fridge | — | 12/2025 | 1 | 0 | 0 | 0 | **1** | Projet de gestion de projet |

## Vérification : ce qui est bon

- Les 17 liens GitHub publics répondent (code 200).
- Les dates des 4 applications IBM viennent de l'historique Git de chaque dépôt.

## Vérification : points à trancher

1. **Sans lien public** : BlockTrader, ChatFlow, Time Manager, Salesforce Executor (dépôt privé, normal), Gandalf, ZeroDay, Base de connaissance, Atlas Academy, Platino. Est-ce voulu (dépôts privés), ou faut-il ajouter des liens ?
2. **Smart Fridge** : aucun métier, et la stack se limite à « Gestion de projet ». On le garde, on le classe, ou on le retire ?
3. **Le CTF du portfolio** est noté « en cours » (pas de date de fin) mais « Terminé » comme statut. Lequel est juste ?
4. **CyberPong, Unit Converter** : à 1, ils tirent la vitrine vers le bas. On les garde en archive (en fin de liste), ou on les retire ?
5. **Les projets en archive** (Platino, POPEYE, My_Marvin, Vaultborn, CyberPong, Unit Converter, AI Voice Assistant, LLM Context Wrapper) s'affichent comme les autres. Faut-il les séparer, par exemple derrière un « Voir les anciens projets » ?
