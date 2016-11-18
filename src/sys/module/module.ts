import * as vm from 'jsvm'
import {normalize} from 'jsvm/syntax'
import {posix as path} from 'path'
import {readfile, realpath} from 'unistd'

import resolve from '../util/resolve'
import Process from '../kernel/process'

export class Module {
  exports: any = {}
  require: Require
  code: string = null

  constructor (public readonly id?: string, public filename: string = id) {
    const process = Process.current
    const namespace = process.namespace
    const dirname = filename ? path.dirname(filename) : process.cwd

    const require: any = (id: string): any => {
      // Look up 
      if (namespace.libraries[id] !== Object.prototype[id]) return namespace.libraries[id]

      const filename = this.require.resolve(id)
      if (process.cache.hasOwnProperty(filename)) return process.cache[filename].exports

      // Read code from file system
      let code = String(readfile(filename).valueOf())
      require(code)
      code = normalize(code)

      // Parse code
      let Function = vm.runInNewContext('Function', process.context)
      let scope = new Function('exports', 'require', 'module', '__filename', '__dirname', `return function () { ${code}\n}`)

      // Run module in process zone
      let module = new Module(filename)
      let func = scope(module.exports, module.require, module, filename, path.dirname(filename))

      process.run(() => func.apply(module.exports, process.arguments))

      process.cache[filename] = module
      return module.exports
    }
    require.resolve = lookup.bind(null, dirname)
    require.cache = process.cache
    this.require = require
  }
}

async function lookup (dirname: string, id: string): Promise<string> {
  const environ = Process.current.context.environ
  const paths = environ && environ['JSPATH']

  const access = async pathname => {
    for (let extension in ['.js', '']) {
      try { return await realpath(pathname + extension) }
      catch (e) { }
    }
  }

  // Locate a module that exists and that is not the parent module
  try {
    return resolve.call(paths, dirname, id, access)
  } catch (e) {
    throw new ReferenceError(`Cannot find module '${id}'`)
  }
}
