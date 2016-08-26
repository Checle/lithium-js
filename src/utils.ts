const FORKABLE = Symbol()

function instantiate (object: Forkable): void {
  for (var name of Object.getOwnPropertyNames(Object.getPrototypeOf(object))) {
    let value = fork(object[name])
    if (value != null) object[name] = value
  }
}

export function fork (object: any): any {
  if (typeof object === 'function') return
  if (FORKABLE in this) return object.fork()
  if (object instanceof Object) return Object.create(object)
}

export class Forkable {
  constructor () {
    instantiate(this)
    this[FORKABLE] = true
  }

  fork (): this {
    var fork = Object.create(this)
    instantiate(fork)
    return fork
  }

  static isForkable (object: any) {
    return FORKABLE in object
  }

  static fork = fork
}
