type Sequence = Array<any> | Buffer | string

export function getCommonPrefix <T extends Sequence> (...values: T[]): T {
    values = values.concat().sort()
    var min = values[0], max = values[values.length - 1]
    var length = min.length
    var i = 0
    while (i < length && min[i] === max[i]) i++
    return min.slice(0, i) as T
}
