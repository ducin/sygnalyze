import { WritableSignal } from '@angular/core'

interface WithToggle {
  toggle(): void
}

export function withToggle(origin: WritableSignal<boolean>) {
  if (typeof origin() !== 'boolean') {
    throw new Error('The origin signal must have a boolean value')
  }

  const enhancedSignal = Object.assign(origin, {
    toggle() {
      origin.update(current => !current)
    }
  }) as WritableSignal<boolean> & WithToggle

  return enhancedSignal 
}