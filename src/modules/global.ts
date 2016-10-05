import * as types from '../types'
import record from '../record'

export class Global {
  global = this
  record: types.Record = record
  module: types.Module
  require: types.Require
  console = global.console
  setImmediate = global.setImmediate
  setInterval = global.setInterval
  setTimeout = global.setTimeout
}

export default new Global()
