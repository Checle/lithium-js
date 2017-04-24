let sequence = 0

new WebAssembly.CompileError()

export class CompilerError extends Error implements WebAssembly.CompileError {
  constructor (public message: string = null, public fileName: string = null, public lineNumber: string = null, public columnNumber: string = null) {
    super(message)
  }
}

export class Module implements WebAssembly.Module {
  url: string

  constructor (bytes: BufferSource) {
    let init = function (callback) {
      var postMessage = self.postMessage.bind(self)
      var exports = {}

      callback()

      for (var name in self) {
        var value = self[name]

        if (value === undefined) continue

        exports[name] = typeof value === 'function' ? undefined : value
      }

      postMessage(exports)
    }

    let blob = new Blob(['new ', String(init), '(', bytes, ')'])

    this.url = URL.createObjectURL(bytes)
  }
}

export class Instance implements WebAssembly.Instance {
  worker: Worker
  exports: any[]

  constructor (moduleObject: Module, importObject?: any) {
    throw 'Not implemented'
  }
}

export function validate (bytes: BufferSource): boolean {
  // TODO new Function(bytes)
  return true
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
    let worker = new Worker(module.url)

    instance.worker = worker

    worker.addEventListener('error', event => reject(event.error))
    worker.addEventListener('message', event => {
      let exports = event.data

      for (let name in exports) {
        if (exports[name] === undefined) exports[name] = function () {
          worker.postMessage({type: 'call', id: ++sequence, name, arguments})
        }
      }

      resolve([module, instance])
    })
  })
}
