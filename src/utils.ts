export type Sequence = Array<any> | Buffer | string

/**
 * Get the longest common prefix of a set of sequences.
 */
export function getCommonPrefix <T extends Sequence> (...values: T[]): T {
    values = values.concat().sort()
    var min = values[0], max = values[values.length - 1]
    var length = min.length
    var i = 0
    while (i < length && min[i] === max[i]) i++
    return min.slice(0, i) as T
}

/**
 * Create sequence derived from the given value.
 */
export function toSequence (object: any): Sequence {
  if (object == null) return ''
  var value = object.valueOf()

  if (typeof value.length === 'number' && typeof value.slice === 'function') {
    return value
  }
  if (typeof value === 'boolean') value = Number(value)
  if (typeof value === 'number') value = String.fromCharCode(value)
  else value = String(value)
  return value
}

/**
 * Convert value to buffer in record-js fashion:
 * booleans and numbers are interpreted as character codes.
 */
export function toBuffer (value: any): Buffer {
  if (value == null) return value
  value = value.valueOf()
  if (Buffer.isBuffer(value)) return value
  if (typeof value === 'boolean') value = Number(value)
  if (typeof value === 'number') value = String.fromCharCode(value)
  if (typeof value === 'string') return Buffer.from(value)
  return null
}

/**
 * Via binary search, determine the position in a sorted array where the new
 * value should be inserted via splice.
 */
export function sortedIndexOf (array: any[], value: any): number {
    var low = 0
    var high = array.length

    while (low < high) {
        var mid = (low + high) >>> 1
        if (array[mid] < value) low = mid + 1
        else high = mid
    }
    return low
}

/**
 * Get the first element if value is a sequence or the value of the argument itself.
 */
export function firstElementOf (value: any) {
  // Get first portion of a sequence of unkown type
  if (value != null) {
    value = value.valueOf()
    if (0 in value) {
      return value[0]
    }
  }
  return value
}
