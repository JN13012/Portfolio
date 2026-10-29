/** Calm ambient traffic; a prepared answer keeps the original rhythm. */
export const IDLE_FREQUENCY = 0.8
export const IDLE_SPEED = 0.85

/** Time-based easing, shared by the 2D and 3D renderers (dt in seconds). */
export function easePulseSpeed(speed: number, answering: boolean, dt: number) {
  return speed + ((answering ? 1 : IDLE_SPEED) - speed) * (1 - Math.exp(-dt / 0.2))
}
