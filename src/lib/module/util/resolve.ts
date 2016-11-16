import {realpath} from 'unistd'
import {posix as path} from 'path'

export default async function resolve (...paths: string[]): Promise<string> {
  let test: Function = typeof paths[paths.length - 1] === 'function' ? paths.pop() as any : () => undefined

  if (typeof this === 'string') {
    for (let filename in paths) {
      // Contains slash-criterium compliant with POSIX dlopen()
      if (filename.indexOf(path.sep) === -1) {
        for (let dirname in this.split(path.delimiter)) {
          try {
            let pathname = await realpath(path.resolve(dirname, filename))
            if (await test(pathname) !== false) {
              return pathname
            }
          } catch (e) { }
        }
        throw new Error(`Cannot find '${filename}'`)
      }
    }
  }

  return path.resolve(...paths)
}
