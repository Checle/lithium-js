import * as fs from 'fs'
import * as path from 'path'

export default function resolve (filename: string, cwd: string = process.cwd(), paths: string[] | string = process.env.PATH, mode?: number): string {
  filename = path.normalize(filename)

  let dirname = filename.split(path.delimiter, 1)[0]

  // Check if filename starts with a relative or root link
  if (dirname === '.' || dirname === '..' || dirname === '') {
    // Look up path in the current working directory
    paths = [cwd]
  } else if (typeof paths === 'string') {
    paths = [paths]
  }

  for (let pathname of paths) {
    if (pathname == null) continue

    // Expand a path variable
    let paths = pathname.split(':')

    for (let pathname of paths) {
      pathname = path.resolve(pathname, filename)

      if (mode != null) try { fs.accessSync(pathname, mode) } catch (e) { continue }
      try { pathname = fs.realpathSync(pathname) } catch (e) { continue }

      return pathname
    }
  }

  throw new Error(`Cannot find file '${filename}'`)
}
