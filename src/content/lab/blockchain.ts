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
    { id: 2, title: 'Initialisation non protégée', summary: 'Vol d’un portefeuille', available: true },
    { id: 3, title: 'Hasard prévisible', summary: 'Loterie truquée', available: true },
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
  /** Last welcome line of every level; the console colours the command in it. */
  typeHelp: 'Tapez help pour les commandes.',
} as const

/** Level 1, the reentrancy vault. Amounts in ETH; the flag is client-side, as in the cyber CTF. */
export const reentrancyLevel = {
  heading: 'Niveau 1 · Réentrance',
  objective: 'Le coffre garde 10 ETH déposés par Alice et Bob. Vous êtes Mallory, avec 2 ETH : récupérez tout le coffre.',
  setup: { player: 2, alice: 5, bob: 5 },
  flag: 'FLAG{Reentrancy_Drained_The_Vault}',
  welcome: [
    'Blockchain locale prête. Le coffre est déployé à l’adresse « vault ».',
  ],
  hints: [
    'Lisez withdraw() dans Vault.sol : que se passe-t-il entre l’envoi des ETH et la mise à zéro du solde ?',
    'Quand un contrat reçoit des ETH, sa fonction receive() s’exécute. Lisez VaultAttacker.sol : que fait la sienne ?',
    'Déployez le contrat VaultAttacker en lui donnant l’adresse du coffre (forge create VaultAttacker --constructor-args vault), puis appelez sa fonction attack() avec 1 ETH de mise (cast send attacker "attack()" --value 1ether).',
  ],
  solved: 'Coffre vidé. Son registre indique toujours 5 ETH pour Alice et 5 ETH pour Bob, mais il ne contient plus rien : leurs retraits échoueront.',
  /** Write-up of this level in the CTF repository's writeups/ folder. */
  writeupFile: '01-reentrancy.md',
  /** What the console knows about this level: accounts and examples in help, programs to deploy. */
  console: {
    accounts: 'mallory, alice, bob, vault, attacker ou 0x…',
    accountsNote: 'Alice et Bob ont déposé tous leurs ETH dans le coffre. Leur part figure dans son registre : cast call vault "balanceOf(address)" alice',
    examples: [
      'cast interface vault',
      'cast call vault "balanceOf(address)" alice',
      'cast send vault "deposit()" --value 1ether',
    ],
    programs: {
      VaultAttacker: { needs: 'l’adresse du coffre à attaquer', deploy: 'forge create VaultAttacker --constructor-args vault' },
    },
  },
} as const

/** Level 2, the shared wallet behind a proxy, whose initializer anyone can call again. */
export const accessControlLevel = {
  heading: 'Niveau 2 · Initialisation non protégée',
  objective: 'Le portefeuille d’Alice garde 10 ETH, et seule sa propriétaire peut les retirer. Vous êtes Mallory, avec 2 ETH : videz-le.',
  setup: { player: 2, alice: 10 },
  flag: 'FLAG{Initialize_Is_Not_A_Constructor}',
  welcome: [
    'Blockchain locale prête. Le portefeuille d’Alice est déployé à l’adresse « wallet », derrière un proxy.',
  ],
  hints: [
    'Qui est le propriétaire ? cast call wallet "owner()". Dans SharedWallet.sol, withdraw() est bien réservée à ce propriétaire : la faille n’est pas là. Cherchez plutôt où owner est modifié.',
    'owner n’est écrit que dans initialize(). Au déploiement, Alice l’a appelée une fois pour se désigner propriétaire. Lisez-la : qu’est-ce qui empêche quelqu’un d’autre de l’appeler à son tour, avec sa propre adresse ?',
    'Rien ne l’en empêche : initialize() est publique et ne vérifie pas qu’elle a déjà servi. Nommez-vous propriétaire (cast send wallet "initialize(address)" mallory), puis retirez les 10 ETH avec withdraw(address,uint256).',
  ],
  solved: 'Portefeuille vidé. Il vous appartient désormais : Alice reçoit NotOwner sur son propre portefeuille.',
  writeupFile: '02-access-control.md',
  console: {
    accounts: 'mallory, alice, wallet ou 0x…',
    accountsNote: 'Alice a versé ses 10 ETH dans son portefeuille, wallet.',
    examples: [
      'cast interface wallet',
      'cast call wallet "owner()"',
      'cast balance wallet',
    ],
  },
} as const

/** Level 3, the lottery whose draw any contract can compute in the same block. */
export const randomnessLevel = {
  heading: 'Niveau 3 · Hasard prévisible',
  objective: 'La loterie garde une cagnotte de 10 ETH. Un ticket coûte 0,1 ETH : devinez le chiffre tiré, de 0 à 9, et vous gagnez tout. Vous êtes Mallory, avec 1 ETH : gagnez à coup sûr, sans compter sur la chance.',
  setup: { player: 1, pot: 10 },
  flag: 'FLAG{Block_Data_Is_Not_Random}',
  welcome: [
    'Blockchain locale prête. La loterie est déployée à l’adresse « lottery ».',
  ],
  hints: [
    'Lisez _draw() dans Lottery.sol : de quoi dépend le chiffre gagnant ? Tapez cast block : ces valeurs sont-elles secrètes ?',
    'Depuis la console, vous ne savez pas dans quel bloc votre ticket sera inclus. Un contrat qui joue, lui, s’exécute dans ce bloc : il lit les mêmes valeurs que la loterie. Lisez LotteryAttacker.sol.',
    'Déployez le contrat LotteryAttacker en lui donnant l’adresse de la loterie (forge create LotteryAttacker --constructor-args lottery), puis appelez sa fonction attack() avec le prix d’un ticket (cast send attacker "attack()" --value 0.1ether).',
  ],
  solved: 'Cagnotte gagnée à coup sûr : l’attaquant a calculé le chiffre dans le même bloc que la loterie. Un tirage fondé sur les valeurs du bloc n’a rien de secret pour un contrat.',
  /** Shown when the pot is won by a ticket typed by hand: no flag, the goal is a certain win. */
  luck: 'Gagné, mais par chance : une chance sur dix. Le flag demande une victoire certaine, qui ne dépend pas du hasard. Tapez reset pour relancer la loterie.',
  /** Shown when Mallory can no longer pay a ticket. */
  broke: 'Il ne vous reste pas de quoi payer un ticket (0,1 ETH). Tapez reset pour recommencer.',
  writeupFile: '03-randomness.md',
  console: {
    accounts: 'mallory, lottery, attacker ou 0x…',
    accountsNote: 'La cagnotte de 10 ETH est dans lottery.',
    examples: [
      'cast interface lottery',
      'cast send lottery "play(uint256)" 7 --value 0.1ether',
      'cast block',
    ],
    programs: {
      LotteryAttacker: { needs: 'l’adresse de la loterie à attaquer', deploy: 'forge create LotteryAttacker --constructor-args lottery' },
    },
  },
} as const

/** Labels of the level panel, shared by every level. */
export const levelUi = {
  hint: 'Indice',
  previous: 'Indice précédent',
  next: 'Indice suivant',
  flagLabel: 'Flag',
  writeup: 'Lire le write-up : la faille, l’exploit, la correction',
  balances: 'Soldes',
  sources: 'Code source',
} as const

/** Help printed by the console; the syntax is Foundry's (cast, forge), simplified to the CTF. */
export function blockchainHelp(level: { accounts: string; examples: readonly string[]; deploys: boolean; blocks: boolean }): string[] {
  return [
    'Commandes (syntaxe Foundry, simplifiée) :',
    '  ls · cat <fichier> · accounts · reset · clear',
    '  cast interface <contrat>   (fonctions et arguments attendus)',
    '  cast balance <compte>',
    ...(level.blocks ? ['  cast block   (dernier bloc : numéro, horodatage, prevrandao)'] : []),
    '  cast call <contrat> "<fonction>(<types>)" [args]   (lecture)',
    '  cast send <contrat> "<fonction>(<types>)" [args] [--value 1ether]   (transaction)',
    ...(level.deploys ? ['  forge create <Contrat> --constructor-args <args>'] : []),
    `Comptes : ${level.accounts}`,
    'Montants : 1ether, 0.5ether, 1gwei, ou un nombre en wei (1 ETH = 10^18 wei)',
    'Exemples :',
    ...level.examples.map(example => `  ${example}`),
  ]
}

type FunctionDoc = {
  summary: string
  params?: Record<string, string>
  /** Sample values in the command `cast interface` and the error messages suggest; ETH sent with `value`. */
  sample?: { args?: readonly string[]; value?: string }
}

/**
 * What each function does, printed by `cast interface` and in argument errors.
 * Keyed by contract, then function; parameter names are the ABI's.
 */
export const contractDocs: Record<string, Record<string, FunctionDoc>> = {
  Vault: {
    balanceOf: { summary: 'Solde que le coffre doit à account.', params: { account: 'le compte dont on lit le solde' }, sample: { args: ['alice'] } },
    deposit: { summary: 'Ajoute les ETH envoyés avec --value à votre solde.' },
    withdraw: { summary: 'Vous renvoie tout votre solde, puis le remet à zéro.' },
  },
  SharedWallet: {
    owner: { summary: 'Seul compte autorisé à retirer.' },
    initialize: { summary: 'Désigne le propriétaire. Prévue pour s’exécuter une fois, juste après le déploiement.', params: { initialOwner: 'le compte qui devient propriétaire' }, sample: { args: ['alice'] } },
    withdraw: { summary: 'Envoie amount wei du portefeuille à to. Réservée au propriétaire.', params: { to: 'le compte qui reçoit les ETH', amount: 'le montant, en wei ou en ether (10ether)' }, sample: { args: ['alice', '1ether'] } },
  },
  Lottery: {
    TICKET_PRICE: { summary: 'Prix d’un ticket, en wei : 0,1 ETH.' },
    RANGE: { summary: 'Nombre de chiffres possibles : le chiffre gagnant va de 0 à RANGE - 1.' },
    play: { summary: 'Achète un ticket et tire le chiffre : si guess est le bon, vous gagnez toute la cagnotte.', params: { guess: 'votre chiffre, de 0 à 9' }, sample: { args: ['7'], value: '0.1ether' } },
  },
  LotteryAttacker: {
    attack: { summary: 'Calcule le chiffre que la loterie va tirer, puis le joue. Envoyez le prix d’un ticket avec --value.', sample: { value: '0.1ether' } },
    lottery: { summary: 'Adresse de la loterie visée.' },
    owner: { summary: 'Compte qui a déployé l’attaquant, le seul à pouvoir le lancer.' },
  },
  VaultAttacker: {
    attack: { summary: 'Lance l’exploit : la mise envoyée avec --value est déposée, puis retirée.' },
    owner: { summary: 'Compte qui a déployé l’attaquant, le seul à pouvoir le lancer.' },
    vault: { summary: 'Adresse du coffre visé.' },
  },
}

/** One line under a reverted transaction, keyed by `Contract.Error`: the same error name can mean different things. */
export const errorDocs: Record<string, string> = {
  'Vault.ZeroDeposit': 'deposit() exige des ETH : ajoutez --value, par exemple --value 1ether.',
  'Vault.NothingToWithdraw': 'Le coffre ne vous doit rien : déposez d’abord.',
  'Vault.TransferFailed': 'Le coffre n’a pas pu envoyer les ETH.',
  'SharedWallet.NotOwner': 'Seul le propriétaire du portefeuille peut retirer. Qui est-ce ? cast call wallet "owner()"',
  'SharedWallet.ZeroAddress': 'L’adresse zéro est refusée : indiquez un compte, par exemple mallory.',
  'SharedWallet.TransferFailed': 'Le portefeuille n’a pas pu envoyer les ETH : le montant dépasse-t-il son solde ? cast balance wallet',
  'Lottery.WrongTicketPrice': 'Un ticket coûte exactement 0,1 ETH : ajoutez --value 0.1ether.',
  'Lottery.GuessOutOfRange': 'Le chiffre va de 0 à 9.',
  'Lottery.TransferFailed': 'La loterie n’a pas pu payer le gagnant.',
  'LotteryAttacker.NotOwner': 'Seul le compte qui a déployé l’attaquant peut le lancer.',
  'LotteryAttacker.PayoutFailed': 'L’attaquant n’a pas pu vous reverser les ETH.',
  'VaultAttacker.NotOwner': 'Seul le compte qui a déployé l’attaquant peut le lancer.',
  'VaultAttacker.StakeRequired': 'attack() exige une mise : ajoutez --value, par exemple --value 1ether.',
  'VaultAttacker.PayoutFailed': 'L’attaquant n’a pas pu vous reverser les ETH.',
}

/**
 * Messages of the console, shared by every level. Lines copied from Foundry's own output
 * (`status 1 (success)`, `Deployed to:`…) stay in the console code, in English as Foundry prints them.
 */
export const chainConsole = {
  unknownCommand: (command: string) => `Commande inconnue : ${command}. Tapez help.`,
  castUsage: 'cast : sous-commande manquante ou inconnue. Sous-commandes : interface, balance, block, call, send. Tapez help.',
  blockUsage: 'Ici, seul le dernier bloc est consultable : cast block, ou cast block latest.',
  forgeUsage: 'forge : sous-commande manquante ou inconnue. Ici : forge create <Contrat> --constructor-args <args>',
  nothingToDeploy: 'forge create : aucun contrat à déployer dans ce niveau. Tout est déjà en place.',
  fileNotFound: (files: string) => `cat : fichier introuvable. Fichiers : ${files}`,
  interfaceUsage: (contracts: string) => `Usage : cast interface <contrat>. Contrats : ${contracts}`,
  notAContract: (name: string, contracts: string) => `${name} n’est pas un contrat. Contrats : ${contracts}`,
  castModeUsage: (mode: 'call' | 'send') => `Usage : cast ${mode} <contrat> "<fonction>(<types>)" [arguments]${mode === 'send' ? ' [--value 1ether]' : ''}`,
  notAContractToCall: (name: string, mode: string, contracts: string) => `${name} n’est pas un contrat : cast ${mode} appelle une fonction de contrat. Contrats : ${contracts}`,
  missingFunction: (target: string, functions: string) => `Fonction manquante. Fonctions de ${target} : ${functions}. Détail : cast interface ${target}`,
  unknownFunction: (target: string, fn: string, functions: string) => `${target} n’a pas de fonction ${fn}. Fonctions : ${functions}. Détail : cast interface ${target}`,
  unknownSignature: (signature: string, example: string) => `Signature inconnue : ${signature}. Exemple : ${example}`,
  writes: (fn: string, example: string) => `${fn} modifie la blockchain : cast call ne fait que lire, utilisez cast send. Exemple : ${example}`,
  readOnly: (fn: string, mutability: string, example: string) => `${fn} ne fait que lire (${mutability}) : utilisez cast call. Exemple : ${example}`,
  notPayable: (fn: string, example: string) => `${fn} n’accepte pas d’ETH (fonction non payable) : retirez --value. Exemple : ${example}`,
  argumentCount: (fn: string, expected: number, received: readonly string[], described: string, example: string) =>
    `${fn} attend ${expected} argument${expected > 1 ? 's' : ''}, reçu ${received.length}${received.length ? ` (${received.join(' ')})` : ''}.${described ? ` ${described}.` : ''} Exemple : ${example}`,
  exactSyntax: (command: string) => `Syntaxe exacte de cast : ${command}`,
  insufficient: (account: string, balance: string, value: string) => `Solde insuffisant : ${account} a ${balance} et veut envoyer ${value}.`,
  tinyValue: (raw: string, eth: string) => `--value ${raw} se lit en wei, soit ${eth}. Pour 1 ETH, tapez --value 1ether.`,
  reverted: (error: string) => `Transaction annulée (revert) : ${error}`,
  bareRevert: 'Transaction annulée (revert), sans message d’erreur.',
  unknownProgram: (programs: string) => `forge create : contrat inconnu. Contrats : ${programs}`,
  alreadyDeployed: (program: string, alias: string, deployable: string) => `${program} est déjà déployé, à l’adresse « ${alias} ». Ici, seul ${deployable} est à déployer.`,
  constructorMissing: (program: string, needs: string, command: string) => `${program} attend ${needs} : ${command}`,
  constructorCount: (program: string, expected: number, received: number) => `${program} attend ${expected} argument(s) de constructeur, reçu ${received}.`,
  argumentNotContract: (raw: string, param: string, type: string, command: string) => `${raw} n’est pas un contrat : ${param} attend l’adresse d’un contrat ${type}. Exemple : ${command}`,
  deployRefused: (error: string) => `Déploiement refusé : ${error}`,
  zeroAddress: 'adresse zéro',
  shortcut: (alias: string) => `Raccourci : ${alias}. Ses fonctions : cast interface ${alias}`,
  accountsOr: (names: readonly string[]) => `${names.join(', ')} ou une adresse 0x…`,
  missingAccount: (known: string) => `Compte manquant : ${known}`,
  unknownAccount: (name: string, known: string) => `Compte inconnu : ${name}. Comptes : ${known}`,
  invalidAddress: (raw: string) => `${raw} n’est pas une adresse valide : 0x suivi de 40 caractères hexadécimaux.`,
  programNotAddress: (program: string, alias: string) => `${program} est le nom du programme, pas une adresse : l’exemplaire déployé s’appelle ${alias}.`,
  programNotDeployed: (program: string, command: string) => `${program} est le nom du programme, pas une adresse. Déployez-le d’abord : ${command}`,
  aliasNotDeployed: (alias: string, command: string) => `${alias} n’est pas encore déployé : ${command}`,
  notAnAddress: (raw: string, param: string) => `${raw} n’est pas une adresse : ${param} (address) attend un compte, par exemple alice.`,
  notANumber: (raw: string, param: string, type: string) => `${raw} n’est pas un nombre : ${param} (${type}) attend un montant en wei, ou 1ether.`,
  valueMissing: '--value attend un montant, par exemple 1ether',
  invalidAmount: (raw: string) => `Montant invalide : ${raw}. Exemple : --value 1ether`,
  joinUnit: (amount: string) => `Collez le montant à son unité, sans espace : --value ${amount}`,
  unknownOption: (option: string) => `Option inconnue : ${option}. Options : --value, --constructor-args`,
} as const
