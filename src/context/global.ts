export default function Global() {
  let cache = {}

  this.console = console // REMOVE

  this.require = function (path: string): any {
    if (!/^[-\w]+$/.test(path)) throw new Error(`Cannot find module '${path}'`)

    path = require.resolve('../context/' + path)
    if (cache.hasOwnProperty(path)) return cache[path]
    let constructor = require(path).default
    let exports = new constructor()
    cache[path] = exports
    return exports
  }
}
