import { CreateSignalOptions, WritableSignal } from '@angular/core'
import { WritableSygnal, sygnal } from '../sygnals/sygnal'

export interface Memento {
  /**
   * Restore the signal to the state it was in when the memento was created.
   */
  restore(): void
}

interface WithMemento {
  /**
   * Create a memento object.
   */
  memento(): Memento
}

export function withMemento<T>(original: WritableSygnal<T>): WritableSygnal<T> & WithMemento;
export function withMemento<T>(original: WritableSignal<T>): WritableSignal<T> & WithMemento;
/**
 * Enhance the signal with a memento method.
 *
 * A memento allows you to restore the signal to the state it was in when the memento was created.
 *
 * @param original The signal to be enhanced
 * @returns
 */
export function withMemento<T>(original: WritableSignal<T>) {
  const enhancedSignal = Object.assign(original, {
    memento() {
      const stateSnapshot = original()
      const restore = () => {
        original.set(stateSnapshot)
      }
      return { restore }
    }
  })

  return enhancedSignal
}

export const memento = <T>(initialValue: T, options?: CreateSignalOptions<T>): WritableSygnal<T> & WithMemento =>
  withMemento(sygnal(initialValue, options))
