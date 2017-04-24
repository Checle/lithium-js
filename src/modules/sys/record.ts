import * as fcntl from '../fcntl'
import * as unistd from '../unistd'
import * as stdio from '../stdio'

let requests = {length: 0}

addEventListener('message', (event: MessageEvent) => {
  let {id, type, data} = event.data
  let request = requests[id]

  if (type === 'result') request.resolve(data)
  else if (type === 'error') request.reject(data)
  else return

  event.stopImmediatePropagation()
})

function request(type: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let callback = resolve
    let request = {id: (requests.length++ % Number.MAX_VALUE), type, data}

    requests[request.id] = {resolve, reject}

    postMessage(request)
  })
}

async function respond(id: any, type: string, data: any): Promise<void> {
  try {
    data = await data
    postMessage({id, type: 'result', data})
  } catch (error) {
    postMessage({id, type: 'error', error})
  }
}

export async function syscall (id: any, ...args): Promise<any> {
  return request('syscall', arguments)
}

export function branch (path1: string, path2: string): Promise<void> {
  return
}

export async function install (library: string): Promise<void> {
  library = await System.resolve(library)

  return syscall(install.name, library)
}
