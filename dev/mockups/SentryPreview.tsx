import { useState } from 'react'
import { Sentry, type SentryState } from '../../src/components/Sentry/Sentry'
import { SentryChat } from '../../src/components/Sentry/SentryChat'
import { brainNodes } from '../../src/content/assistant'
import { sentryPreviewUi as ui } from '../../src/content/sentryPreview'
import { assistant } from '../../src/lib/assistantStore'
import { emitCore } from '../../src/lib/coreBus'

const states: SentryState[] = ['idle', 'reading', 'searching', 'responding', 'blocked']
const button = 'rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-cyber focus-visible:outline-2 focus-visible:outline-cyber'

export default function SentryPreview() {
  const [activity, setActivity] = useState<SentryState>()
  return (
    <main className="min-h-screen bg-zinc-950 p-6 font-sans text-zinc-200">
      <h1 className="text-xl font-semibold">{ui.title.fr}</h1>
      <p className="mt-2 text-sm text-zinc-400">{ui.note.fr}</p>
      <div className="mt-6 flex flex-wrap gap-5">
        {states.map((state) => (
          <figure key={state} className="text-center">
            <Sentry size={128} state={state} />
            <figcaption className="text-sm">{ui[state].fr}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button className={button} onClick={() => setActivity(undefined)} aria-pressed={!activity}>{ui.automatic.fr}</button>
        {states.map((state) => (
          <button key={state} className={button} onClick={() => setActivity(state)} aria-pressed={activity === state}>{ui[state].fr}</button>
        ))}
        <button className={button} onClick={() => { setActivity(undefined); assistant.ask(brainNodes[0]!.questions[0]!, 'profile') }}>{ui.question.fr}</button>
        <button className={button} onClick={() => emitCore('guardBlockedDemo', { layer: 2 })}>{ui.block.fr}</button>
      </div>
      <SentryChat activity={activity} preparedPreview />
    </main>
  )
}
