export {forkable, fork} from './util/fork'
export {mergeable, merge} from './util/merge'

/**
 * Decorator that assigns properties of `value` or its prototype to
 * the prototype of the target.
 */
export function prototype (value: any) {
  if (typeof value === 'function') {
    value = Object.create(value.prototype)
  }

  return function (target: any, key?): void {
    if (arguments.length > 1) target[key] = value // Property decorator
    else Object.assign(target.prototype, value) // Class decorator
  }
}

/**
 * Alias for `prototype`.
 */
export const mixin = prototype
