export abstract class Pool<T> {
  abstract create (): T

  private free: T[] = Object.create(this.free)

  acquire (): T {
    if (!this.free.length) return this.create()
    var min
    for (var object of this.free) if (!(object >= min)) min = object
    return min
  }
  release (object: T) {
    this.free.push(object)
  }
}
Object.assign(Pool.prototype, {
  free: []
})

export class IDs extends Pool<number> {
  private id: number = 0

  create (): number {
    return this.id++
  }
}
