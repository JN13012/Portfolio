import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertTriangle, Briefcase, Check, CheckCircle2, Copy, Download, Github, Linkedin, Mail, MapPin, Send } from 'lucide-react'
import { siCoursera, siTryhackme, type SimpleIcon } from 'simple-icons'
import SectionHeader from '../../components/SectionHeader'
import { contact, contactLimits } from '../../content/contact'
import { profile } from '../../content/profile'
import { cx } from '../../lib/cx'

// Same panel as Profil (fine border, translucent dark background); light labels, rounded fields and buttons.
const panel = 'rounded-sm border border-white/10 bg-zinc-950/60 backdrop-blur-sm shadow-[0_14px_36px_rgba(0,0,0,0.26)]'
const field =
  'w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-[15px] text-zinc-100 transition-colors placeholder:text-zinc-500 hover:border-white/25 focus:border-cyber/60 focus-visible:outline-none'
const label = 'mb-2 block text-sm text-zinc-300'
const button = 'inline-flex items-center rounded-md border border-white/15 bg-white/5 text-sm text-zinc-100 transition-colors hover:border-cyber/50'

const seeking = profile.facts.find((f) => f.label.fr === 'Recherche')?.value.fr

const empty = { name: '', email: '', subject: '', message: '', company: '' }
type Status = 'idle' | 'sending' | 'success' | 'error'

/** Simple Icons mark (CC0), in the current text colour. */
const Mark = ({ icon }: { icon: SimpleIcon }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]">
    <path d={icon.path} fill="currentColor" />
  </svg>
)

const SOCIALS = [
  {
    label: 'GitHub',
    url: profile.links.github,
    icon: <Github size={18} aria-hidden="true" />,
  },
  {
    label: 'LinkedIn',
    url: profile.links.linkedin,
    icon: <Linkedin size={18} aria-hidden="true" />,
  },
  {
    label: 'TryHackMe',
    url: profile.links.tryhackme,
    icon: <Mark icon={siTryhackme} />,
  },
  {
    label: 'Coursera',
    url: profile.links.coursera,
    icon: <Mark icon={siCoursera} />,
  },
]

/**
 * Contact: invitation, availability, what is sought and where, email (with copy) and CV, profiles on the
 * left; the form on the right, replaced by a confirmation once sent, with a prefilled email link when sending fails.
 */
export function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`[Portfolio] ${form.subject}`)}&body=${encodeURIComponent(form.message)}`

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (response.headers.get('Content-Type') ?? '').includes('application/json') ? await response.json() : {}
      // The Worker explains refusals it can name (invalid field, too many messages); anything else stays generic.
      if (!response.ok) throw new Error(response.status === 400 || response.status === 429 ? data?.message : '')
      setForm(empty)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : '')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 text-white">
      <div>
        <SectionHeader index="07" title="Contact" />

        <div className={cx(panel, 'grid grid-cols-1 gap-10 p-6 md:grid-cols-[1fr_1.25fr] md:p-10')}>
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-8 md:border-r md:border-b-0 md:pr-10 md:pb-0">
            <div>
              <div className="mb-5 h-px w-16 bg-cyber" />
              <h3 className="text-[28px] leading-tight font-semibold text-zinc-50 md:text-[34px]">{contact.title.fr}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-300">{contact.intro.fr}</p>
            </div>

            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-xs tracking-widest text-cyber uppercase">
                {/* « Available » light: pulses softly, still under reduced motion. */}
                <span aria-hidden="true" className="relative flex size-1.5">
                  <span className="absolute inset-0 rounded-full bg-cyber motion-safe:animate-ping" />
                  <span className="relative size-1.5 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)]" />
                </span>
                {contact.available.fr}
              </span>
              <ul className="space-y-2.5 text-[15px] text-zinc-200">
                {seeking && (
                  <li className="flex items-start gap-3">
                    <Briefcase size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-cyber" /> {seeking}
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <MapPin size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-cyber" /> {contact.location.fr}
                </li>
              </ul>

              {/* Email (with copy) and CV side by side. */}
              <div className="flex flex-wrap gap-3">
                <div className={cx(button, 'grow')}>
                  <a href={`mailto:${profile.email}`} className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 py-3 transition-colors hover:text-cyber">
                    <Mail size={18} aria-hidden="true" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={copied ? contact.copied.fr : contact.copy.fr}
                    title={copied ? contact.copied.fr : contact.copy.fr}
                    className="flex cursor-pointer items-center self-stretch border-l border-white/10 px-3.5 text-zinc-400 transition-colors hover:text-cyber"
                  >
                    {copied ? <Check size={17} aria-hidden="true" className="text-cyber" /> : <Copy size={17} aria-hidden="true" />}
                  </button>
                </div>
                <a href={profile.cv.url} download={profile.cv.fileName} className={cx(button, 'grow justify-center gap-2.5 px-3.5 py-3 whitespace-nowrap hover:text-cyber')}>
                  <Download size={18} aria-hidden="true" /> {contact.cv.fr}
                </a>
              </div>

              <ul className="flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="grid size-11 place-items-center rounded-md border border-white/10 bg-zinc-950/60 text-zinc-300 transition-colors hover:border-cyber/50 hover:text-cyber"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {status === 'success' ? (
            <div role="status" className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <CheckCircle2 size={44} aria-hidden="true" className="text-cyber" />
              <p className="text-2xl font-semibold text-zinc-50">{contact.successTitle.fr}</p>
              <p className="text-[15px] text-zinc-300">{contact.successBody.fr}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 cursor-pointer rounded-full border border-white/15 px-5 py-2 text-sm text-zinc-300 transition-colors hover:border-white/35 hover:text-white"
              >
                {contact.another.fr}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Honeypot: hidden from people, filled by bots; the Worker drops those messages. */}
              <input type="text" name="company" value={form.company} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={label}>{contact.name.fr}</span>
                  <input
                    required
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={contactLimits.name}
                    value={form.name}
                    onChange={onChange}
                    placeholder={contact.namePlaceholder.fr}
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className={label}>{contact.email.fr}</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={contactLimits.email}
                    value={form.email}
                    onChange={onChange}
                    placeholder={contact.emailPlaceholder.fr}
                    className={field}
                  />
                </label>
              </div>

              <label className="block">
                <span className={label}>{contact.subject.fr}</span>
                <input required type="text" name="subject" maxLength={contactLimits.subject} value={form.subject} onChange={onChange} placeholder={contact.subjectPlaceholder.fr} className={field} />
              </label>

              <label className="block">
                <span className={cx(label, 'flex items-baseline justify-between')}>
                  {contact.message.fr}
                  <span className="text-xs text-zinc-500 tabular-nums">
                    {form.message.length} / {contactLimits.message}
                  </span>
                </span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  minLength={contactLimits.messageMin}
                  maxLength={contactLimits.message}
                  value={form.message}
                  onChange={onChange}
                  placeholder={contact.messagePlaceholder.fr}
                  className={cx(field, 'resize-none leading-relaxed')}
                />
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-md border border-cyber/50 bg-cyber/10 px-6 py-3 text-sm tracking-[0.2em] text-cyber uppercase transition-colors hover:bg-cyber/20 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <Send size={17} aria-hidden="true" />
                  {status === 'sending' ? contact.sending.fr : contact.send.fr}
                </button>

                <div aria-live="polite" className="text-sm">
                  {status === 'error' && (
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-red-300">
                      <AlertTriangle size={17} aria-hidden="true" />
                      {error || contact.error.fr}
                      <a href={mailto} className="text-zinc-200 underline underline-offset-2 hover:text-cyber">
                        {contact.fallback.fr}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
