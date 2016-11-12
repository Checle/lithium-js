import * as vm from 'vm'
import * as fs from './modules/fs'
import * as process from './modules/process'
import * as types from '../types'

export default class Module {
  exports: any = {}

  constructor (public id: string, public filename: string = id) { }
}
