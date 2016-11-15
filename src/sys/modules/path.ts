import * as process from './process'

import {posix as path} from 'path'

export * from 'path'

module.exports = path

export function resolve (...paths: string[]): string {
  return path.resolve(process.cwd(), ...paths)
}
