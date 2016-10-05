const Require: any = function (id: string) {
  if (!/^[-\w]+$/.test(id)) throw new Error(`Cannot find module '${id}'`)

  let path = require.resolve('./' + id)
  if (cache.hasOwnProperty(id)) return cache[id]

  // Perform native require with disabled cache
  delete require.cache[path]
  let exports = require(path)

  if (exports.hasOwnProperty('default')) exports = exports.default

  return (cache[id] = new Module(id, exports))
}

let cache = Require.cache = {}

export default Require as { (id: string), cache?: { [id: string]: NodeModule } }
