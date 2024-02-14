import { WritableSignal } from '@angular/core'

interface WithToggle {
  /**
   * Toggle the boolean value of the signal
   */
  toggle(): void
}

/**
 * Enhance the signal with a toggle method
 * 
 * @param original The signal to be enhanced
 * @returns 
 */
export function withToggle(original: WritableSignal<boolean>) {
  if (typeof original() !== 'boolean') {
    throw new Error('The original signal must have a boolean value')
  }

  const enhancedSignal = Object.assign(original, {
    toggle() {
      original.update(current => !current)
    }
  }) as WritableSignal<boolean> & WithToggle

  return enhancedSignal 
}
