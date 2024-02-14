import { produce, Draft } from "immer"
import { patchState, StateSignal } from '@ngrx/signals'

type VoidStateUpdater<State extends object> = (state: State) => void

/**
 * Apply patches to the state which *allow mutations*.
 * 
 * @param stateSignal The NGRX signal store object
 * @param updaters mutating update functions
 * @returns 
 */
export function immutablePatchState<State extends object>(stateSignal: StateSignal<State>, ...updaters: Array<Partial<Draft<State & {}>> | VoidStateUpdater<Draft<State & {}>>>): void {
    const draftUpdaters = updaters.map(fn => produce(fn as any))
    return patchState(stateSignal, ...draftUpdaters as any)
}
