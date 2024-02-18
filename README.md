# ![Sygnalyze](./assets/logo/sygnalyze-logo-200.png)

Enhance 🚦 Angular Signals 🚦 with Super Powers!

- [](#)
  - [Installation](#installation)
  - [Online Demo](#online-demo)
  - [Why?](#why)
  - [API](#api)
    - [`sygnal`](#sygnal)
      - [readonly `update`](#readonly-update)
      - [`draftUpdate(mutatingCallback)`](#draftupdatemutatingcallback)
    - [`memento` / `withMemento(writableSignal)`](#memento--withmementowritablesignal)
    - [`toggle` / `withToggle(writableSignal)`](#toggle--withtogglewritablesignal)
    - [`immutablePatchState`](#immutablepatchstate)

## Installation

`npm i sygnalyze`

## Online Demo

👉 [stackblitz.com/edit/sygnalyze](https://stackblitz.com/edit/sygnalyze)

## Why?

- `sygnal` is a tiny wrapper which improve Angular `signal` DX
- that means that 100% runtime of Angular signals is preserved and are meant to be always compatible
- i.e. `computed`, `effects`, `toSignal`/`toObservable` will work with `sygnal` the same way as with `signal`

## API

### `sygnal`

Enhanced Angular Signal - with 2 differences:

#### readonly `update`

The `update` method parameter (current value) is `DeepReadonly` in order to avoid unintentional mutations

```ts
import { sygnal } from 'sygnalyze'; 

const item = sygnal({
  name: 'john',
  age: 40
})

item.update(current => ...)
//          ^? current is DeepReadonly
```

#### `draftUpdate(mutatingCallback)`

An additional method `draftUpdate(mutatingCallback)` allows to mutate the current value of the signal, but thanks to using `immer`, the value is replaced with an immutable 

```ts
import { sygnal } from 'sygnalyze'; 

const item = sygnal({
  name: 'john',
  age: 40
})

item.draftUpdate(draft => {
  draft.age++;
})
```

In above code, a new object is set as the value, so the signal notifies all its dependents.

### `memento` / `withMemento(writableSignal)`

Make a snapshot (*memento*) of the signal's value at a certain point in time. Whenever memento gets restored, the signal goes back to that value.

```ts
import { signal } from '@angular/core';
import { memento, withMemento, Memento } from 'sygnalyze'

export class TheComponent {
  item = memento({ age: 40 }) // WritableSygnal
  // or:
  item = withMemento(signal({ age: 40 })) // original Signal
  
  ...

  memento?: Memento

  createMemento(){
    this.memento = this.item.memento()
  }

  restoreMemento(){
    this.memento?.restore()
  }
}
```

### `toggle` / `withToggle(writableSignal)`

Creates a boolean signal with simple `toggle()` updating method.

```ts
import { signal } from '@angular/core';
import { toggle, withToggle } from 'sygnalyze'

export class TheComponent {
  showTheThing = toggle(true) // Sygnal
  // or:
  showTheThing = withToggle(signal(true)) // original Signal

  ...

  theMethod(){
    this.showTheThing.toggle()
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
