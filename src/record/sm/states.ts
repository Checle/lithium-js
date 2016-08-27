import fork from 'forks'
import * as types from 'types'
import * as interfaces from 'interfaces'
import Sequence from 'sequence'
import * as vm from './vm'

@fork abstract class State implements interfaces.State {
  abstract transform (input?, output?): State
}

export class FunctionState implements State {
  constructor (protected acceptor: types.Acceptor) { }

  transform (input?: Buffer, output = new Sequence()): State {
    // TODO: handle any output type
    return new FunctionState(this.acceptor.call(output, input))
  }
}

export default class CodeState implements State {
  input = new Sequence()

  transform (input?: Buffer, output?: Sequence): State {
    if (input == null) {
      var acceptor = vm.Function('input', String(this.input))
      return new FunctionState(acceptor).transform(input, output)
    }
    this.input.push(input)

    return fork(this)
  }
}

export const InitialState = CodeState
