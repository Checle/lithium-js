import * as vm from 'vm'
import Global from '../../context/global'

export function exec (code: string | Buffer, ...args): any {
  var path = String(args[0])
  var global = new Global()
  global.this = args
  var context = vm.createContext(global)
  var script = new vm.Script('this.result=Function.prototype.call.apply(function(input){' + String(code) + '\n}, this.this)', { filename: path, displayErrors: true })
  script.runInContext(context)
  return global.hasOwnProperty('result') ? global.result : undefined
}

export function Function (...args) {
  var context = { this: null }
  var expression = String(Function.apply(null, args))
  var options = { filename: String(this), displayErrors: true, lineOffset: -1 }
  var code = 'this.this='+expression
  vm.runInNewContext(code, context, options)
  return context.hasOwnProperty('this') ? context.this : undefined
}
