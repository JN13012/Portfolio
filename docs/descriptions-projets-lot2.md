# Descriptions des projets : lot 2, projets de formation (2026-10-26)

À valider par Jérémie. Sources relues : les dépôts locaux de `~/work` (Epitech, hackathons, `Coursera-Lab/*`), leur historique git, et le rapport T-PRO-600.

---

## 0. Ce qui ne va pas aujourd'hui

1. **Les 17 résumés sont coupés sur les cartes**, comme ceux du lot 1. Chacun reçoit donc une accroche (ci-dessous).
2. **Une affirmation fausse : le RAG PDF Chatbot n'est pas conteneurisé.**
   - Le dépôt n'a ni Dockerfile ni rien sur Docker dans le README.
   - Le modèle est Llama 3.3 70B sur watsonx.ai, appelé via LangChain.
   - Je retire « Docker » du résumé et de la stack.
3. **Des descriptions trop maigres** pour ce que font les projets :
   - Time Manager : la carte parle d'API typée et de tests, mais ne dit pas ce que fait l'application.
   - Career Coach : l'onglet « Conseils carrière » est oublié.
4. **Des tailles d'équipe à vérifier** (section 3).

---

## 1. Accroches (cartes)

| Projet | Accroche | Car. |
|---|---|---|
| Générateur OTP RCS | Backend 2FA : codes à 6 chiffres envoyés par RCS, hachés et limités. 3e place. | 78 |
| Hackathon Microsoft × Citiz | Où ouvrir une station d'autopartage : réseau piéton de 16,6 M de nœuds. 2e place. | 82 |
| ChatFlow | Messagerie temps réel : serveurs, salons, rôles, sur le web et en desktop. | 74 |
| Time Manager | App de pointage : employés, équipes et indicateurs, connexion Microsoft. | 72 |
| Bernstein - Kubernetes | Une app de vote en microservices déployée sur un cluster Kubernetes multi-nœuds. | 80 |
| Bookworm | Analyse de livres Gutenberg en NLP : thèmes, personnages, résumé et fiche. | 74 |
| Smart Fridge | Conception d'un produit : marché, personas, risques, budget et planning. | 72 |
| RAG PDF Chatbot | Chatbot RAG qui répond aux questions sur des CV en PDF, avec Llama 3. | 68 |
| Meeting Companion | Transcrit une réunion, puis en tire résumé, actions et tonalité. | 63 |
| Career Coach | Coach de carrière IA : optimise le CV, rédige la lettre, conseille. | 66 |
| Assistant Translator | Traducteur vocal : parler, traduire avec Llama 3.3, réécouter. | 62 |
| Platino | Job board étudiant : comptes, profils, candidatures, API Express. | 64 |
| POPEYE | Une app de vote en microservices, orchestrée avec Docker Compose. | 64 |
| My_Marvin | Jenkins entièrement configuré par le code (JCasC, Job DSL), en Docker. | 70 |
| Vaultborn | Action-RPG 2D en Java : 7 classes jouables, mondes connectés, sauvegarde. | 73 |
| AI Voice Assistant | Assistant vocal : la voix avec Watson, les réponses avec Llama 3 via Groq. | 73 |
| LLM Context Wrapper | Donner une mémoire de conversation à un modèle Hugging Face. | 60 |

## 2. Résumés à corriger

### RAG PDF Chatbot (correction d'une erreur)
> Un chatbot qui analyse des CV et des lettres de motivation en PDF et répond à des questions précises. Il découpe les documents, les indexe dans FAISS avec des embeddings Hugging Face, puis interroge Llama 3.3 sur watsonx.ai via LangChain, dans une interface Flask.

Stack : Python, LangChain, FAISS, Hugging Face, watsonx, Llama 3, Flask (Docker retiré).

### Time Manager (plus concret)
> Application de pointage pour une enseigne fictive : les employés pointent leurs arrivées et leurs départs, les managers gèrent leurs équipes et suivent des indicateurs. API NestJS et PostgreSQL, front React, connexion Microsoft (Entra ID), le tout en Docker derrière Caddy.

Ta part, d'après tes commits : le schéma de la base (utilisateurs, équipes, appartenances, pointages, corrections) et les équipes (création, règles métier, archivage). Je propose ce rôle à la place de « backend » : **« backend : base de données et équipes »**.

### Career Coach (onglet oublié)
> Un coach de carrière en trois onglets : il optimise un CV pour une offre, rédige la lettre de motivation et donne des conseils de carrière, avec Llama 3.2 sur IBM watsonx.ai et une interface Gradio.

### ChatFlow (ta part)
Le résumé est juste. D'après tes commits, tu as fait plus que le backend :
- le statut des membres (en ligne…) ;
- les invitations, avec pagination ;
- l'exclusion d'un membre ;
- les messages épinglés ;
- les notifications ;
- la CI.

Je propose le rôle **« backend et fonctionnalités communautaires »**.

### Les autres
Je garde les résumés de Citiz, OTP, Kubernetes, Bookworm, Smart Fridge, Meeting Companion, Assistant Translator, Platino, POPEYE, My_Marvin, Vaultborn, AI Voice Assistant et LLM Context Wrapper : je les ai recoupés avec les dépôts et ils sont justes.

## 3. Questions

1. **Tailles d'équipe**

   | Projet | Affiché | Dans git | À trancher |
   |---|---|---|---|
   | Générateur OTP RCS | équipe de 6 | 4 personnes ont commité (toi, Hatim, Marwan, Séverine) | équipe de 6, dont 2 sans commit ? |
   | Bookworm | seul | Noé Slimani a fait 2 commits (tokenizer, cleaner) | binôme ? |
   | Vaultborn, POPEYE, My_Marvin, Smart Fridge | seul | dépôts réimportés en un seul commit, impossible à voir | taille réelle ? |
2. **Time Manager** : le dernier commit date du 17/10. Le projet est-il rendu (statut « Terminé ») ou encore en cours ?
3. **AI Voice Assistant** : ton dossier local a 8 fichiers modifiés non commités, qui le transforment en « TikTok Voice Studio ». GitHub montre toujours l'assistant Watson + Groq, et la carte décrit la version GitHub. On la garde ainsi, ou ce travail devient un projet à part (le futur clone de voix) ?
4. **Bernstein - Kubernetes** : le README s'appelle « Gandalf - Kubernetes », et le sujet porte les deux noms (« Gandalf / Bernstein - T-DOP-603 »). On garde « Bernstein » ?

## 4. Les chiffres des cartes

Avec la règle du lot 1 (chiffres facultatifs, seulement s'ils sont parlants), je propose :
- **à garder** : OTP (3e place, 4 jours), Citiz (2e place, 16,6 M de nœuds) ;
- **à retirer** : ChatFlow (« ≈ 110 cas de test ») et Time Manager (« ≈ 68 cas de test »), pour la même raison que les tests d'Argos. Le nombre de tests passe dans le texte, s'il apporte quelque chose.
