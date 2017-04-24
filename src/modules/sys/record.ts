import * as fcntl from '../fcntl'
import * as unistd from '../unistd'
import * as stdio from '../stdio'

let listeners = {nextId: 0}

addEventListener('message', (event: MessageEvent) => {
  let data = event.data
  let listener = listeners[data.id]

  if (!listeners.hasOwnProperty(data.id)) return
  if (data.id < 0) return

  if (data.hasOwnProperty('error')) {
    listener.reject(data.error)
  } else {
    listener.resolve(data.result)
  }

  event.stopPropagation()
})

export async function syscall (number: any, ...args): Promise<any> {
  let id = listeners.nextId++

  return new Promise((resolve, reject) => {
    listeners[id] = {resolve, reject}

    postMessage({id, number, args})
  })
}

export function install (library: string, alias?: string): Promise<void> {
  return syscall(install.name, ...arguments)
}

export function branch (path1: string, path2: string): Promise<void> {
  
}
