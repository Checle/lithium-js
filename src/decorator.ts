export function prototype (value) {
  if (typeof value === 'function') value = value.length ? Object.create(value.prototype) : new value()

  return function (target, key?): void {
    if (arguments.length > 1) target[key] = value // Property decorator
    else Object.assign(target.prototype, value) // Class decorator
  }
}

export class Cloneable {
  protected instantiate () {
    for (var key in this) {
      let value = this[key]
      if (value != null && typeof value.clone === 'function') {
        this[key] = value.clone()
      }
      else if (value instanceof Object && typeof value !== 'function') {
        this[key] = Object.create(value)
      }
    }
  }

  clone (...args) {
    var clone = Object.create(this)
    clone.constructor(...args)
    return clone
  }
}

