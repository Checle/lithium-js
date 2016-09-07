export { forkable } from './util/fork'
export { mergeable } from './util/merge'

/**
 * Decorator that assigns properties of `value` or its prototype to
 * the prototype of the target.
 */
export function prototype (value) {
  if (typeof value === 'function') value = value.length ? Object.create(value.prototype) : new value()

  return function (target: any, key?): void {
    if (arguments.length > 1) target[key] = value // Property decorator
    else Object.assign(target.prototype, value) // Class decorator
  }
}

/**
 * Alias for `prototype`.
 */
export const mixin = prototype
