import RegisterLoader from 'es-module-loader/core/register-loader.js'

/*
export async function resolve (pattern: any, path: any): Promise<string> {
  let filenames = typeof pattern === 'string' ? [pattern] : pattern

  for (let filename of filenames) {
    let basename = filename.split('/', 1)[0]

    if (basename !== '.' && basename !== '..' && basename !== '') {
      for (let dirname of path.split(':')) {
        try {
          return await resolve(dirname, filename, access as any)
        } catch (e) { }
      }
      throw new Error('ENOENT')
    }
  }

  let pathname = path.resolve(...paths.filter(value => value))
  let result = await access(pathname)
  if (typeof result === 'string') return result
  if (result !== false) return pathname
  throw new Error('EACCES')
}
*/

class SystemLoader extends RegisterLoader {
  // Normalize is never given a relative name like "./x", that part is already handled
  // so we just need to do plain name detect to throw as in the WhatWG spec
  async [RegisterLoader.resolve] (key, parent) {
    return super[RegisterLoader.resolve](key, parent)
  }

  // Instantiate just needs to run System.register
  // so we load the module name as a URL, and expect that to run System.register
  async [RegisterLoader.instantiate] (key, processAnonRegister) {
    let response = await fetch(key)
    let text = await response.text()
    let fn = new Function(text)

    fn()
    processAnonRegister()
  }
}

export const System = new SystemLoader() as SystemJSLoader.System
