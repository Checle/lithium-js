import { getDescriptor } from '../utils'

const FORK = Symbol('fork')
const ANY = {}

type Fork = { [name: string]: PropertyDescriptor }

export default fork

export function fork <T> (object: T, name?: string): T {
  // TODO: when fork is called on a non-callable object and the object has no FORK property, deep fork
  // TODO: do not rebranch functions!
  return copy(object)
}

export function forkable (target: Object, name?: string): any {
  // Property decorator
  if (name !== undefined) {
    target[name] = fork(target[name])
    if (FORK in target) target[FORK][name] = getDescriptor(target, name)
  }
  // Class decorator
  if (target instanceof Function) {
    let func = target as Function
    assign(func.prototype, func.prototype, ANY)
    return target
  }
}

export function isForkable (object: any): boolean {
  if (typeof object === 'function') return FORK in object.prototype
  return object != null && FORK in object
}

function copy (object: any, branch: any = null): any {
  if (!(object instanceof Object)) return object
  if (branch == null) branch = FORK in object ? Object.create(object[FORK]) : {} // Create a new branch
  if (object[FORK] === branch) return object // Object has already been copied in this fork

  var target = Object.create(object)
  assign(target, object, branch)
  return target
}

function assign (target:any, origin: any, branch: any): any {
  if (origin[FORK] === branch) return origin // Object has already been copied in this fork

  // Add new properties set on the origin since last fork
  let object = origin
  do {
    for (let key of Object.keys(object)) {
      let descriptor = Object.getOwnPropertyDescriptor(object, key)
      if (!descriptor.configurable) {
        branch[key] = null // Set property unforkable
        continue
      }
      let value = object[key]
      if (value != null && value[FORK]) {
        branch[key] = descriptor // Set property forkable
        continue
      }
    }
    object = Object.getPrototypeOf(object)
  } while (object && !object.hasOwnProperty(FORK))

  // TODO: no deep copy of merge functions
  // Iterate over all properties
  for (let key in branch) {
    let descriptor = branch[key]
    if (descriptor == null) continue
    let value = origin[key] // Invoke getter if applicable
    let writable = descriptor.writable || descriptor.set

    if (value instanceof Object) {
      // Object shall not be forked or has already been copied in this fork
      if (!value[FORK] || value[FORK] === branch) continue
    }

    Object.defineProperty(target, key, {
      get () {
        if (descriptor.get) return copy(origin[key], branch)
        value = descriptor.value = copy(value, branch)
        Object.defineProperty(this, key, descriptor)
        return value
      },
      set (newValue) {
        if (!writable) return
        Object.defineProperty(this, key, descriptor)
        this[key] = newValue
      },
      configurable: true,
      enumerable: descriptor.enumerable
    })
  }

  target[FORK] = branch
  return target
}
