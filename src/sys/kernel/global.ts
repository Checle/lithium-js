import 'operate'
import {freeze} from 'jsvm'

import Process from './process'
import record from '../../lib/modules/record'
import Module from './module'

export default class Global {
  constructor (process: Process) {
    Object.assign(this, environ)
    freeze(Global.prototype)

    this.require = process.require.bind(process)
  }

  require: (id: string) => any
  global = this
  process = this.require('process')
  console = this.require('console')
  record = this.require('record')
  environ: Environ = {}
}
