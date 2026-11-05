// Copy of the Blockchain CTF tab. Its contracts come from https://github.com/JN13012/smart-contract-ctf
// (compiled into blockchainCtf.json by `npm run sync:blockchain-ctf`); only level 1 is playable so far.

export type BlockchainLevel = { id: number; title: string; summary: string; available: boolean }

export const blockchainLab = {
  tab: 'Blockchain',
  loading: 'Chargement du CTF Blockchain…',
  title: 'CTF Blockchain',
  /** The single phase title of the entry screen, as the other CTFs group their levels. */
  phase: 'Failles de smart contracts',
  levels: [
    { id: 1, title: 'Réentrance', summary: 'Vider un coffre', available: true },
    { id: 2, title: 'Initialisation non protégée', summary: 'Vol d’un portefeuille', available: false },
    { id: 3, title: 'Hasard prévisible', summary: 'Loterie truquée', available: false },
  ] satisfies BlockchainLevel[],
  /** Shown next to the intro screen: what a smart contract is, and how a level is played. */
  howItWorks: {
    title: 'Comment ça marche',
    points: [
      'Chaque niveau déploie un vrai smart contract avec une faille connue. Lisez son code, trouvez la faille, exploitez-la depuis la console.',
      'Rien n’est simulé : les contrats du dépôt GitHub tournent sur l’EVM, le moteur d’Ethereum, dans votre navigateur.',
      'C’est une blockchain de test locale : pas de réseau, ni portefeuille, ni argent réel.',
    ],
  },
  soon: 'À venir',
  done: 'Réussi',
  start: 'Commencer',
  repoLink: 'Contrats, tests et write-ups sur GitHub',
  back: 'Revenir à la présentation',
  drawerTitle: 'Niveaux blockchain',
  prompt: 'mallory@chain:~$',
  inputLabel: 'Commande',
  placeholder: 'Tapez help pour la liste des commandes',
  booting: 'Démarrage de la blockchain locale…',
} as const

/** Level 1, the reentrancy vault. Amounts in ETH; the flag is client-side, as in the cyber CTF. */
export const reentrancyLevel = {
  heading: 'Niveau 1 · Réentrance',
  objective: 'Le coffre garde 10 ETH déposés par Alice et Bob. Vous êtes Mallory, avec 2 ETH : récupérez tout le coffre.',
  setup: { player: 2, alice: 5, bob: 5 },
  flag: 'FLAG{Reentrancy_Drained_The_Vault}',
  welcome: [
    'Blockchain locale prête. Le coffre est déployé à l’adresse « vault ».',
    'Tapez help pour les commandes.',
  ],
  hints: [
    'Lisez withdraw() dans Vault.sol : que se passe-t-il entre l’envoi des ETH et la mise à zéro du solde ?',
    'Quand un contrat reçoit des ETH, sa fonction receive() s’exécute. Lisez VaultAttacker.sol : que fait la sienne ?',
    'Déployez l’attaquant contre le coffre (forge create VaultAttacker --constructor-args vault), puis lancez attack() avec 1 ETH de mise.',
  ],
  hint: 'Indice',
  previous: 'Indice précédent',
  next: 'Indice suivant',
  solved: 'Coffre vidé. Son registre indique toujours 5 ETH pour Alice et 5 ETH pour Bob, mais il ne contient plus rien : leurs retraits échoueront.',
  flagLabel: 'Flag',
  writeup: 'Lire le write-up : la faille, l’exploit, la correction',
  balances: 'Soldes',
  sources: 'Code source',
} as const

/** Help printed by the console; the syntax is Foundry's (cast, forge), simplified to this level. */
export const blockchainHelp = [
  'Commandes (syntaxe Foundry, simplifiée) :',
  '  ls · cat <fichier> · accounts · reset · clear',
  '  cast balance <compte>',
  '  cast call <contrat> "<fonction>(<types>)" [args]',
  '  cast send <contrat> "<fonction>()" [--value 1ether]',
  '  forge create <Contrat> --constructor-args <args>',
  'Comptes : mallory, alice, bob, vault, attacker ou 0x…',
  'Exemples :',
  '  cast call vault "balanceOf(address)" alice',
  '  cast send vault "deposit()" --value 1ether',
]
