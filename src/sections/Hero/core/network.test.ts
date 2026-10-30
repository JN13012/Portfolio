import { describe, expect, it } from 'vitest'
import { buildGraph, HERO_NETWORK, NETWORK_DEFAULTS } from './network'

describe('network defense captions', () => {
  it('distinguishes the filters on either side of the Hero model', () => {
    const graph = buildGraph(HERO_NETWORK, 5)
    const input = graph.captions.find(caption => caption.text === 'Filtre d’entrée')!
    const output = graph.captions.find(caption => caption.text === 'Filtre de sortie')!
    const model = graph.captions.find(caption => caption.text === 'Modèle')!
    expect(input.x).toBeLessThan(model.x)
    expect(output.x).toBeGreaterThan(model.x)
    expect(graph.captions.filter(caption => caption.accent)).toHaveLength(2)
    expect(graph.walls.map(wall => wall.x)).toEqual([input.x, output.x])
  })

  it('identifies the single defense as the output filter in the alternate layout', () => {
    const graph = buildGraph(NETWORK_DEFAULTS, 5)
    expect(graph.captions.filter(caption => caption.accent).map(caption => caption.text)).toEqual(['Filtre de sortie'])
  })
})
