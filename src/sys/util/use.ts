export function use <Exports> (target: Exports): Exports {
  let exports = this
  let origin = {} as any

  for (let symbol in exports) if (exports.hasOwnProperty(symbol)) {
    origin[symbol] = exports[symbol]
    exports[symbol] = target[symbol]
  }

  return origin
}
