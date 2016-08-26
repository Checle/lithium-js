import * as types from '../types'
import * as vm from './vm'
import { Forks } from '../../utils'
import { State } from '../interfaces'
import Sequence from '../sequence'

export class FunctionState implements State {
  constructor (protected acceptor: types.Acceptor) { }

  transform (input?, output = new Sequence()): State {
    // TODO: handle any output type
    return new FunctionState(this.acceptor.call(output, input))
  }
}

export default class CodeState extends Forks implements State {
  input = new Sequence()

  transform (input?, output?): State {
    if (input == null) {
      var acceptor = vm.Function('input', String(this.input))
      return new FunctionState(acceptor).transform(input, output)
    }
    this.input.push(input)
    return this.fork()
  }
}

export const InitialState = CodeState
