import { FolderOpen, Wrench } from 'lucide-react'
import { helpdesk, type ToolCall } from '../../../content/lab/ai'

/** Level 6's mission and context, at the top of the conversation. */
export function AgentBrief() {
  return <div className="ai-agent__brief">
    <p className="ai-cv__mission"><span>Mission</span> {helpdesk.mission}</p>
    <ul>{helpdesk.context.map(line => <li key={line}>{line}</li>)}</ul>
  </div>
}

const call = ({ name, arguments: args }: ToolCall) => `${name}(${Object.entries(args).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(', ')})`

/** The calls the server really ran for Sentry, between the prompt and the answer. Text only, never HTML. */
export function AgentCalls({ tools }: { tools: readonly ToolCall[] }) {
  if (!tools.length) return <p className="ai-agent__none">{helpdesk.noTool}</p>
  return <ol className="ai-agent__calls" aria-label={helpdesk.toolsLabel}>
    {tools.map((tool, index) => <li key={index}>
      <code><Wrench size={11} aria-hidden="true" /><span className="sr-only">{helpdesk.toolMark} : </span>{call(tool)}</code>
      <pre>{JSON.stringify(tool.result, null, 1)}</pre>
    </li>)}
  </ol>
}

/** What the granted access opens: the share and the file holding the flag. */
export function AgentShare({ flag }: { flag: string }) {
  return <div className="ai-agent__share" role="status">
    <p><FolderOpen size={13} aria-hidden="true" /> {helpdesk.shareTitle} : <code>{helpdesk.share}</code></p>
    <p>{helpdesk.file} · {helpdesk.flagLabel} : <code>{flag}</code></p>
  </div>
}
