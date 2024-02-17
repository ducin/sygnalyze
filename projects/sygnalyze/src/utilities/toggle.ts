import { CreateSignalOptions, WritableSignal } from '@angular/core'
import { WritableSygnal, sygnal } from '../sygnals/sygnal'

interface WithToggle {
  /**
   * Toggle the boolean value of the signal
   */
  toggle(): void
}

export function withToggle<T>(original: WritableSygnal<T>): WritableSygnal<boolean> & WithToggle;
export function withToggle<T>(original: WritableSignal<T>): WritableSignal<boolean> & WithToggle;
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
  })

  return enhancedSignal
}

export const toggle = (initialValue: boolean, options?: CreateSignalOptions<boolean>): WritableSygnal<boolean> =>
  withToggle(sygnal(initialValue, options))
