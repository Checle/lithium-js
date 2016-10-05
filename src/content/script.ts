import {createContext, runInContext, Context, RunningScriptOptions} from 'vm'

import Global from '../modules/global'
import {Record} from '../types'
import {Module} from '../modules/module'

let context = createContext(new Global())

function createFunction(body: string, context: Context, options: RunningScriptOptions): Function {
  return runInContext('(function () {' + body + '\n})', context, options)
}

export default function script (this: Record, code, ...args) {
  let module = new Module(this.path)
  let func = createFunction(String(code), this, { filename: this.path })
  let result = func.apply(this, args)
}
