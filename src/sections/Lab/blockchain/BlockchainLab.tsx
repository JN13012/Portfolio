import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Lightbulb } from 'lucide-react'
import type { LabCourseGroup } from '../../../content/lab'
import { LabCurriculumDrawer } from '../LabCurriculumDrawer'
import { LabNavigation } from '../LabNavigation'
import artifacts from '../../../content/blockchainCtf.json'
import { blockchainLab as copy, reentrancyLevel as level1 } from '../../../content/blockchainLab'
import { cx } from '../../../lib/cx'
import { keepFieldClearOfPlayer } from '../../../lib/keepClearOfPlayer'
import { ReentrancyLevel, type Line } from './reentrancyLevel'
import { highlightLine } from './solidityHighlight'
import { highlightShell } from './shellHighlight'
import { BlockchainIntro } from './BlockchainIntro'
import '../ia/aiLab.css'
import './blockchainLab.css'

const PROGRESS_KEY = 'blockchain-ctf-progress'
const REPO_URL = `https://github.com/${artifacts.repo}`
const WRITEUP_URL = `${REPO_URL}/blob/main/writeups/01-reentrancy.md`
const SOURCES = Object.values(artifacts.contracts)
const CURRICULUM: LabCourseGroup[] = [{
  title: copy.phase,
  levels: copy.levels.map(level => ({ id: level.id, title: level.title, summary: level.summary, objective: level.summary, available: level.available })),
}]

function readCompleted(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

/** Blockchain CTF: level 1 runs the repository's real contracts on an EVM inside the page. */
export default function BlockchainLab() {
  const [playing, setPlaying] = useState(false)
  const [completed, setCompleted] = useState(readCompleted)
  const markSolved = () => setCompleted(previous => {
    const next = previous.includes(1) ? previous : [...previous, 1]
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)) } catch { /* progress stays in memory */ }
    return next
  })
  return <div className="lab-grid blockchain-lab">
    {playing ? <Session onBack={() => setPlaying(false)} onSolved={markSolved} completed={completed} /> : <>
      <div className="lab-workspace"><BlockchainIntro completed={completed} onEnter={() => setPlaying(true)} /></div>
      <aside className="lab-terminal blockchain-lab__aside">
        <p className="blockchain-lab__kicker">{copy.howItWorks.title}</p>
        <ol className="blockchain-lab__steps">{copy.howItWorks.points.map(point => <li key={point}>{point}</li>)}</ol>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="blockchain-lab__link">{copy.repoLink} <ExternalLink size={14} aria-hidden="true" /></a>
      </aside>
    </>}
  </div>
}

function Chrome({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900 px-3 py-1 font-mono text-[10px] tracking-widest text-white uppercase">
    <span className="text-violet-400">&gt;_</span> chain@lab:~
    {children}
  </div>
}

function Session({ onBack, onSolved, completed }: { onBack: () => void; onSolved: () => void; completed: readonly number[] }) {
  const level = useRef<ReentrancyLevel | null>(null)
  const output = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [lines, setLines] = useState<Line[]>([{ text: copy.booting, tone: 'muted' }])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const [balances, setBalances] = useState<Array<{ name: string; wei: bigint }>>([])
  const [solved, setSolved] = useState(false)
  const [source, setSource] = useState(0)
  const [drawer, setDrawer] = useState(false)

  const apply = async (next: ReentrancyLevel) => {
    level.current = next
    setLines(level1.welcome.map(text => ({ text })))
    setBalances(await next.balances())
    setSolved(false)
    setReady(true)
  }
  useEffect(() => {
    let live = true
    void ReentrancyLevel.start().then(next => { if (live) void apply(next) })
    return () => { live = false }
  }, [])
  useEffect(() => { if (ready) input.current?.focus({ preventScroll: true }) }, [ready])
  useEffect(() => { output.current?.scrollTo({ top: output.current.scrollHeight }) }, [lines])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const command = draft.trim()
    if (!command || !level.current || busy) return
    setDraft('')
    setCursor(-1)
    setHistory(previous => [...previous, command])
    if (command === 'clear') { setLines([]); return }
    if (command === 'reset') { setReady(false); setLines([{ text: copy.booting, tone: 'muted' }]); await apply(await ReentrancyLevel.start()); return }
    setBusy(true)
    const result = await level.current.run(command)
    const done = await level.current.solved()
    setLines(previous => [...previous, { text: command, tone: 'command' }, ...result,
      ...(done && !solved ? [{ text: level1.solved, tone: 'ok' as const }, { text: level1.flag, tone: 'flag' as const }] : [])])
    setBalances(await level.current.balances())
    if (done && !solved) { setSolved(true); onSolved() }
    setBusy(false)
  }
  const browse = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const next = event.key === 'ArrowUp' ? (cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1)) : cursor < 0 ? -1 : cursor + 1
    if (next >= history.length || next < 0) { setCursor(-1); setDraft(''); return }
    setCursor(next)
    setDraft(history[next] ?? '')
  }

  return <>
    <div onFocus={keepFieldClearOfPlayer} className="lab-terminal lab-workspace flex flex-col border border-violet-400/25 bg-black">
      <Chrome>
        <LabNavigation tone="violet" onPresentation={onBack} onCurriculum={() => setDrawer(open => !open)} open={drawer} drawerId="blockchain-lab-curriculum" />
      </Chrome>
      <div className="blockchain-lab__console">
        <div ref={output} className="blockchain-lab__output" role="log" aria-live="polite" aria-label="Sortie de la console">
          {lines.map((line, index) => <ConsoleLine key={index} line={line} />)}
        </div>
        <form onSubmit={event => void submit(event)} className="blockchain-lab__form">
          <label htmlFor="blockchain-lab-input"><Prompt /></label>
          <input ref={input} id="blockchain-lab-input" value={draft} disabled={!ready} onChange={event => setDraft(event.target.value)} onKeyDown={browse}
            autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder={copy.placeholder} aria-label={copy.inputLabel} />
        </form>
      </div>
      {drawer && <LabCurriculumDrawer id="blockchain-lab-curriculum" title={copy.drawerTitle} tone="violet" groups={CURRICULUM} completed={completed}
        current={1} onClose={() => setDrawer(false)} onSelect={() => setDrawer(false)} />}
    </div>
    <Panel balances={balances} solved={solved} source={source} onSource={setSource} />
  </>
}

function Panel({ balances, solved, source, onSource }: {
  balances: Array<{ name: string; wei: bigint }>; solved: boolean; source: number; onSource: (index: number) => void
}) {
  const contract = SOURCES[source]!
  return <aside className="lab-terminal blockchain-lab__panel" aria-label={level1.heading}>
    <h3>{level1.heading}</h3>
    <p>{level1.objective}</p>
    <dl className="blockchain-lab__balances" aria-label={level1.balances}>
      {balances.map(({ name, wei }) => <div key={name}><dt>{name}</dt><dd>{(Number(wei) / 1e18).toLocaleString('fr-FR', { maximumFractionDigits: 4 })} ETH</dd></div>)}
    </dl>
    {solved ? <div className="blockchain-lab__solved" role="status">
      <p>{level1.solved}</p>
      <p><span className="text-zinc-400">{level1.flagLabel} :</span> <code>{level1.flag}</code></p>
      <a href={WRITEUP_URL} target="_blank" rel="noreferrer" className="blockchain-lab__link">{level1.writeup} <ExternalLink size={14} aria-hidden="true" /></a>
    </div> : <Hints />}
    <div role="tablist" aria-label={level1.sources} className="blockchain-lab__tabs">
      {SOURCES.map((item, index) => <button key={item.file} type="button" role="tab" aria-selected={index === source} onClick={() => onSource(index)} className={cx(index === source && 'is-active')}>{item.file}</button>)}
    </div>
    <pre className="blockchain-lab__source" role="tabpanel" aria-label={contract.file} tabIndex={0}>
      {contract.source.trimEnd().split('\n').map((line, index) => <span key={index}><i aria-hidden="true">{index + 1}</i>
        {highlightLine(line).map((token, at) => token.kind ? <b key={at} data-kind={token.kind}>{token.text}</b> : token.text)}{'\n'}</span>)}
    </pre>
  </aside>
}

/** One hint at a time in a box of fixed height: the first is shown, the arrows move to the others. */
function Hints() {
  const [shown, setShown] = useState(0)
  const total = level1.hints.length
  return <section className="blockchain-lab__hints" aria-label={`${level1.hint} ${shown + 1} sur ${total}`}>
    <header>
      <Lightbulb size={14} aria-hidden="true" /> {level1.hint} {shown + 1}/{total}
      <span className="ml-auto flex">
        <button type="button" aria-label={level1.previous} disabled={shown === 0} onClick={() => setShown(n => n - 1)}><ChevronLeft size={16} aria-hidden="true" /></button>
        <button type="button" aria-label={level1.next} disabled={shown === total - 1} onClick={() => setShown(n => n + 1)}><ChevronRight size={16} aria-hidden="true" /></button>
      </span>
    </header>
    <p aria-live="polite">{level1.hints[shown]}</p>
  </section>
}

/** One console line: commands and help in shell colours, `cat` output in Solidity colours. */
function ConsoleLine({ line }: { line: Line }) {
  const { text, tone } = line
  const tokens = tone === 'code' ? highlightLine(text) : tone === 'help' || tone === 'command' ? highlightShell(text) : null
  return <pre data-tone={tone}>
    {tone === 'command' && <Prompt />}
    {tokens ? tokens.map((token, at) => token.kind ? <b key={at} data-kind={token.kind}>{token.text}</b> : token.text) : text}
  </pre>
}

/** The default Ubuntu bash prompt, as VS Code's terminal shows it: user@host in green, path in blue. */
function Prompt() {
  const [user, path] = copy.prompt.split(':')
  return <span className="blockchain-lab__prompt"><b>{user}</b>:<i>{path!.replace('$', '')}</i>$ </span>
}
