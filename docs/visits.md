# Compteur de sessions

Affiché dans le footer, indépendant de Web Analytics. Une session d’onglet est
comptée dès le montage du portfolio, même pendant l’intro. Un rechargement ou une
relecture de l’intro ne crée pas de nouvelle session. Sans sessionStorage, seul
le total est lu. Sans service disponible, le footer affiche « Visites · — ».

D1 conserve un hash d’identifiant aléatoire et une expiration, aucune IP ni user
agent. Déduplication sur clé primaire et incrément par trigger, dans un batch
atomique. Le total reste acquis après suppression des sessions expirées.
Les identifiants expirent après 30 jours ; jusqu’à 100 entrées expirées sont
supprimées à chaque POST valide. Un onglet ouvert plus de 30 jours lit le total
sans être recompté. Le limiteur accepte 20 requêtes/minute par IP hachée (hors D1).
Cette protection et le contrôle d’origine ne prouvent pas qu’une visite est humaine.

## Reprise historique

La migration `0002_import_historical_visits.sql` ajoute une seule fois 7 visites
issues du récapitulatif Cloudflare Web Analytics fourni par le propriétaire le
31 octobre 2026 (7 visites, 10 pages vues). Elle préserve les sessions déjà
comptées dans D1. Le suivi des migrations Wrangler empêche un second ajout.

Le total public associe donc ce forfait historique aux sessions d’onglet D1.
Les deux méthodes diffèrent : ce total ne mesure pas des visiteurs uniques et
ne se synchronise pas automatiquement avec Analytics. Aucun identifiant de
session historique n’est inventé ou importé.

## Tester localement

```sh
npm run build
npx wrangler d1 migrations apply portfolio-visits --local
npx wrangler dev --local
```

Ouvrir l’URL Wrangler affichée. `npm run dev` seul ne fournit pas l’API D1.
Le flag `--local` utilise une base locale isolée, même avec le véritable UUID
dans `wrangler.toml`. Il ne modifie pas la base distante.

## Préparer la publication

La base `portfolio-visits` a été créée et son UUID réel est renseigné dans le
binding `VISITS_DB` de `wrangler.toml`.

1. Après autorisation uniquement : `npx wrangler d1 migrations apply portfolio-visits --remote`.
2. Après autorisation uniquement : `npm run deploy:worker`.

Le compteur est initialisé à zéro par la première migration, puis reçoit la
reprise historique de 7 visites par la deuxième. Les données locales ne sont pas publiées.
Vérifier `GET /api/visits`, une première visite, puis un rechargement dans le même
onglet. Les totaux ne correspondent pas nécessairement à ceux de Web Analytics.
