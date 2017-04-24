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

Object.assign(global, exports)
