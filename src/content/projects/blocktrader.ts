import type { Project } from '../types'

// Facts verified in /home/cyber/work/Block-Trader on 2026-10-17, refreshed 2026-10-26 (registry: 3,973 rows, 14 protocols; paths in `source`).
export const blocktrader: Project = {
  slug: 'blocktrader',
  tier: 'card',
  status: 'paper-trading',
  // AI is the target (validated by Jérémie, 2026-10-24): the text always says it is not wired in yet.
  tracks: ['ia', 'data', 'dev', 'blockchain'],
  title: 'BlockTrader',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Bot de trading crypto en paper trading : 40 stratégies évaluées avec un protocole anti-surapprentissage.',
  },
  summary: {
    fr: 'Bot de trading crypto en paper trading : 40 stratégies sur BTC et ETH, évaluées par backtest. Une IA pourra ensuite réduire l’exposition ou mettre en pause certaines stratégies pour en favoriser d’autres.',
  },
  angles: {
    ia: {
      fr: 'Pensé pour être piloté par une IA : stratégies évaluées et lecture du marché lui fourniront des conclusions vérifiables, et une règle de sûreté borne déjà ce qu’elle pourra faire.',
      en: 'Designed to be steered by an AI: validated strategies and market readings will give it verifiable conclusions, and a safety rule already bounds what it will be allowed to do.',
    },
    data: {
      fr: 'Un observatoire du marché qui historise 11 indicateurs publics, et une méthodologie statistique contre le surapprentissage (Sharpe dégonflé, holdout scellé).',
      en: 'A market observatory logging 11 public indicators, and a statistical methodology against overfitting (deflated Sharpe, sealed holdout).',
    },
    blockchain: {
      fr: 'Des stratégies sur BTC et ETH, et une lecture du marché crypto nourrie par des données publiques, dont celles de la chaîne via web3.py.',
    },
    dev: {
      fr: 'Moteur Python compilé (numba), vérifié contre VectorBT et une boucle de référence, 56 tests, CI durcie, exécution serverless.',
      en: 'Compiled Python engine (numba), checked against VectorBT and a reference loop, 56 tests, hardened CI, serverless execution.',
    },
  },
  stack: ['Python', 'NumPy', 'Numba', 'Pandas', 'VectorBT', 'web3.py', 'GitHub Actions', 'Google Cloud Scheduler', 'React', 'TypeScript'],
  links: { privateRepo: true },
  facts: [
    { value: '40', label: { fr: 'stratégies', en: 'strategies' }, source: 'dashboard Strategies page (2026-10-24)' },
    { value: '6', label: { fr: 'familles de stratégies', en: 'strategy families' }, source: 'dashboard Strategies page (2026-10-24)' },
    { value: '11', label: { fr: 'indicateurs de marché suivis', en: 'market indicators tracked' }, source: 'blocktrader/data/observatoire.py: 11 source functions (2026-10-26)' },
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
