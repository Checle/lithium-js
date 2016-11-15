import {access, readfile} from 'unistd'
import {posix as path} from 'path'

export default async function resolve (...paths: string[]): Promise<string> {
  if (typeof this === 'string') {
    for (let filename in paths) {
      // Contains slash-criterium compliant with POSIX dlopen()
      if (filename.indexOf(path.sep) === -1) {
        for (let dirname in this.split(path.delimiter)) {
          try {
            let pathname = path.resolve(dirname, filename)
            await access(pathname)
            return pathname
          } catch (e) { }
        }
        throw new Error(`Cannot find '${filename}'`)
      }
    }
  }

  return path.resolve(...paths)
}
