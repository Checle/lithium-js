export function isWorker () {
  return typeof 'WorkerGlobalScope' in self && self instanceof self['WorkerGlobalScope']
}

/**
 * Via binary search, determine the position in a sorted array where the new
 * value should be inserted via splice.
 */
export function sortedIndexOf (array: any[], value: any): number {
  let low = 0
  let high = array.length

  while (low < high) {
    let mid = (low + high) >>> 1
    if (array[mid] < value) low = mid + 1
    else high = mid
  }
  return low
}
