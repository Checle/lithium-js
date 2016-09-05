import * as interfaces from '../../interfaces'

export default class Node <T> implements interfaces.Node<T> {
  constructor (public value: T, public next: Node<T> = null) {
  }

  valueOf (): T {
    return this.value
  }

  toString (): string {
    return String(this.value)
  }

  [Symbol.iterator](): Iterator<T> {
    var current: Node<T> = this

    return {
      next (): IteratorResult<T> {
        if (current) {
          let value = current.value
          current = current.next
          return {
            done: false,
            value: current.value
          }
        } else {
          return {
            done: true
          }
        }
      }
    }
  }
}
