# Descriptions des projets : lot 1, projets perso & pro (2026-10-26)

À valider ou corriger par Jérémie : écris directement dans ce fichier (« OK », ou ta version), je reporterai dans `src/content/projects`.

## Le problème principal : les cartes coupent le texte

La carte n'affiche que **2 lignes du résumé, soit environ 90 caractères**. Or les résumés font de 150 à 290 caractères : sur les 27 projets, seuls 3 tiennent en entier. Sur la carte, presque toutes les phrases sont coupées au milieu.

**Proposition** : chaque projet a deux textes.
- **Accroche (carte)** : une phrase complète, 90 caractères maximum. Elle dit ce que c'est et ce qui est remarquable.
- **Résumé (fenêtre)** : 2 à 3 phrases, au niveau d'un recruteur : quoi, comment, où en est le projet.

Les sections détaillées des grands projets (problème, architecture, sécurité…) restent dans la fenêtre. Je ne les retouche que là où un chiffre a changé.

## Chiffres périmés trouvés dans les dépôts

| Projet | Affiché | Dépôt aujourd'hui | Source |
|---|---|---|---|
| BlockTrader | 3 349 essais enregistrés | **3 973** | `research/registry.csv` |
| BlockTrader | 13 protocoles pré-enregistrés | **14** (V12 ajouté le 20/10) | `research/PREREG_V*.md` |
| Argos | 62 tests | **67** | `def test_` dans `tests/` |

Je les corrige dans tous les cas.

---

## 1. BlockTrader

**Accroche (nouveau, 82 car.)**
> Bot de trading crypto en test : 40 stratégies validées contre le surapprentissage.

**Résumé : actuel**
> Bot de trading crypto sécurisé, actuellement en phase de test : il conçoit et teste des stratégies sur BTC et ETH, étudie le marché à partir d'une dizaine de sources de données publiques, et vise à être piloté ensuite par une IA qui choisira les stratégies à suivre en fonction du marché.

**Résumé : proposé**
> Bot de trading crypto en phase de test, sans fonds réels. Il fait tourner 40 stratégies sur BTC et ETH, validées par une méthode statistique contre le surapprentissage, et observe le marché à partir d'une dizaine de sources publiques. Objectif : qu'une IA choisisse ensuite les stratégies selon le marché ; elle n'est pas encore branchée.

Pourquoi : « sécurisé » ne dit rien de précis. Le chiffre des 40 stratégies et la méthode sont ce qui distingue le projet. La phrase actuelle est trop longue.

## 2. Argos

**Accroche (nouveau, 87 car.)**
> Plateforme OSINT où chaque donnée garde sa source ; agents IA conçus, pas encore codés.

**Résumé : actuel**
> Projet de fin d'études Epitech en cybersécurité. Le premier module collecte des informations publiques sur les entreprises en gardant la source de chaque donnée ; une couche d'agents IA est en conception.

**Résumé : proposé**
> Projet de fin d'études Epitech, poursuivi comme projet personnel : une plateforme OSINT et cybersécurité. Le premier module, en ligne de commande, recherche des entreprises dans la base publique SIRENE de l'INSEE, garde la source et la date de chaque donnée et produit un rapport lisible. Les agents IA sont conçus et documentés, pas encore codés.

Pourquoi : le texte actuel ne dit pas ce que fait le module (SIRENE, ligne de commande, rapports : tout est dans le README depuis le 12/10).

**Question** : dans le site, Argos est classé « personnel » alors que le texte dit « projet de fin d'études Epitech ». Lequel est juste ? Si c'est un projet Epitech poursuivi au-delà, il faut le classer `epitech` avec la mention « perso & pro », comme prévu dans le modèle.

## 3. Pentest - write-ups et audit

**Accroche (nouveau, 64 car.)**
> 25 rapports de pentest publiés et un premier audit web autorisé.

**Résumé** : je garde l'actuel, il est juste et assez court.
> 25 rapports de tests d'intrusion publiés sur des environnements d'entraînement, et un premier audit web dans un cadre autorisé, accompagnés du parcours TryHackMe Jr Penetration Tester.

## 4. ZeroDay

**Accroche (nouveau, 86 car.)**
> Jeu de stratégie cyber en conception : 141 000 mots de game design, base Unity testée.

**Résumé** : je garde l'actuel.
> Jeu de stratégie sur le thème de la cybersécurité, en phase de conception : un corpus de game design versionné, une banque de termes alignée sur MITRE ATT&CK et une première fondation technique sous Unity.

## 5. Code Executor (Salesforce)

**Accroche (nouveau, 63 car.)**
> Éditeur de scripts Salesforce, utilisé en production chez ULIT.

**Résumé : actuel**
> Éditeur interne pour l'écosystème Salesforce, utilisé en production chez ULIT : exécution, planification et chaînage de scripts, sauvegarde et suivi des logs.

C'est le seul projet en production réelle, et c'est le plus pauvre en détails : pas de chiffres, pas de section. **Questions pour l'enrichir** (réponds seulement à ce que tu peux prouver) :
1. Quel problème il résout : qu'est-ce que les équipes faisaient avant, et en combien de temps ?
2. Qui l'utilise : combien de personnes ou d'équipes chez ULIT ?
3. Une donnée concrète : nombre de scripts, d'exécutions, temps gagné ?
4. Une capture d'écran est-elle possible (sans données client) ?

## 6. CTF du portfolio

**Accroche (nouveau, 75 car.)**
> CTF en 9 niveaux jouable sur ce site, de la reconnaissance à la forensique.

**Résumé : proposé** (ajoute qu'on peut y jouer tout de suite)
> Un CTF en 9 niveaux jouable dans le Lab de ce site, dans un terminal simulé : de la reconnaissance à l'analyse SIEM, la forensique et le durcissement. La progression est gardée dans le navigateur.

Petite incohérence : la durée affichée va de 05/2026 à 06/2026, mais la durée utilisée pour le tri est de 5 mois. Je mets 2 mois, sauf si tu me dis le contraire.

## 7. Base de connaissance

**Accroche (nouveau, 86 car.)**
> 659 notes Obsidian : procédures, cheatsheets et retours d'expérience cyber, IA et dev.

**Résumé** : je garde l'actuel. Le chiffre de 659 notes date du 17/10 : donne-moi le nombre actuel si tu veux l'actualiser.

## 8. Argos Security Arena

**Accroche (nouveau, 65 car.)**
> Plateforme d'entraînement cyber, en pause : future arène d'Argos.

**Résumé** : je garde l'actuel.
> Plateforme d'entraînement cyber (parcours, modules, salles, progression), en pause : elle deviendra l'arène d'entraînement d'Argos, un lab où s'exercer à l'attaque et à la défense.

---

## Ce que je ferai après ta validation

1. Ajouter le champ « accroche » au modèle de projet et l'afficher sur les cartes ; le résumé reste dans la fenêtre.
2. Reporter les textes validés et les chiffres à jour, régénérer `docs/relecture-contenu.md`.
3. Passer au lot 2 (projets de formation) avec la même méthode.
