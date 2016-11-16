/**
 * Via binary search, determine the position in a sorted array where the new
 * value should be inserted via splice.
 */
export function sortedIndexOf (array: any[], value: any): number {
  let low = 0
  let high = array.length

  while (low < high) {
    let mid = (low + high) >>> 1
    if (array[mid] < value) low = mid + 1
    else high = mid
  }
  return low
}

export abstract class Pool <T> {
  private free: T[] = []

  abstract create (): T

  constructor (source?: Pool<T>) {
    if (source) this.free = source.free.concat()
  }

  acquire (): T {
    if (!this.free.length) return this.create()
    return this.free.shift()
  }
  release (object: T): boolean {
    this.free.splice(sortedIndexOf(this.free, object), 0, object)
    return true
  }
}

export class IDPool extends Pool<number> {
  private id: number = 0

  create (): number {
    return this.id++
  }
}

export class IDMap <T> extends Map<number, T> {
  private ids = new IDPool()

  constructor (source?: IDMap<T>) {
    super(source)
    if (source) this.ids = new IDPool(source.ids)
  }

  add (value: T): number {
    let id = this.ids.create()
    this.set(id, value)
    return id
  }

  delete (id: number): boolean {
    return super.delete(id) && this.ids.release(id)
  }
}
