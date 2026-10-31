import type { Project } from '../types'

// Facts verified in /home/cyber/work/Block-Trader on 2026-10-17, refreshed 2026-10-26 (registry: 3,973 rows, 14 protocols; paths in `source`).
export const blocktrader: Project = {
  slug: 'blocktrader',
  tier: 'dossier',
  status: 'development',
  stage: 'MVP',
  // AI is the target (validated by Jérémie, 2026-10-24): the text always says it is not wired in yet.
  tracks: ['ia', 'data', 'dev'],
  title: 'BlockTrader',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Bot de trading crypto en test : 40 stratégies validées contre le surapprentissage.',
    en: 'A crypto trading bot in testing: 40 strategies validated against overfitting.',
  },
  summary: {
    fr: 'Bot de trading crypto en phase de test, sans fonds réels : 40 stratégies sur BTC et ETH, validées par une méthode statistique, et un observatoire du marché. Une IA doit ensuite choisir les stratégies ; elle n’est pas encore branchée.',
    en: 'A crypto trading bot in its test phase, with no real funds: 40 strategies on BTC and ETH, validated by a statistical method, and a market observatory. An AI is meant to choose the strategies later; it is not wired in yet.',
  },
  angles: {
    ia: {
      fr: 'Pensé pour être piloté par une IA : stratégies validées et lecture du marché lui fourniront des conclusions vérifiables, et une règle de sûreté borne déjà ce qu’elle pourra faire.',
      en: 'Designed to be steered by an AI: validated strategies and market readings will give it verifiable conclusions, and a safety rule already bounds what it will be allowed to do.',
    },
    data: {
      fr: 'Un observatoire du marché qui historise 11 indicateurs publics, et une méthodologie statistique contre le surapprentissage (Sharpe dégonflé, holdout scellé).',
      en: 'A market observatory logging 11 public indicators, and a statistical methodology against overfitting (deflated Sharpe, sealed holdout).',
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
        fr: 'La plupart des backtests sont trop beaux pour être vrais : à force d’essayer des variantes, une stratégie finit par « marcher » par hasard, ou par utiliser sans le savoir des données du futur. Une IA branchée dessus ne ferait qu’amplifier l’erreur.',
        en: 'Most backtests are too good to be true: after enough variants, some strategy will “work” by chance, or quietly use data from the future. An AI plugged into it would only amplify the mistake.',
      },
    },
    {
      kind: 'approach',
      title: { fr: 'Les stratégies', en: 'The strategies' },
      body: {
        fr: '40 stratégies en 6 familles : suivre la tendance, choisir entre BTC et ETH, diversifier, racheter dans les chutes, grilles, et des chefs d’orchestre qui répartissent le capital.',
        en: '40 strategies in 6 families: trend following, choosing between BTC and ETH, diversifying, buying the dips, grids, and orchestrators that allocate the capital.',
      },
      points: [
        { label: { fr: 'Protocole', en: 'Protocol' }, text: { fr: 'chaque protocole est écrit avant le moindre calcul.', en: 'every protocol is written down before any computation.' } },
        { label: { fr: 'Registre', en: 'Registry' }, text: { fr: 'chaque essai y est inscrit, échecs compris (3\u00a0973).', en: 'every trial goes into it, failures included (3,973).' } },
        { label: { fr: 'Correction', en: 'Correction' }, text: { fr: 'les résultats sont corrigés du nombre d’essais, pour ne pas confondre chance et performance.', en: 'results are corrected for the number of trials, so luck is not mistaken for performance.' } },
        { label: { fr: 'Validation', en: 'Validation' }, text: { fr: 'une période de test mise de côté ne sert qu’une seule fois.', en: 'a held-out test period is used only once.' } },
      ],
    },
    {
      kind: 'architecture',
      title: { fr: 'La data et l’architecture', en: 'Data and architecture' },
      body: {
        fr: 'Tout tourne sans serveur et sans compte sur une plateforme d’échange.',
        en: 'Everything runs without a server and without an exchange account.',
      },
      points: [
        {
          label: { fr: 'Observatoire', en: 'Observatory' },
          text: {
            fr: '11 indicateurs publics, sans clé ni compte (financement des perpétuels, volatilité implicite, Fear & Greed, stablecoins, réserves des bourses, rapport COT du CME…), historisés et datés.',
            en: '11 public indicators, with no key or account (perpetual funding, implied volatility, Fear & Greed, stablecoins, exchange reserves, the CME COT report…), logged and dated.',
          },
        },
        { label: { fr: 'Moteur', en: 'Engine' }, text: { fr: 'Python compilé avec numba, recoupé avec VectorBT et une boucle de référence.', en: 'Python compiled with numba, cross-checked against VectorBT and a reference loop.' } },
        {
          label: { fr: 'Paper trading', en: 'Paper trading' },
          text: {
            fr: 'toutes les 4 heures (Google Cloud Scheduler déclenche GitHub Actions), sur des cotations Uniswap v3 lues on-chain sur Ethereum et Arbitrum, suivi dans un tableau de bord React.',
            en: 'every 4 hours (Google Cloud Scheduler triggers GitHub Actions), on Uniswap v3 quotes read on-chain on Ethereum and Arbitrum, followed in a React dashboard.',
          },
        },
      ],
    },
    {
      kind: 'security',
      title: { fr: 'La sécurité', en: 'Security' },
      body: { fr: 'Le bot ne peut rien perdre, et la CI ne peut rien fuiter.', en: 'The bot cannot lose anything, and the CI cannot leak anything.' },
      points: [
        { label: { fr: 'Aucun secret', en: 'No secrets' }, text: { fr: 'aucune clé privée, aucune signature, aucun fonds.', en: 'no private key, no signing, no funds.' } },
        { label: { fr: 'CI', en: 'CI' }, text: { fr: 'au moindre privilège, actions épinglées par empreinte SHA.', en: 'least privilege, actions pinned by SHA.' } },
        { label: { fr: 'Données', en: 'Data' }, text: { fr: 'une donnée manquante ou incohérente met le bot en pause, jamais en position.', en: 'missing or inconsistent data pauses the bot, never opens a position.' } },
        { label: { fr: 'Contrôle', en: 'Check' }, text: { fr: 'un test injecte une stratégie qui triche avec le futur et vérifie qu’elle est détectée.', en: 'a test injects a strategy that cheats with the future and checks that it gets caught.' } },
        {
          label: { fr: 'Passage au réel', en: 'Real funds' },
          text: { fr: 'l’architecture de garde est conçue (Safe, Zodiac, Cloud KMS, coupe-circuit Ledger), pas implémentée.', en: 'the guard architecture is designed (Safe, Zodiac, Cloud KMS, Ledger kill switch), not implemented.' },
        },
      ],
    },
    {
      kind: 'result',
      title: { fr: 'Où en est le projet', en: 'Where it stands' },
      body: {
        fr: 'Le banc d’essai a montré qu’aucune des stratégies n’est statistiquement prouvée sur l’historique, ce qui évite de confier de mauvaises stratégies à une IA. Le test en conditions réelles, sans argent, tourne depuis le 8 octobre 2026 : un verdict sur l’exécution est prévu en janvier 2027, et la performance se jugera sur au moins un an.',
        en: 'The test bench showed that none of the strategies is statistically proven on historical data, which keeps bad strategies away from an AI. Live testing, with no money, has been running since 8 October 2026: a verdict on execution is due in January 2027, and performance will be judged over at least a year.',
      },
    },
    {
      kind: 'limits',
      title: { fr: 'La suite : le pilotage par IA', en: 'Next: AI steering' },
      body: {
        fr: 'L’IA n’est pas encore branchée. Elle choisira parmi les stratégies validées, sous une règle déjà écrite : elle pourra réduire l’exposition ou mettre en pause, jamais acheter ni relever une limite. Dépôt privé.',
        en: 'The AI is not wired in yet. It will choose among validated strategies, under a rule already written down: it may reduce exposure or pause, never buy or raise a limit. Private repository.',
      },
    },
  ],
  stack: ['Python', 'NumPy', 'Numba', 'pandas', 'VectorBT', 'web3.py', 'GitHub Actions', 'Google Cloud Scheduler', 'React', 'TypeScript'],
  links: { privateRepo: true },
  facts: [
    { value: '40', label: { fr: 'stratégies', en: 'strategies' }, source: 'dashboard Strategies page (2026-10-24)' },
    { value: '6', label: { fr: 'familles de stratégies', en: 'strategy families' }, source: 'dashboard Strategies page (2026-10-24)' },
    { value: '11', label: { fr: 'indicateurs de marché suivis', en: 'market indicators tracked' }, source: 'blocktrader/data/observatoire.py: 11 source functions (2026-10-26)' },
    { value: '0 €', label: { fr: 'de fonds réels engagés', en: 'of real funds at stake' }, source: 'README.md:7-8, docs/SAFETY.md' },
  ],
  scale: { months: 3, tests: 56 },
  doNotClaim: [
    'Any return, CAGR, Sharpe or drawdown figure in the text (dashboard screenshots may show them: Jérémie, 2026-10-24)',
    'Live trading, real funds, or AI steering as existing (it is the goal: always say it is not wired in yet)',
    'An AI that can buy or raise limits (docs/SAFETY.md: AI and news can only brake)',
    'Safe / KMS / Zodiac as implemented',
    '"3,970 strategies" (it is 3,973 logged trial rows, ~1,500 distinct variants). « 40 stratégies, 6 familles »: dashboard Strategies page, 2026-10-24',
  ],
}
