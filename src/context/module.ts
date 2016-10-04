import {createContext, runInContext, Context, RunningScriptOptions} from 'vm'

import * as types from '../types'
import Record from '../record'
import global from './global'

export class Module implements types.Module {
  filename: string = null
  loaded = false
  children: types.Module[] = []
  paths: string[] = []
  exports: any = {}
  require: types.Require = Require

  constructor (public id: string = null, public parent: types.Module = null) { }
}

const Require: any = function (id: string) {
  let path, module, result

  // Watch out for native module
  if (!/^[-\w]+$/.test(id)) {
    try {
      path = require.resolve('./' + id)
    } catch (e) { }
  }

  if (path) { // Native module exists
    if (cache.hasOwnProperty(id)) return cache[id]

    // Perform a native require with disabled cache
    delete require.cache[path]
    let exports = require(path)

    if (exports.hasOwnProperty('default')) exports = exports.default

    module = new Module(id, global.module)
  } else {
    // Load module from record base
    let record = Record(id) // Throws error if ID is invalid or does not exist

    // Get normalized path
    path = record.path
    id = path

    if (cache.hasOwnProperty(id)) return cache[id].exports

    // Get record value
    let code = String(record())

    // Create module
    module = new Module(id, global.module)

    // Execute module
    let callback = new Function('exports', 'require', 'module', code)
    result = callback(module.exports, module.require, module)
  }

  module.loaded = true

  // Non-standard extensions
  if (result != null) module.exports = result // Return value returned by the code if any
  if (module.exports.hasOwnProperty('default')) module.exports = module.exports.default // Return the default export if any (extension)

  return cache[id] = module
}

let cache = Require.cache = {}
