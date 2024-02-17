import { WritableSignal, CreateSignalOptions, signal, Signal } from "@angular/core"
import { DeepReadonly } from "ts-essentials"
import { Draft, produce } from 'immer'

import { Prettify } from "../internals/type-helpers"

type ReadonlyUpdate<T> = {
  update: (callback: (value: DeepReadonly<T>) => DeepReadonly<T>) => void
}

type DraftUpdate<T> = {
  draftUpdate: (callback: (value: Draft<T>) => void) => void
}

interface SygnalyzeAdditions<T> extends Prettify<
  & Omit<WritableSignal<T>, 'update'>
  & ReadonlyUpdate<T>
  & DraftUpdate<T>
> {}

export interface WritableSygnal<T> extends Signal<T>, SygnalyzeAdditions<T> {}

function draftUpdate<T>(this: WritableSignal<T>, updateFn: (draft: Draft<T>) => void) {
  const currentState = this();
  const newState = produce(currentState, updateFn);
  this.set(newState);
}

export const sygnal = <T>(initialValue: T, options?: CreateSignalOptions<T>): WritableSygnal<T> => {
  const instance = signal(initialValue, options) as any
  Object.assign(instance, { draftUpdate });
  return instance
}
