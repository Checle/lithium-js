import * as interfaces from '../interfaces'

export default Entry

export class Element <T> implements interfaces.Element<T> {
  constructor (public value: T, public next?: Element<T>, public previous?: Element<T>) { }

  valueOf (): T {
    return this.value
  }

  toString (): string {
    return String(this.value)
  }

  [Symbol.iterator](): Iterator<T> {
    let current: Element<T> = this

    return {
      next (): IteratorResult<T> {
        if (current) {
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

export class Entry <K, V> extends Element<V> implements interfaces.Entry<K, V> {
  constructor (public key: K, value: V, public next?: Entry<K, V>, public previous?: Entry<K, V>) {
    super(value)
  }
}
