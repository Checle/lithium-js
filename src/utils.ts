export type Section = Array<any> | Buffer | string

/**
 * Get the longest common prefix of a set of Sections.
 */
export function getCommonPrefix <T extends Section> (...values: T[]): T {
    values = values.concat().sort()
    var min = values[0], max = values[values.length - 1]
    var length = min.length
    var i = 0
    while (i < length && min[i] === max[i]) i++
    return min.slice(0, i) as T
}

/**
 * Convert value to string in record-js fashion:
 * booleans and numbers are interpreted as character codes.
 */
export function toString (value: any) {
  if (value == null) return ''
  if (typeof value === 'boolean') value = Number(value)
  if (typeof value === 'number') value = String.fromCharCode(value)
  else value = String(value)
  return value
}

/**
 * Create Section derived from the given value.
 */
export function toSection (object: any): Section {
  if (object == null) return ''
  var value = object.valueOf()
  if (typeof value.length === 'number' && typeof value.slice === 'function') {
    // Value implements the Section interface
    return value
  }
  return toString(value)
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
 * Get the first element if value is a Section or the value of the argument itself.
 */
export function elementOf (Section: Section, index: number = 0): string {
  // Get first portion of a Section of unkown type
  if (Section == null || index >= Section.length) return null
  return toString(Section[index]) // Converts non-character values to strings
}
