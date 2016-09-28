import {bindFunction, getCommonPrototype, getDescriptor} from '../utils'
import fork from './fork'

const MERGE = Symbol('merge')

type Merge = Function[]

export default merge

export function merge <T> (object: T, origin: any): T | any {
  // TODO: fork mergeable function results (assign(branch)) and arguments
  // TODO: only merge functions marked mergeable (align with fork, no private methods etc.)

  if (!(object instanceof Object)) return object
  if (origin === object) return object

  object = fork(object)
  object[MERGE] = []

  if (typeof object === 'function') return object
  if (origin == null) return object
  if (!(origin instanceof Object)) return object

  var ancestor = getCommonPrototype(object, origin)
  apply(object, origin, ancestor)
  return object
}

export function mergeable (target: Object, name: string, descriptor?: PropertyDescriptor): void {
  if (!descriptor) {
    // Property decorator
    let value
    descriptor = {
      enumerable: false,
      configurable: true,
      set (newValue: any): void {
        this[MERGE].push(function () { this[name] = newValue })
        value = newValue
      },
      get (): any {
        return value
      }
    }
  } else if (typeof descriptor.value === 'function') {
    // Method decorator
    let method: Function = descriptor.value
    descriptor.value = bindFunction(method, function (...args) {
      this[MERGE].push(function () { method.apply(this, args) }) // `this` unbound
    })
  }
  Object.defineProperty(target, name, descriptor)
}

export function isMergeable (object: any): boolean {
  if (typeof object === 'function') return MERGE in object.prototype
  return object != null && MERGE in object
}

function apply (target: any, origin: any, ancestor: any) {
  if (origin === ancestor) return
  var prototype = Object.getPrototypeOf(origin)
  apply(target, prototype, ancestor)

  for (let call of origin[MERGE]) call.call(target)

  var keys = Object.keys(origin) // Own properties are those that have been read within the branch
  for (let key of keys) {
    let descriptor = Object.getOwnPropertyDescriptor(origin, key)
    if (descriptor.writable) { // Writable properties are those that have been written within the branch
      // TODO: shall not fork function prototypes
      target[key] = merge(target[key], origin[key])
    }
  }
}
