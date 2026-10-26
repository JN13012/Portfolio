import type { Project } from '../types'

// Facts verified in /home/cyber/work/Block-Trader on 2026-10-17, refreshed 2026-10-24 (paths in `source`).
export const blocktrader: Project = {
  slug: 'blocktrader',
  tier: 'dossier',
  status: 'development',
  // AI is the target (validated by Jérémie, 2026-10-24): the text always says it is not wired in yet.
  tracks: ['ia', 'data', 'dev'],
  title: 'BlockTrader',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'personal',
  summary: {
    fr: 'Bot de trading crypto sécurisé, actuellement en phase de test : il conçoit et teste des stratégies sur BTC et ETH, étudie le marché à partir d’une dizaine de sources de données publiques, et vise à être piloté ensuite par une IA qui choisira les stratégies à suivre en fonction du marché.',
    en: 'A secure crypto trading bot, currently in its test phase: it designs and tests strategies on BTC and ETH, studies the market from a dozen public data sources, and aims to be steered later by an AI that will choose which strategies to follow depending on the market.',
  },
  angles: {
    ia: {
      fr: 'Pensé pour être piloté par une IA : stratégies validées et lecture du marché lui fourniront des conclusions vérifiables, et une règle de sûreté borne déjà ce qu’elle pourra faire.',
      en: 'Designed to be steered by an AI: validated strategies and market readings will give it verifiable conclusions, and a safety rule already bounds what it will be allowed to do.',
    },
    data: {
      fr: 'Un observatoire du marché qui historise une dizaine de sources publiques, et une méthodologie statistique contre le surapprentissage (Sharpe dégonflé, holdout scellé).',
      en: 'A market observatory logging a dozen public sources, and a statistical methodology against overfitting (deflated Sharpe, sealed holdout).',
    },
    dev: {
      fr: 'Moteur Python compilé (numba), vérifié contre VectorBT et une boucle de référence, 56 tests, CI durcie, exécution serverless.',
      en: 'Compiled Python engine (numba), checked against VectorBT and a reference loop, 56 tests, hardened CI, serverless execution.',
    },
  },
  sections: [
    {
      kind: 'problem',
      title: { fr: 'Le problème', en: 'The problem' },
      body: {
        fr: 'Un bot de trading ne vaut que par ses stratégies. Or la plupart des backtests sont trop beaux pour être vrais : à force d’essayer des variantes, on finit par trouver une stratégie qui a « marché » par hasard, ou qui utilise sans le savoir des informations du futur. Et une IA branchée sur de mauvaises stratégies ne ferait qu’amplifier l’erreur.',
        en: 'A trading bot is only as good as its strategies. Yet most backtests are too good to be true: after enough variants, some strategy will have “worked” by chance, or will quietly use information from the future. And an AI plugged into bad strategies would only amplify the mistake.',
      },
    },
    {
      kind: 'approach',
      title: { fr: 'Les stratégies', en: 'The strategies' },
      body: {
        fr: 'Le bot fait tourner 40 stratégies en parallèle, réparties en 6 familles : suivre la tendance, choisir entre BTC et ETH, diversifier, racheter dans les chutes, grilles, et des chefs d’orchestre qui répartissent le capital entre stratégies. Chaque protocole est figé par écrit avant le moindre calcul et chaque essai, échecs compris, est inscrit dans un registre (3 349 lignes). Les résultats sont corrigés du nombre d’essais, pour ne pas confondre chance et vraie performance, et une période de test mise de côté ne sert qu’une seule fois.',
        en: 'The bot runs 40 strategies side by side, in 6 families: trend following, choosing between BTC and ETH, diversifying, buying the dips, grids, and orchestrators that allocate capital between strategies. Every protocol is frozen in writing before any computation and every trial, failures included, goes into a registry (3,349 rows). Results are corrected for the number of trials, so luck is not mistaken for real performance, and a held-out test period is used only once.',
      },
    },
    {
      kind: 'architecture',
      title: { fr: 'La data et l’architecture', en: 'Data and architecture' },
      body: {
        fr: 'À chaque passage, un observatoire du marché note une dizaine de données publiques, sans clé ni compte : financement et positions ouvertes des contrats perpétuels, volatilité implicite des options, indice Fear & Greed, stablecoins en circulation, réserves des bourses, rapport COT du CME. Il se constitue ainsi un historique daté pour étudier le marché sans regarder dans le futur. Le moteur de backtest, en Python compilé avec numba, est recoupé avec VectorBT et une boucle de référence. Le paper trading tourne toutes les 4 heures sans serveur (Google Cloud Scheduler déclenche GitHub Actions) sur des cotations Uniswap v3 lues on-chain, sur Ethereum et Arbitrum, et un tableau de bord React suit le tout.',
        en: 'On every run, a market observatory records a dozen public data points, with no key or account: perpetual funding and open interest, option implied volatility, the Fear & Greed index, stablecoin supply, exchange reserves, the CME COT report. It builds a dated history to study the market without looking into the future. The backtest engine, Python compiled with numba, is cross-checked against VectorBT and a reference loop. Paper trading runs every 4 hours without a server (Google Cloud Scheduler triggers GitHub Actions) on Uniswap v3 quotes read on-chain, on Ethereum and Arbitrum, and a React dashboard follows it all.',
      },
    },
    {
      kind: 'security',
      title: { fr: 'La sécurité', en: 'Security' },
      body: {
        fr: 'Aucune clé privée, aucune signature, aucun fonds. La CI est au moindre privilège : lecture seule par défaut, actions épinglées par empreinte SHA, et le seul job autorisé à écrire n’exécute aucun code du projet. Une donnée manquante ou incohérente met le bot en pause, jamais en position. Un test injecte volontairement une stratégie qui « triche » avec le futur et vérifie qu’elle est détectée. Pour un éventuel passage au réel, l’architecture de garde est conçue (fonds dans un Safe, permissions Zodiac, clé dans un HSM Cloud KMS, coupe-circuit Ledger) mais pas implémentée.',
        en: 'No private key, no signing, no funds. CI runs with least privilege: read-only by default, actions pinned by SHA, and the only job allowed to write runs no project code. Missing or inconsistent data pauses the bot, never opens a position. A test deliberately injects a strategy that “cheats” with the future and checks that it gets caught. For a possible move to real funds, the guard architecture is designed (funds in a Safe, Zodiac permissions, key in a Cloud KMS HSM, Ledger kill switch) but not implemented.',
      },
    },
    {
      kind: 'result',
      title: { fr: 'Où en est le projet', en: 'Where it stands' },
      body: {
        fr: 'Le banc d’essai a fait son travail : il a montré qu’aucune des stratégies testées n’est statistiquement prouvée sur l’historique, ce qui évite de confier de mauvaises stratégies à une IA. La phase de test tourne depuis le 8 octobre 2026 : un premier verdict sur l’exécution (coûts, signaux, délais) est prévu en janvier 2027 ; la performance, elle, se jugera sur au moins un an de marché.',
        en: 'The test bench did its job: it showed that none of the strategies tested is statistically proven on historical data, which keeps bad strategies away from a future AI. The test phase has been running since 8 October 2026: a first verdict on execution (costs, signals, delays) is due in January 2027; performance will be judged over at least a year of market.',
      },
    },
    {
      kind: 'limits',
      title: { fr: 'La suite : le pilotage par IA', en: 'Next: AI steering' },
      body: {
        fr: 'L’IA n’est pas encore branchée. Elle s’appuiera sur les conclusions de l’observatoire pour choisir parmi les stratégies validées, avec une règle de sûreté déjà écrite : l’IA pourra réduire l’exposition ou mettre en pause, jamais déclencher un achat ni relever une limite. Paper trading uniquement, dépôt privé.',
        en: 'The AI is not wired in yet. It will draw on the observatory’s conclusions to choose among validated strategies, under a safety rule already written down: the AI may reduce exposure or pause, never trigger a purchase or raise a limit. Paper trading only, private repository.',
      },
    },
  ],
  stack: ['Python', 'NumPy', 'Numba', 'pandas', 'VectorBT', 'web3.py', 'GitHub Actions', 'Google Cloud Scheduler', 'React', 'TypeScript'],
  links: { privateRepo: true },
  facts: [
    { value: '56', label: { fr: 'tests', en: 'tests' }, source: "grep -rE '^\\s*def test_' tests/ (56 functions, 2026-10-24)" },
    { value: '3 349', label: { fr: 'essais enregistrés', en: 'logged trials' }, source: 'research/registry.csv (data rows)' },
    { value: '13', label: { fr: 'protocoles pré-enregistrés', en: 'pre-registered protocols' }, source: 'research/PREREG_V*.md' },
    { value: '0 €', label: { fr: 'de fonds réels engagés', en: 'of real funds at stake' }, source: 'README.md:7-8, docs/SAFETY.md' },
  ],
  scale: { months: 3, tests: 56 },
  doNotClaim: [
    'Any return, CAGR, Sharpe or drawdown figure in the text (dashboard screenshots may show them: Jérémie, 2026-10-24)',
    'Live trading, real funds, or AI steering as existing (it is the goal: always say it is not wired in yet)',
    'An AI that can buy or raise limits (docs/SAFETY.md: AI and news can only brake)',
    'Safe / KMS / Zodiac as implemented',
    '"3,350 strategies" (it is 3,349 logged trial rows, ~1,500 distinct variants). « 40 stratégies, 6 familles »: dashboard Strategies page, 2026-10-24',
  ],
}
