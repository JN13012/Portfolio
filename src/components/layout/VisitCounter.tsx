import { useEffect, useState } from 'react'
import { visitsCopy } from '../../content/visits'
import { loadVisitTotal } from '../../lib/visits'

export function VisitCounter() {
  const [total, setTotal] = useState<number | null>(null)
  useEffect(() => {
    let mounted = true
    void loadVisitTotal().then(value => { if (mounted) setTotal(value) })
    return () => { mounted = false }
  }, [])
  return (
    <span className="text-xs text-zinc-400 tabular-nums">
      {visitsCopy.label.fr} · {total === null ? '—' : new Intl.NumberFormat('fr-FR').format(total)}
    </span>
  )
}
