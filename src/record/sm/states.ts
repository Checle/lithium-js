import * as interfaces from '../../interfaces'
import * as types from '../../types'
import * as vm from 'vm'
import Global from '../api/js'
import { Sink } from '../../interfaces'
import fork from 'object-fork'
import Sequence from '../../sequence'
import Tree from '../../util/tree'

export default State

@fork export abstract class State implements interfaces.State {
  abstract transform (output: Sink, input: Buffer): State
}

export class StateContext implements Sink {
  constructor (private output: Sink, private state: State) { }

  push (input: any) {
    // TODO: treat input and output variations
    var state = this.state.transform(this.output, input)
    this.state = state != null ? state : fork(this.state)
  }
}

export class FunctionState implements State {
  constructor (protected acceptor: interfaces.Acceptor) { }

  transform (output: Sink, input: Buffer): State {
    // TODO: handle any output type
    var result = this.acceptor.call.apply(this.acceptor, arguments)
    if (result != null) return new FunctionState(result)
  }
}

export class MultilineCodeState implements State {
  input = new Sequence()
  global = new Global()

  // TODO: end script on 0 char
  // TODO: just reexecute script on new context on SyntaxError

  transform (output: Sink, input: Buffer): State {
    this.input.push(input)
    var buffer = this.input.valueOf()
    for (var i = buffer.length - 1; i >= 0; i--) if (buffer[i] < 32) break
    var code = String(buffer.slice(0, i))
    try {
      // Variables assigned in the global scope will be reflected in this.global
      vm.runInNewContext(code, this.global)
    } catch (error) {
      if (error instanceof SyntaxError) return
      process.stderr.write(String(error) + '\r') // Print (and execute) any throw result to out like node
      // TODO: meaningful output = type string and Sequence
    }
    this.input = new Sequence(buffer.slice(i))
  }
}

export class CodeState implements State {
  global = vm.createContext(new Global())

  transform (output: Sink, input: Buffer): any {
    var code = String(input)
    try {
      // Variables assigned in the global scope will be reflected in this.global
      vm.runInContext(code, this.global)
    } catch (result) {
      output.push(String(result))
      process.stderr.write('\r' + String(result) + '\r\n') // Print (and execute) any throw result to out like node
    }
  }
}

export abstract class SegmentState implements State {
  input = new Sequence()

  abstract process (output: Sink, input: Sequence): State

  transform (output: Sink, input: Buffer): State {
    if (input == null) {
      let sequence = this.input
      this.input = new Sequence()
      return this.process(output, sequence)
    }
    this.input.push(input)
  }
}

export class RecordState extends SegmentState {
  process (output: Sink, input: Sequence): State {
    return null
  }
}

export class ProcessState implements State {
  transform (output: Sink, input: Buffer): State {
    return null
  }
}
