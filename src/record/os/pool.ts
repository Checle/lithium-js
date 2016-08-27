import fork from 'forks'

@fork export abstract class Pool<T> {
  abstract create (): T

  @fork private free: T[] = []
  private value: T

  acquire (): T {
    if (!this.free.length) return this.create()
    var min
    for (var object of this.free) if (!(object >= min)) min = object
    return min
  }
  release (object: T) {
    this.free.push(object)
  }
  valueOf (): T {
    if (!this.hasOwnProperty('value')) this.value = this.acquire()
    return this.value
  }
}

export class IDs extends Pool<number> {
  private id: number = 0

  create (): number {
    return this.id++
  }
}
