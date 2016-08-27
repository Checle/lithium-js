const FORK = Symbol('fork')

export default function fork (object: any, name?: string): any {
  if (name !== undefined) {
    return assign(object, name, object[name], true)
  }
  if (object instanceof Function) {
    object.prototype[FORK] = true
  } else {
    var branch = {} // Create a new branch
    if (object instanceof Object) object = copy (object, branch)
  }
  return object
}

export const forkable = fork

export function isForkable (object: any): boolean {
  if (typeof object === 'function') return FORK in object.prototype
  return object != null && FORK in object
}

function copy (object: any, branch: Object): any  {
  var target = Object.create(object)
  // Skip properties of indirect ancestors if the direct ancestor has already been processed
  var names = []
  if (object.hasOwnProperty(FORK)) names = Object.keys(object)
  else for (let name in object) names.push(name)

  for (let name of names) {
    let value = object[name]
    if (value == null || !value[FORK]) continue // Copy only complex values
    if (typeof value === 'function') continue // Callables cannot be copied; prototype methods should not be altered
    if (value[FORK] === branch) continue // Object has already been copied in this fork

    assign(target, name, value, branch)
  }
  target[FORK] = branch
  return target
}

function getDescriptor (object: any, name: string): PropertyDescriptor {
  var ancestor = object
  do { var descriptor = Object.getOwnPropertyDescriptor(ancestor, name) }
  while (!descriptor && (ancestor = Object.getPrototypeOf(ancestor)))
  return descriptor
}

function assign (object: any, name: string, value: any, branch: Object): void {
  let descriptor = getDescriptor(object, name)
  if (!descriptor.configurable) return

  Object.defineProperty(object, name, {
    get () {
      // No property definition if value is primitive so FORK symbol cannot be set, makes property decorator persist
      if (!(value instanceof Object)) return value
      value = descriptor.value = copy(value, branch)
      Object.defineProperty(object, name, descriptor)
      return value
    },
    set (newValue) {
      if (!descriptor.writable) return
      if (!(newValue instanceof Object)) return (value = newValue)
      descriptor.value = newValue
      Object.defineProperty(object, name, descriptor)
    },
    configurable: true,
    enumerable: descriptor.enumerable
  })
}
