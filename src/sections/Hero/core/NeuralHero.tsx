import { lazy, Suspense, useState, useSyncExternalStore } from 'react'
import { cx } from '../../../lib/cx'
import { NeuralCore } from './NeuralCore'
import { defaultNeuralNodes, type NeuralNavNode } from './navNodes'
import { HERO_NETWORK, type NetworkSettings } from './network'
import type { Run } from '../../../lib/brain'
import { usePresentationPhase } from '../../../lib/usePresentationAudio'

// three.js lives in this chunk only.
const NeuralNet = lazy(() => import('./NeuralNet'))

const QUERIES = ['(prefers-reduced-motion: reduce)', '(min-width: 1024px)']

function subscribe(onChange: () => void) {
  const mqs = QUERIES.map((q) => window.matchMedia(q))
  mqs.forEach((m) => m.addEventListener('change', onChange))
  return () => mqs.forEach((m) => m.removeEventListener('change', onChange))
}

/** 3D only on wide screens, without reduced motion, with WebGL; otherwise the 2D network. */
function useCan3D() {
  return useSyncExternalStore(
    subscribe,
    () =>
      !window.matchMedia(QUERIES[0]!).matches &&
      window.matchMedia(QUERIES[1]!).matches &&
      'WebGLRenderingContext' in window,
    () => false,
  )
}

type NeuralHeroProps = {
  nodes?: NeuralNavNode[]
  /** The network's look and structure (tuned in mockups.html?view=reseau). */
  settings?: NetworkSettings
  /** The assistant's answer being played: the network routes it to the sections it cites. */
  run?: Run | null
  className?: string
}

export function NeuralHero({ nodes = defaultNeuralNodes, settings = HERO_NETWORK, run = null, className }: NeuralHeroProps) {
  const can3D = useCan3D()
  const presentation = usePresentationPhase()
  const [ready, setReady] = useState(false)
  if (!can3D) return <NeuralCore nodes={nodes} className={className} run={run} presentation={presentation} />
  return (
    <div className={cx('transition-opacity duration-700', !className?.includes('absolute') && 'relative', !className?.includes('aspect-') && 'aspect-square', ready ? 'opacity-100' : 'opacity-0', className)}>
      <Suspense fallback={null}>
        <NeuralNet settings={settings} outputs={nodes} run={run} presentation={presentation} onReady={() => setReady(true)} />
      </Suspense>
    </div>
  )
}
