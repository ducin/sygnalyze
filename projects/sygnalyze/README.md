# Sygnalyze 🚦

Angular Signals with Super Powers!

## Installation

`npm i sygnalyze`

## API

### `immutablePatchState`

The NGRX Signal Store `patchState` function enhanced with [`immer` immutability](https://immerjs.github.io/immer/):

```ts
import { signalStore, withMethods, ... } from '@ngrx/signals'
import { immutablePatchState } from 'sygnalyze/ngrx'

export const Store = signalStore(
  //...
  withMethods((store) => ({
    // the function can mutate the state draft object and return nothing
    // `immer` will create a new object by applying all recorded changes
    // state: WritableDraft<StateType>
    updateOrderMutative(order: 'asc' | 'desc'): void {
      immutablePatchState(store, (draft) => { draft.filter.order = order });
    },
    // BEFORE: having to apply immutability manually by spread operator:
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
  })
)
```
