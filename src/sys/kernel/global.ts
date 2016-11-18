import Process from './process'
import record from 'record'

export interface Global {
  environ: Environ
  arguments: string[]
  console: Console
  require: Require
}

export default function Global (process: Process): void {
  this.arguments = process.arguments && process.arguments.slice()
  this.require = process.require.bind(process)
  this.console = this.require('console')
  this.environ = {}
  this.global = this
}
