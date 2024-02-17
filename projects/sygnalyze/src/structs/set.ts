import { Signal, computed } from "@angular/core";
import { WritableSygnal, sygnal } from "../sygnals/sygnal";
import { enableMapSet } from "immer";

enableMapSet()

export const SygnalSet = <T>() => {
  const set = sygnal(new Set<WritableSygnal<T>>())

  const internals = {
    allValues: computed(() => Array.from(set()).map(item => item()))
  }

  return Object.assign(set, internals, {
    add(value: T){
      set.draftUpdate(draft => {
        const item = sygnal(value)
        draft.add(item)
      })
      return set
    },
    delete(value: T): boolean {
      let deleted = false
      set.draftUpdate(draft => {
        set().forEach(item => {
          if(item() === value){
            draft.delete(item)
            deleted = true
          }
        })
      })
      return deleted
    },
    // clear // unmodified
    has(value: T): Signal<boolean> {
      return computed(() => internals.allValues().includes(value))
    },
    size: computed(() => set().size)
  });
}
