import RecordState from './record'
import TreeState from './tree'

export default class FunctionState extends TreeState {
  constructor (private callable: Function, scope: Object = undefined, ...args: any[]) {
    super()
    if (scope !== undefined || args.length) this.callable = callable.bind(scope, ...args)
  }

  record (...inputs: any[]): RecordState {
    // TODO: handle any output type
    let result = this.callable(inputs)
    if (result === false) throw new RangeError(`${this.callable.name || 'Acceptor'} returned false`) // TODO: replace name by tree path
    let target = this.resolve(result)
    // No exception: record verified
    return target
  }
}
