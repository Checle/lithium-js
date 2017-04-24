const PROMISE = Symbol('promise')


export default class WorkerVm extends Promise<void> {
  worker: Worker = null

  constructor () {
    super((resolve, reject) => {
      this[PROMISE] = {resolve, reject}
    })
  }

  async exec (code: string): Promise<any> {
    let pathname = await System.resolve('../../../lib/libvm.js', __moduleName)
    let response = await fetch(pathname)
    let blob = response.blob()
    let url = URL.createObjectURL(new Blob([blob, '\n', code]))
    let worker = new Worker(url)

    this.worker = worker

    worker.addEventListener('message', event => {
      let data = event.data

      if (data.type === 'result') {
        this[PROMISE].resolve(data.value)
      }
    })

    worker.addEventListener('error', event => {
      let error = event.error

      this[PROMISE].reject(error)
    })
  }
}

