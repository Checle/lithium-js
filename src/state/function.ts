import RecordState from './record'
import BaseState from './base'
import ObjectState from './object'

export default class FunctionState extends ObjectState {
  value: Function

  private active: boolean = false

  constructor (value: Function, owner: BaseState) {
    super(value, owner)
  }

  exec(...inputs): any {
    if (this.active) {
      return // Execution skipped resulting in success if recursion occured within the call stack
    }
    try {
      this.active = true
      return this.value.apply(this.owner.accessor, inputs)
    } finally {
      this.active = false
    }
  }

  record (...inputs): RecordState {
    if (!inputs.length) return this
    if (this.active) return this.owner

    let result = this.exec(...inputs)
    let target: RecordState = this.owner

    if (result === false) throw new RangeError(`${this.path} returned false`)

    if (result != null) {
      if (result instanceof Array) target = target.record(...result)
      else target = target.record(result)
    }

    // Strip the number of the named input arguments received by the callback
    // and re-execute remaining arguments; will have no effect if zero
    // arguments remain or recursion is caused
    target = target.record(...inputs.slice(this.value.length))

    return target
  }
}
