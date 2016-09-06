import * as interfaces from '../../interfaces'

export default class Node <K, V> implements interfaces.Node<K, V> {
  constructor (public key: K, public value: V, public next: Node<K, V> = null) {
  }

  valueOf (): V {
    return this.value
  }

  toString (): string {
    return String(this.value)
  }

  [Symbol.iterator](): Iterator<V> {
    var current: Node<K, V> = this

    return {
      next (): IteratorResult<V> {
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
