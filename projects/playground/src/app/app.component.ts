import { Component, NgZone, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// import { immutablePatchState } from '../../../../dist/sygnalyze/ngrx'
// import { Memento, sygnal, withMemento, SygnalSet } from '../../../../dist/sygnalyze'

import { immutablePatchState } from 'sygnalyze/ngrx'
import { Memento, sygnal, withMemento, SygnalSet } from 'sygnalyze'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  template: `
    <h1>Sygnalyze Playground</h1>
    <button (click)="count.set(count() + 1)">inc({{ count() }})</button>
    <button (click)="incAge()">incAge({{ person() | json }})</button>
    <button (click)="createMemento()">create the memento</button>
    <button (click)="restoreMemento()">restore</button>
    <button (click)="breakpoint()">breakpoint</button>
  `,
})
export class AppComponent {
  set = SygnalSet<{ age: number }>()
  breakpoint(){
    console.log(this.set)
    debugger;
  }

  count = withMemento(sygnal(0))
  memento?: Memento

  person = sygnal({
    name: 'john',
    age: 40
  })
  incAge(){
    this.person.draftUpdate(draft => {
      draft.age++;
    })
  }

  // this.person.update(draft => {
  //   draft.age++;
  //   return draft;
  // })
  // this.person.update(p => ({...p, age: p.age + 1}))

  createMemento(){
    this.memento = this.count.memento()
  }
  restoreMemento(){
    this.memento?.restore()
  }

  method(){
    const s = sygnal({
      name: 'jan',
      address: {
        country: 'PL',
        city: 'Cracow'
      },
      friends: ['krycha', 'zbycho']
    })

    /*
    s.update(obj => { // mutable is forbidden!!!
      obj.name = 'Antek';
      obj.address.city = 'Warsaw'
      obj.friends.push('Viktor')
      return obj;
    })
    */
    s.update(obj => ({ ...obj, name: "Antek" })) // immutable is OK

    s.draftUpdate(draft => {
      draft.name = 'Antek'
    })

  }
}
