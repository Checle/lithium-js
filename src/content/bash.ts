import {Record} from '../types'

const Bash = require('bashful')

const bash = new Bash({})

export default function (this: Record, input: Buffer) {
  let expr = String(input)

  return bash.eval(expr)
}
