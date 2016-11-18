import {posix as path} from 'path'
import {getcwd} from 'unistd'

export * from 'path'

module.exports = exports = Object.create(path)

export function resolve (...paths: string[]): string {
  return path.resolve(process.cwd(), ...paths)
}
