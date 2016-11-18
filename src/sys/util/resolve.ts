import {posix as path} from 'path'
import {realpath} from 'unistd'

export default async function resolve (...paths: string[]): Promise<string> {
  let access: Function = typeof paths[paths.length - 1] === 'function' ? paths.pop() as any : realpath

  if (typeof this === 'string') {
    for (let filename of paths) {
      let basename = filename.split('/', 1)[0]
      if (basename !== '.' && basename !== '..' && basename !== '') {
        for (let dirname of this.split(path.delimiter)) {
          try {
            return await resolve(dirname, filename, access as any)
          } catch (e) { }
        }
        throw new Error('ENOENT')
      }
    }
  }

  let pathname = path.resolve(...paths.filter(value => value))
  let result = await access(pathname)
  if (typeof result === 'string') return result
  if (result !== false) return pathname
  throw new Error('EACCES')
}
