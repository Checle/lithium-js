function instantiate (fork: Forks): void {
  for (var name of Object.getOwnPropertyNames(Object.getPrototypeOf(fork))) {
    let value = fork[name]
    if (value instanceof Forks) {
      this[name] = value.fork()
    }
    else if (typeof value !== 'function' && value instanceof Object) {
      fork[name] = Object.create(value)
    }
  }
}

export class Forks {
  constructor () {
    instantiate(this)
  }

  fork (): this {
    var fork = Object.create(this)
    instantiate(fork)
    return fork
  }
}
