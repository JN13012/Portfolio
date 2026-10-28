import { memo } from 'react'
import type { SentryState } from './Sentry'

/** Coordinates use a normalized 1280 × 1280 square over the untouched shell, including its margins. */
export const SentryFace = memo(function SentryFace({ state }: { state: SentryState }) {
  return (
    <svg className="sentry__face" viewBox="0 0 1280 1280" aria-hidden="true" focusable="false">
      {/* A glow on the antenna's existing bulbs, never a second antenna. */}
      <g className="sentry__antenna" fill="currentColor">
        <path className="sentry__antenna-trace" pathLength="100" d="M638 337 C638 269 684 211 734 125" />
        <circle className="sentry__bulb" cx="734" cy="125" r="33" />
        <circle className="sentry__bulb" cx="591" cy="209" r="30" />
        <circle className="sentry__bulb" cx="735" cy="248" r="31" />
      </g>
      <g className="sentry__expression">
        <g className="sentry__gaze">
          <path className="sentry__synapse" d="M480 752 C592 678 666 834 790 752" />
          <g className="sentry__signals">
            <path className="sentry__signal" pathLength="100" d="M480 752 C592 678 666 834 790 752" />
            <path className="sentry__signal sentry__signal--echo" pathLength="100" d="M480 752 C592 832 666 676 790 752" />
          </g>
          <g className="sentry__eyes">
            {[480, 790].map((x) => (
              <g key={x} transform={`translate(${x} 752)`}>
                <g className="sentry__neuron">
                  <g className="sentry__branches">
                    <path d="M-28 -23 -65 -58 -75 -89 M-65 -58 -45 -83 M-4 -35 -8 -79 5 -103 M-8 -79 -27 -95 M27 -24 60 -62 65 -93 M60 -62 83 -68 M35 7 79 15 99 0 M79 15 93 35 M20 30 51 65 43 94 M51 65 76 77 M-12 34 -24 75 -45 91 M-24 75 -13 100 M-34 12 -72 37 -99 28 M-72 37 -79 61" />
                    <path className="sentry__branch-signal" pathLength="100" d="M-4 -35 -8 -79 5 -103 M35 7 79 15 99 0" />
                    <g className="sentry__twigs" fill="currentColor" stroke="none">
                      <circle cx="-75" cy="-89" r="5" /><circle cx="5" cy="-103" r="5" />
                      <circle cx="65" cy="-93" r="5" /><circle cx="99" cy="0" r="5" />
                      <circle cx="43" cy="94" r="5" /><circle cx="-45" cy="91" r="5" />
                      <circle cx="-99" cy="28" r="5" />
                    </g>
                  </g>
                  <circle className="sentry__soma" r="40" />
                  <ellipse className="sentry__core" rx="20" ry="24" />
                </g>
                <path className="sentry__smile" d="M-58 10 Q0 -50 58 10" />
              </g>
            ))}
          </g>
        </g>
      </g>
      {state === 'blocked' && (
        <path className="sentry__shield" d="M635 700 691 723 686 777 Q677 822 635 844 Q593 822 584 777 L579 723 Z M610 767 628 785 660 747" />
      )}
    </svg>
  )
})
