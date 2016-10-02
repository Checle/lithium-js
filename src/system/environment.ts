import {fork, mixin} from '../decorators'
import {EventEmitter} from '../shim/events'
import {Context} from '../state/context'
import Process from './process'
import base from '../base'

@mixin(EventEmitter)
export default class Environment extends Context {
  @fork process: Process

  constructor () {
    // Initialize state context with the default record base
    super(base)
    this.on('error', this.error)
  }

  error () {
    this.end()
  }
}
