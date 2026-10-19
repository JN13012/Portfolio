import type { Project } from '../types'

// Facts verified in /home/cyber/work/Block-Trader on 2026-10-17 (paths in `source`).
export const blocktrader: Project = {
  slug: 'blocktrader',
  tier: 'dossier',
  status: 'test',
  tracks: ['dev', 'cyber', 'ia'],
  title: 'BlockTrader',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'personal',
  summary: {
    fr: 'Banc de recherche pour stratégies de trading crypto, conçu pour ne pas se mentir : protocoles écrits avant les calculs, chaque essai enregistré, garde-fous contre le surapprentissage. En paper trading uniquement.',
    en: 'A research bench for crypto trading strategies, built not to fool itself: protocols written before any computation, every trial logged, safeguards against overfitting. Paper trading only.',
  },
  angles: {
    dev: {
      fr: 'Moteur Python compilé (numba), vérifié contre VectorBT et une boucle de référence, 46 tests, CI durcie, exécution serverless.',
      en: 'Compiled Python engine (numba), checked against VectorBT and a reference loop, 46 tests, hardened CI, serverless execution.',
    },
    cyber: {
      fr: 'Aucune clé ni signature, CI au moindre privilège avec actions épinglées par SHA, architecture de garde conçue pour le passage au réel.',
      en: 'No key and no signing, least-privilege CI with SHA-pinned actions, a guard architecture designed for going live.',
    },
    ia: {
      fr: 'Méthodologie statistique contre le surapprentissage (Sharpe dégonflé, holdout scellé) et une règle de sûreté : l’IA ne pourra que réduire l’exposition.',
      en: 'Statistical methodology against overfitting (deflated Sharpe, sealed holdout) and a safety rule: AI will only ever be able to reduce exposure.',
    },
  },
  sections: [
    {
      kind: 'problem',
      title: { fr: 'Le problème', en: 'The problem' },
      body: {
        fr: 'La plupart des backtests sont trop beaux pour être vrais : à force d’essayer des variantes, on finit par trouver une stratégie qui a « marché » par hasard, ou qui utilise sans le savoir des informations du futur.',
        en: 'Most backtests are too good to be true: after enough variants, some strategy will have “worked” by chance, or will quietly use information from the future.',
      },
    },
    {
      kind: 'approach',
      title: { fr: 'La méthode', en: 'The method' },
      body: {
        fr: 'Chaque protocole est figé par écrit avant le moindre calcul (13 pré-enregistrements, commités avant leurs résultats). Chaque essai, échecs compris, est inscrit dans un registre (3 349 lignes). Le Sharpe est corrigé du nombre d’essais (Bailey et López de Prado, 2014), et une période de test scellée ne peut être consommée qu’une fois.',
        en: 'Every protocol is frozen in writing before any computation (13 pre-registrations, committed before their results). Every trial, failures included, goes into a registry (3,349 rows). The Sharpe ratio is deflated by the number of trials (Bailey and López de Prado, 2014), and a sealed holdout period can only be used once.',
      },
    },
    {
      kind: 'architecture',
      title: { fr: 'L’architecture', en: 'Architecture' },
      body: {
        fr: 'Moteur de backtest en Python 3.12 compilé avec numba, dont les résultats sont recoupés avec VectorBT et avec une boucle de référence. Le paper trading tourne toutes les 4 heures sans serveur : Google Cloud Scheduler déclenche un workflow GitHub Actions, qui lit des cotations on-chain en lecture seule (Uniswap v3) sur Ethereum et Arbitrum. Un tableau de bord React suit le journal.',
        en: 'Backtest engine in Python 3.12 compiled with numba, its results cross-checked against VectorBT and a reference loop. Paper trading runs every 4 hours without a server: Google Cloud Scheduler triggers a GitHub Actions workflow that reads on-chain quotes read-only (Uniswap v3) on Ethereum and Arbitrum. A React dashboard follows the journal.',
      },
    },
    {
      kind: 'security',
      title: { fr: 'La sécurité', en: 'Security' },
      body: {
        fr: 'Aucune clé privée, aucune signature, aucun fonds. La CI est au moindre privilège : lecture seule par défaut, actions épinglées par empreinte SHA, et le seul job autorisé à écrire n’exécute aucun code du projet. Un test injecte volontairement une stratégie qui « triche » avec le futur et vérifie qu’elle est détectée. Pour un éventuel passage au réel, l’architecture de garde est conçue (fonds dans un Safe, permissions Zodiac, clé dans un HSM Cloud KMS, coupe-circuit Ledger) mais pas implémentée.',
        en: 'No private key, no signing, no funds. CI runs with least privilege: read-only by default, actions pinned by SHA, and the only job allowed to write runs no project code. A test deliberately injects a strategy that “cheats” with the future and checks that it gets caught. For a possible move to real funds, the guard architecture is designed (funds in a Safe, Zodiac permissions, key in a Cloud KMS HSM, Ledger kill switch) but not implemented.',
      },
    },
    {
      kind: 'result',
      title: { fr: 'Le résultat', en: 'The result' },
      body: {
        fr: 'Le banc a fait son travail : il a montré qu’aucune des stratégies testées n’est statistiquement prouvée sur l’historique. Le paper trading tourne depuis le 8 octobre 2026 ; un verdict sur l’exécution est prévu à trois mois, aucun verdict de performance avant un an.',
        en: 'The bench did its job: it showed that none of the strategies tested is statistically proven on historical data. Paper trading has been running since 8 October 2026; an execution verdict is planned after three months, no performance verdict before a year.',
      },
    },
    {
      kind: 'limits',
      title: { fr: 'Les limites', en: 'Limits' },
      body: {
        fr: 'Paper trading uniquement. Aucun module d’IA n’est encore branché : la règle « l’IA ne peut que freiner » est une contrainte de conception. Dépôt privé.',
        en: 'Paper trading only. No AI module is wired in yet: the “AI can only brake” rule is a design constraint. Private repository.',
      },
    },
  ],
  stack: ['Python', 'numba', 'pandas', 'VectorBT', 'web3.py', 'GitHub Actions', 'Google Cloud Scheduler', 'React', 'TypeScript'],
  links: { privateRepo: true },
  facts: [
    { value: '46', label: { fr: 'tests', en: 'tests' }, source: "grep -rE '^\\s*def test_' tests/ (46 functions, 55 collected cases)" },
    { value: '3 349', label: { fr: 'essais enregistrés', en: 'logged trials' }, source: 'research/registry.csv (data rows)' },
    { value: '13', label: { fr: 'protocoles pré-enregistrés', en: 'pre-registered protocols' }, source: 'research/PREREG_V*.md' },
    { value: '0 €', label: { fr: 'de fonds réels engagés', en: 'of real funds at stake' }, source: 'README.md:7-8, docs/SAFETY.md' },
  ],
  scale: { months: 3, tests: 46 },
  doNotClaim: [
    'Any return, CAGR, Sharpe or drawdown figure (they exist in docs/STRATEGIES.md and research/: never display)',
    'Live trading, real funds, "AI-driven" or "AI-powered" trading',
    'Safe / KMS / Zodiac as implemented',
    '"3,350 strategies" (it is 3,349 logged trial rows, ~1,500 distinct variants)',
  ],
}
