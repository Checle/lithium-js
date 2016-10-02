import {toBuffer} from '../utils'
import PatriciaTrie from '../util/tree/patricia'
import RecordState from './record'

export default class TreeState extends RecordState {
  tree: PatriciaTrie<RecordState>

  constructor (target: RecordState = undefined) {
    super()
    this.tree = new PatriciaTrie<RecordState>(target)
  }

  transform (chunk?: Buffer): RecordState {
    return this.exec(this, chunk)
  }

  exec (scope: RecordState, ...inputs: any[]): RecordState {
    let input = inputs.shift()
    let key = toBuffer(input)
    if (!key) {
      let target = this.resolve(input)
      this.tree.add(target)
      return target
    } else {
      let target = new TreeState()
      let added = this.tree.set(key, target)

      if (added === target) {
        // A new value has been added
        let location = this.tree.locate(key)
        return location.record(input, ...inputs)
      }

      // An existing value matches exactly
      // Record remaining arguments
      if (inputs.length) return added.record(...inputs)
      // TODO: possibly record result
      return added
    }
  }
}
