import {createContext, Context, Script} from 'jsvm'

function toString(bytes: BufferSource) {
  let string: String

  if (typeof bytes !== 'string') {
    return String.fromCharCode.apply(null, bytes)
  } else {
    return bytes
  }
}

export class CompilerError extends Error implements WebAssembly.CompileError {
  constructor (public message: string = null, public fileName: string = null, public lineNumber: string = null, public columnNumber: string = null) {
    super(message)
  }
}

export class Module implements WebAssembly.Module {
  script: Script

  constructor (bytes: BufferSource) {
    this.script = new Script(toString(bytes))
  }
}

export class Instance implements WebAssembly.Instance {
  context: Context
  module: Module
  exports = {}

  constructor (moduleObject: Module, importObject?: any) {
    this.context = createContext(importObject)
    this.module = moduleObject

    let result = this.module.script.runInContext(this.context) || this.context

    this.exports = result
  }
}

export function validate (bytes: BufferSource): boolean {
  try {
    new Function(toString(bytes))
    return true
  } catch (e) {
    return false
  }
}

export async function compile (bytes: BufferSource): Promise<Module> {
  if (!validate(bytes)) {
    throw new CompilerError()
  }

  return Promise.resolve(new Module(bytes))
}

export async function instantiate (bytes: BufferSource): Promise<[Module, Instance]> {
  let module = await compile(bytes)

  return new Promise<[Module, Instance]>((resolve, reject) => {
    let instance = Object.create(module) as Instance

    return [module, instance]
  })
}
