import type { Project } from '../types'
import blockTraderEmblemImg from '../../assets/Logos/BlockTrader_Emblem.webp'
import blockTraderImg from '../../assets/Projets/BlockTrader.webp'
import blockTraderStrategiesImg from '../../assets/Projets/BlockTrader_Strategies.webp'
import blockTraderTendanceImg from '../../assets/Projets/BlockTrader_Tendance.webp'

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
    fr: 'Bot de trading crypto en paper trading : 42 stratégies évaluées avec un protocole anti-surapprentissage.',
  },
  summary: {
    fr: 'Bot de trading crypto en paper trading, en conditions réelles. Il a testé des milliers de stratégies sur huit ans d’historique BTC et ETH pour ne garder que les plus prometteuses. Relié à de nombreuses sources de données publiques, il suit déjà 11 indicateurs du marché ; demain, une IA les analysera pour lire la situation, réduire l’exposition et donner la main aux stratégies les plus adaptées.',
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
  images: [
    { src: blockTraderEmblemImg, emblemHeight: '87%' },
    { src: blockTraderImg },
    { src: blockTraderStrategiesImg },
    { src: blockTraderTendanceImg },
  ],
  stack: ['Python', 'NumPy', 'Numba', 'Pandas', 'VectorBT', 'web3.py', 'GitHub Actions', 'Google Cloud Scheduler', 'React', 'TypeScript'],
  links: { privateRepo: true },
  facts: [
    { value: '≈ 4 000', label: { fr: 'stratégies testées' }, source: 'strategy registry: 3,973 backtested configurations (~1,500 distinct variants), 2026-10-26' },
    { value: '42', label: { fr: 'stratégies sélectionnées' }, source: 'Block-Trader docs/STRATEGIES.md: « Les 42 stratégies, rangées en 7 groupes » (read 2026-11-06)' },
    { value: '7', label: { fr: 'familles de stratégies', en: 'strategy families' }, source: 'Block-Trader docs/STRATEGIES.md (read 2026-11-06)' },
    { value: '11', label: { fr: 'indicateurs de marché suivis', en: 'market indicators tracked' }, source: 'blocktrader/data/observatoire.py: 11 source functions (2026-10-26)' },
  ],
  scale: { months: 3, tests: 56 },
}
