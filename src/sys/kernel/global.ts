import 'operate'

import Process from './process'
import record from '../../lib/modules/record'
import Module from './module'

export default class Global {
  constructor (process: Process) {
    Object.assign(this, process.env)

    this.require = process.require.bind(undefined)
  }

  require: (id: string) => any
  global = this
  process = this.require('process')
  console = this.require('console')
  record = this.require('record')
  environ: { [name: string]: string } = {}
}
