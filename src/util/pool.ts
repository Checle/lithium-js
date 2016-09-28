import {forkable} from './fork'
import {sortedIndexOf} from '../utils'

@forkable export abstract class Pool<T> {
  abstract create (): T

  @forkable private free: T[] = []
  private value: T

  acquire (): T {
    if (!this.free.length) return this.create()
    return this.free.shift()
  }
  release (object: T): boolean {
    this.free.splice(sortedIndexOf(this.free, object), 0, object)
    return true
  }
  valueOf (): T {
    if (!this.hasOwnProperty('value')) this.value = this.acquire()
    return this.value
  }
}

class IDPool extends Pool<number> {
  private id: number = 0

  create (): number {
    return this.id++
  }
}

export class IDMap <T> extends Map<number, T> {
  private ids = new IDPool()

  add (value: T): number {
    var id = this.ids.create()
    this.set(id, value)
    return id
  }

  delete (id: number): boolean {
    return super.delete(id) && this.ids.release(id)
  }
}
