import {posix as path} from 'path'
import Process from '../kernel/process'

export function dlopen (file: string, mode: number = 0): any {
  const require = Process.current.require
  if (file.indexOf('/') !== -1) file = path.join('.', file)
  file = require.resolve(file)
  require(file)
  return require.cache[file]
}

export function dlsym (handle: any, name: string): any {
  return handle.exports[name]
}

export function dlclose (handle): void {
  delete require.cache[handle.id]
}
