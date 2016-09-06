const FORK = Symbol('fork')
const MERGE = Symbol('merge')
const ANY = {}

export default fork

function getDescriptor (object: any, name: string): PropertyDescriptor {
  var ancestor = object
  do { var descriptor = Object.getOwnPropertyDescriptor(ancestor, name) }
  while (!descriptor && (ancestor = Object.getPrototypeOf(ancestor)))
  return descriptor || { writable: true, configurable: true, enumerable: true }
}

function getCommonPrototype (target: Object, object: Object): Object {
  if (target === object) return target
  if (object == null) return null
  if (object.isPrototypeOf(target)) return object
  return getCommonPrototype(target, Object.getPrototypeOf(object))
}

export function fork <T> (object: T, name?: string): T | any {
  // TODO: when fork is called on a non-callable object and the object has no FORK property, deep fork

  if (name !== undefined) { // Property decorator
    object[name] = fork(object[name])
    if (FORK in object) object[FORK][name] = getDescriptor(object, name)
    return
  }
  if (object instanceof Function) { // Class decorator
    let func = object as any as Function
    assign(func.prototype, func.prototype, ANY)
  }
  // TODO: do not rebranch functions!
  return copy(object, null)
}

export function merge <T> (object: T, origin?: any): T | any {
  // TODO: fork mergeable function results (assign(branch)) and arguments
  // TODO: only merge functions marked mergeable (align with fork, no private methods etc.)

  if (object instanceof Function) { // Class decorator
    let func = object as any as Function
    func.prototype[MERGE] = []
    // TODO: set object.merge?
  }
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

export function isForkable (object: any): boolean {
  if (typeof object === 'function') return FORK in object.prototype
  return object != null && FORK in object
}

export function isMergeable (object: any): boolean {
  if (typeof object === 'function') return MERGE in object.prototype
  return object != null && MERGE in object
}

export const forkable = fork
export const mergeable = merge

function copy (object: any, branch: any): any {
  if (!(object instanceof Object)) return object
  if (branch == null) branch = FORK in object ? Object.create(object[FORK]) : {} // Create a new branch
  if (object[FORK] === branch) return object // Object has already been copied in this fork

  var target = create(object)

  assign(target, object, branch)
  return target
}

function assign (target:any, origin: any, branch: any): any {
  if (origin[FORK] === branch) return origin // Object has already been copied in this fork
  let merge = origin[MERGE]

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
      if (!merge && !value[FORK] || value[FORK] === branch) continue
    }

    Object.defineProperty(target, key, {
      get () {
        if (descriptor.get) return copy(origin[key], branch)
        value = descriptor.value = copy(value, branch)
        Object.defineProperty(this, key, descriptor)
        return value
      },
      set (newValue) {
        if (this[MERGE]) this[MERGE].push(function () { this[key] = newValue })
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

function create (object: any) {
  if (typeof object !== 'function') return Object.create(object)

  var target = function (...args) {
    if (this instanceof target) {
      let constructor = object
      return new constructor(...args) // New instantiations are irrelevant as `this` variable is unrelated
    }
    if (this[MERGE]) this[MERGE].push(function () { object.apply(this, args) })
    return object.apply(this, args)
  }
  Object.defineProperties(target, {
    name: { value: getDescriptor(object, 'name') },
    length: { value: getDescriptor(object, 'length') }
  })
  target.prototype = object.prototype
  return target
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
