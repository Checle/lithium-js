import {fork, mixin} from '../decorators'
import {EventEmitter} from '../shim/events'
import {Context} from '../state/context'
import {Duplex} from 'stream'
import Process from './process'
import base from '../base'

@mixin(EventEmitter)
export default class Environment extends Context {
  constructor () {
    // Initialize state context with the default record base
    super(base)
    this.on('error', this.error)
  }

  @fork process: Process

  error () {
    this.end()
  }
}
