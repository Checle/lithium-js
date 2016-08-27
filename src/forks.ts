const FORK = Symbol('fork')
const MERGE = Symbol('merge')
const ANY = Symbol()

export default fork

function getDescriptor (object: any, name: string): PropertyDescriptor {
  var ancestor = object
  do { var descriptor = Object.getOwnPropertyDescriptor(ancestor, name) }
  while (!descriptor && (ancestor = Object.getPrototypeOf(ancestor)))
  return descriptor
}

function getCommonPrototype (target: Object, object: Object): Object {
  if (target === object) return target
  if (object.isPrototypeOf(target)) return object
  return getCommonPrototype(target, Object.getPrototypeOf(object))
}

export function fork (object: any, name?: string): any {
  if (name !== undefined) { // Property decorator
    var descriptor = getDescriptor(object, name)
    object[name] = fork(object[name])
    return
  }
  if (object instanceof Function) { // Class decorator
    assign(object.prototype, object.prototype, ANY)
  }
  var branch = Symbol('object') // Create a new branch
  // TODO: do not rebranch functions!
  return copy (object, branch)
}

export function merge (object: any, origin?: any) {
  if (object instanceof Function) { // Class decorator
    object.prototype[MERGE] = []
    // TODO: set object.merge?
  }
  if (!(object instanceof Object)) return object
  if (origin === object) return object

  object = fork(object)
  object[MERGE] = []

  if (typeof object == 'function') return object
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

function copy (object: any, branch: symbol): any  {
  if (!(object instanceof Object)) return object
  if (object[FORK] === branch) return object // Object has already been copied in this fork

  var target = create(object)

  assign(target, object, branch)
  return target
}

function assign (target:any, origin: any, branch: symbol): any  {
  if (origin[FORK] === branch) return origin // Object has already been copied in this fork

  for (let object = origin; object; object = Object.getPrototypeOf(object)) {
    let merge = object[MERGE]
    let names = Object.keys(object)

    // TODO: no deep copy of merge functions
    for (let name of names) {
      let descriptor = getDescriptor(object, name)
      let value = object[name]
      let writable = descriptor.writable || descriptor.set

      if (!descriptor.configurable) continue
      if (!merge && !value[FORK]) continue // Object shall not be forked
      if (value[FORK] === branch) continue // Object has already been copied in this fork

      Object.defineProperty(target, name, {
        get () {
          if (descriptor.get) return copy(object[name], branch)
          value = descriptor.value = copy(value, branch)
          Object.defineProperty(this, name, descriptor)
          return value
        },
        set (newValue) {
          if (this[MERGE]) this[MERGE].push(function () { this[name] = newValue })
          if (!writable) return
          Object.defineProperty(this, name, descriptor)
          this[name] = newValue
        },
        configurable: true,
        enumerable: descriptor.enumerable
      })
    }

    if (object.hasOwnProperty(FORK)) break
  }
  target[FORK] = branch
  target[branch] = origin
  return target
}

function create (object: any) {
  if (typeof object !== 'function') return Object.create(object)

  var target = function () {
    var args = arguments
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
