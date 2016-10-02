import * as vm from 'vm'
import {create} from '../utils'

const global = (function () { return this })()

export interface Context extends vm.Context {
  global: Object
}

/**
 * Extends `Context` to preserve its sandbox's callable property.
 */
export function createContext (sandbox: any = {}): Context {
  Object.defineProperty(sandbox, 'global', { value: create(sandbox) })
  return vm.createContext(sandbox) as Context
}

/**
 * Extends `Script` to contain a list of possible variable names referenced in
 * any statement of the script.
 */
export class Script {
  private script: vm.Script
  private names: string[] = []

  constructor (code: string, options?: vm.ScriptOptions) {
    // TODO: tokenize
    const VariableName = /\w+/g // Not exact and standards compliant as not security relevant here

    code = `
      function () {
        ${code}
      }.call(global)
    `
    this.script = new vm.Script(code, options)

    let match: RegExpExecArray
    while ((match = VariableName.exec(code))) this.names.push(match[0])
  }

  runInContext (context: Context, options?: vm.RunningScriptOptions) {
    let properties: PropertyDescriptorMap = {}
    let global = context.global

    for (let key in this.names) {
      if (!(key in context)) {
        properties[key] = {
          get: () => global[key],
          set: (value) => (global[key] = value)
        }
      }
    }

    Object.defineProperties(context, properties)

    return this.script.runInContext(context, options)
  }

  runInNewContext (sandbox: any = {}, options?: vm.RunningScriptOptions) {
    return this.runInContext(createContext(sandbox), options)
  }

  runInThisContext (sandbox: any = {}, options?: vm.RunningScriptOptions) {
    return this.runInNewContext(global, options)
  }
}

export function runInContext (code: string, context: Context, options?: vm.RunningScriptOptions) {
  return new Script(code).runInContext(context, options)
}

export function runInNewContext (code: string, sandbox: any = {}, options?: vm.RunningScriptOptions) {
  return new Script(code).runInNewContext(sandbox, options)
}

export function runInThisContext (code: string, options?: vm.RunningScriptOptions) {
  return new Script(code).runInThisContext(options)
}
