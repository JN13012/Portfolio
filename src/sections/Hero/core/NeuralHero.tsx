import { lazy, Suspense, useState, useSyncExternalStore } from 'react'
import { cx } from '../../../lib/cx'
import { NeuralCore } from './NeuralCore'
import { defaultNeuralNodes, type NeuralNavNode } from './navNodes'

// three.js lives in this chunk only.
const Neural3D = lazy(() => import('./Neural3D'))

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

type NeuralHeroProps = { nodes?: NeuralNavNode[]; className?: string }

export function NeuralHero({ nodes = defaultNeuralNodes, className }: NeuralHeroProps) {
  const can3D = useCan3D()
  const [ready, setReady] = useState(false)
  if (!can3D) return <NeuralCore nodes={nodes} className={className} />
  return (
    <div className={cx('relative aspect-square transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0', className)}>
      <Suspense fallback={null}>
        <Neural3D nodes={nodes} onReady={() => setReady(true)} />
      </Suspense>
    </div>
  )
}
