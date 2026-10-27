import { describe, expect, it } from 'vitest'
import { introJourney } from '../../content/intro'
import { Vector3 } from 'three'
import { DIVE_DURATION, diveApproach, divePosition, GLOBE_RADIUS, globePoint, JourneyArc, JOURNEY_SCHEDULE, journeyAt, portfolioWindowAt, TOUR_END, trailAt, TRAIL_DURATION } from './journeyGeometry'

describe('journey geography', () => {
  it('traces the confirmed itinerary and returns to Marseille', () => {
    expect(introJourney.map((stop) => stop.code)).toEqual(['FR', 'LB', 'SA', 'QA', 'CA', 'PE', 'FR'])
    expect(introJourney[0]).toEqual(introJourney.at(-1))
    expect(introJourney.at(-1)?.city).toBe('Marseille')
  })

  it('keeps every flight above the globe, including the transatlantic legs', () => {
    for (let i = 1; i < introJourney.length; i++) {
      const from = introJourney[i - 1]!
      const to = introJourney[i]!
      const arc = new JourneyArc(globePoint(from.lat, from.lon), globePoint(to.lat, to.lon))
      for (let sample = 0; sample <= 100; sample++) {
        expect(arc.getPoint(sample / 100).length()).toBeGreaterThan(GLOBE_RADIUS)
      }
      expect(arc.getPoint(0).normalize().distanceTo(globePoint(from.lat, from.lon).normalize())).toBeLessThan(0.00001)
      expect(arc.getPoint(1).normalize().distanceTo(globePoint(to.lat, to.lon).normalize())).toBeLessThan(0.00001)
    }
  })

  it('takes the short route across the date line', () => {
    const arc = new JourneyArc(globePoint(0, 175), globePoint(0, -175))
    expect(arc.getPoint(0.5).normalize().distanceTo(globePoint(0, 180).normalize())).toBeLessThan(0.00001)
  })

  it('starts the dive at the current camera and approaches Marseille without entering Earth', () => {
    const from = new Vector3(0, 0, 8.45)
    // Exercise Marseille both on the visible hemisphere and beyond its horizon.
    for (const lon of [-80, 5.3698, 90]) {
      const destination = globePoint(43.2965, lon)
      expect(divePosition(from, destination, 0).distanceTo(from)).toBeLessThan(1e-10)
      let previous = from.clone()
      for (let time = 1; time <= DIVE_DURATION; time += 10) {
        const position = divePosition(from, destination, time / DIVE_DURATION)
        expect(position.length()).toBeGreaterThan(GLOBE_RADIUS)
        expect(position.distanceTo(previous)).toBeLessThan(0.2)
        previous = position
      }
      const final = divePosition(from, destination, 1)
      expect(final.clone().normalize().distanceTo(destination.normalize())).toBeLessThan(1e-10)
      expect(final.length()).toBeCloseTo(GLOBE_RADIUS + 0.026)
    }
  })

  it('gives long traversals more time while keeping the tour below 6.5 seconds', () => {
    expect(TOUR_END).toBeLessThan(6500)
    expect(JOURNEY_SCHEDULE[3]!.travel).toBeGreaterThan(JOURNEY_SCHEDULE[0]!.travel * 2)
    for (let i = 0; i < JOURNEY_SCHEDULE.length; i++) {
      const leg = JOURNEY_SCHEDULE[i]!
      expect(journeyAt(leg.arrival).step).toBe(i + 1)
      expect(journeyAt(leg.arrival).travel).toBe(1)
    }
  })

  it('visibly approaches before the fracture and keeps zooming throughout the opening', () => {
    const from = new Vector3(0, 0, 7.4), destination = globePoint(43.2965, 5.3698)
    const distance = (time: number) => divePosition(from, destination, time / DIVE_DURATION).length()
    expect(distance(600)).toBeLessThan(from.length() * 0.87)
    expect(distance(800)).toBeGreaterThan(5.5)
    expect(distance(1600)).toBeLessThan(distance(800))
    expect(distance(2400)).toBeLessThan(distance(1600) * 0.65)
    let previous = from.length()
    for (let time = 10; time <= DIVE_DURATION; time += 10) {
      expect(distance(time)).toBeLessThan(previous)
      previous = distance(time)
    }
    // Velocity stays continuous between approach, fracture and final passage.
    for (const join of [0.25, 0.65]) {
      const left = (diveApproach(join) - diveApproach(join - 1e-5)) / 1e-5
      const right = (diveApproach(join + 1e-5) - diveApproach(join)) / 1e-5
      expect(Math.abs(left - right)).toBeLessThan(0.002)
    }
  })

  it('reveals a centred page window after the fracture starts and grows it with the camera', () => {
    const from = new Vector3(0, 0, 7.4), destination = globePoint(43.2965, 5.3698)
    const at = (time: number) => portfolioWindowAt(time, divePosition(from, destination, time / DIVE_DURATION).length())
    expect(at(0).opacity).toBe(0)
    expect(at(800).opacity).toBe(0)
    expect(at(1600).opacity).toBe(1)
    expect(at(1600).scale).toBeGreaterThan(0.2)
    expect(at(1600).scale).toBeLessThan(0.4)
    expect(at(2400).scale).toBeGreaterThan(at(1600).scale * 1.5)
    const final = at(DIVE_DURATION)
    expect(final.scale).toBeCloseTo(1, 12)
    expect(final.opacity).toBe(1)
    expect(final.edge).toBe(0)
    let previous = at(0).scale
    for (let time = 10; time <= DIVE_DURATION; time += 10) {
      expect(at(time).scale).toBeGreaterThan(previous)
      previous = at(time).scale
    }
  })

  it('removes every trail shortly after arrival instead of retaining old links', () => {
    JOURNEY_SCHEDULE.forEach((leg, index) => {
      const moving = trailAt(leg.start + leg.travel * 0.5, index)
      expect(moving.head).toBeGreaterThan(moving.tail)
      expect(moving.opacity).toBe(1)
      const expired = trailAt(leg.arrival + TRAIL_DURATION + 1, index)
      expect(expired.opacity).toBe(0)
      expect(expired.head).toBe(expired.tail)
    })
  })
})
