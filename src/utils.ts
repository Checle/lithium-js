import {Slice} from './types'

const KEY = Symbol('key')

/**
 * Get the longest common prefix of a set of slices.
 */
export function getCommonPrefix <T extends Slice> (...values: T[]): T {
    values = values.concat().sort()
    let min = values[0]
    let max = values[values.length - 1]
    let length = min.length
    let i = 0
    while (i < length && min[i] === max[i]) i++
    return min.slice(0, i) as T
}

/**
 * Convert value to string in record-js fashion:
 * booleans and numbers are interpreted as character codes.
 */
export function toString (value) {
  if (value == null) return ''
  if (typeof value === 'boolean') value = Number(value)
  if (typeof value === 'number') value = String.fromCharCode(value) // TODO: convert numbers > 255 to multiple bytes
  else value = String(value)
  return value
}

/**
 * Create slice derived from the given value.
 */
export function toSlice (object): Slice {
  if (object == null) return ''
  let value = object.valueOf()
  if (typeof value.length === 'number' && typeof value.slice === 'function') {
    // Value implements the slice interface
    return value
  }
  return toString(value)
}

/**
 * Convert value to buffer in record-js fashion:
 * booleans and numbers are interpreted as character codes.
 */
export function toBuffer (value): Buffer {
  if (value == null) return value
  value = value.valueOf()
  if (Buffer.isBuffer(value)) return value
  if (typeof value === 'boolean') value = Number(value)
  if (typeof value === 'number') value = String.fromCharCode(value) // TODO: convert numbers > 255 to multiple bytes
  if (typeof value === 'string') return Buffer.from(value)
  return null
}

/**
 * Via binary search, determine the position in a sorted array where a new
 * value should be inserted via splice.
 */
export function sortedIndexOf (array: any[], value): number {
  let low = 0
  let high = array.length

  while (low < high) {
    let mid = (low + high) >>> 1
    if (value > array[mid]) low = mid + 1
    else high = mid
  }
  return low
}

/**
 * Get the first element if value is a slice or the value of the argument itself.
 */
export function elementOf (slice: Slice, index: number = 0): string {
  // Get first portion of a slice of unkown type
  if (slice == null || index >= slice.length) return null
  return toString(slice[index]) // Converts non-character values to strings
}

/**
 * Get a unique property key for an object.
 */
export function keyOf (value) {
  if (value instanceof Object) return value
  if (KEY in value) return value[KEY]
  return (value[KEY] = Symbol())
}

/**
 * Get the descriptor of an property of the object itself or of the closest
 * prototype if undefined.
 */
export function getDescriptor (object, key: string | number | symbol): PropertyDescriptor {
  let ancestor = object
  let descriptor
  do { descriptor = Object.getOwnPropertyDescriptor(ancestor, key) }
  while (!descriptor && (ancestor = Object.getPrototypeOf(ancestor)))
  return descriptor || { writable: true, configurable: true, enumerable: true }
}

/**
 * Get the closest common prototype in the prototype chain of two objects.
 */
export function getCommonPrototype (target: Object, object: Object): Object {
  if (target === object) return target
  if (object == null) return null
  if (object.isPrototypeOf(target)) return object
  return getCommonPrototype(target, Object.getPrototypeOf(object))
}

export function create (proto: Function, properties?: PropertyDescriptorMap): Function {
  if (typeof proto !== 'function') return Object.create(proto, properties)
  let func = createFunction(proto)
  if (properties) Object.defineProperties(func, properties)
  return func
}

/**
 * Creates a new function with the specified prototype object and callable.
 */
export function createFunction (proto: Function, callable: Function = proto): Function {
  let proxy = function (...args) {
    if (this instanceof proxy) {
      let instance = Object.create(proto.prototype)
      return callable.apply(instance, args)
    }
    return callable.apply(this, args)
  }
  for (let key of Object.getOwnPropertyNames(proxy)) {
    if ((delete proxy[key])) {
      let descriptor = Object.getOwnPropertyDescriptor(proto, key)
      Object.defineProperty(proxy, key, descriptor)
    } else { // Property is not configurable but may be writable
      proxy[key] = proto[key]
    }
  }
  Object.setPrototypeOf(proxy, proto)
  return proxy
}
