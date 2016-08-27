export function prototype (value) {
  if (typeof value === 'function') value = value.length ? Object.create(value.prototype) : new value()

  return function (target: any, key?): void {
    if (arguments.length > 1) target[key] = value // Property decorator
    else Object.assign(target.prototype, value) // Class decorator
  }
}
