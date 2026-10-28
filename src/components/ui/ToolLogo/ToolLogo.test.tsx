import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ToolLogo } from './ToolLogo'

describe('shared tool logos', () => {
  it('recognizes punctuation and case while preserving an image logo', () => {
    const html = renderToStaticMarkup(<ToolLogo name="docker-compose" size={40} />)
    expect(html).toContain('<img')
    expect(html).toContain('width:40px;height:40px')
    expect(html).toContain('alt=""')
  })
  it('uses an official vector logo before a fallback', () => {
    const html = renderToStaticMarkup(<ToolLogo name="Kubernetes" size={40} onlyReal />)
    expect(html).toContain('<svg')
    expect(html).toContain('aria-hidden="true"')
  })
  it('does not substitute drawn emblems when only real logos are requested', () => {
    expect(renderToStaticMarkup(<ToolLogo name="FAISS" size={40} onlyReal />)).toBe('')
  })
  it('keeps the drawn emblem when fallbacks are allowed', () => {
    expect(renderToStaticMarkup(<ToolLogo name="FAISS" size={40} />)).toContain('<svg')
  })
  it('uses a monogram only when allowed and no logo exists', () => {
    expect(renderToStaticMarkup(<ToolLogo name="Unknown Tool" size={40} />)).toContain('UT</span>')
    expect(renderToStaticMarkup(<ToolLogo name="Unknown Tool" size={40} onlyReal />)).toBe('')
  })
})
