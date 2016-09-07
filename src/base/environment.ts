import { forkable, mixin } from '../decorators'
import { ForkableEventEmitter } from '../events'
import StateContext from '../states'
import { Duplex } from 'stream'
import Process from './process'

@mixin(ForkableEventEmitter)
export default class Environment extends Duplex {
  @forkable process: Process
  @forkable states: StateContext
}
