# Sygnalyze 🚦

Idiomatic Angular Signals with Super Powers!

## Installation

`npm i sygnalyze`

## API

### `withToggle(writableSignal)`

```ts
import { withToggle } from 'sygnalyze'

export class TheComponent {
  showTheThing = withToggle(signal(true))
  ...

  theMethod(){
    this.showTheThing.toggle() // updates 
  }
}
```

### `immutablePatchState`

The NGRX Signal Store `patchState` function enhanced with [`immer` immutability](https://immerjs.github.io/immer/):

```ts
import { immutablePatchState } from 'sygnalyze/ngrx'

export const Store = signalStore(
  withMethods((store) => ({
    updateOrder(order: 'asc' | 'desc'): void {
      immutablePatchState(store, (draft) => { draft.filter.order = order });
    },
  })
)
```

The `immutablePatchState` function callback can now **mutate** the state draft object and return nothing. `immer` will create a new object by applying all recorded changes. You don't have to worry about applying immutable changes manually.

Compare with default approach:

```ts
import { signalStore, withMethods, ... } from '@ngrx/signals'
import { immutablePatchState } from 'sygnalyze/ngrx'

export const Store = signalStore(
  //...
  withMethods((store) => ({
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
