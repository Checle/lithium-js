let current = {next: null}

function push(obj) {
  if (typeof obj === 'function') {
    queue.push(obj)
  } else {
    let last = queue[queue.length - 1]

    if (typeof last === 'function') {
      queue.push([obj])
    } else {
      last.push(obj)
    }

    if (typeof queue[queue.length - 1] !== 'function')
  }
}

export default function record (target?): any {
  if (typeof target === 'function') {
    queue.push(target)
    queue.
  }
  postMessage(message)
}

export function Integer (message) {
  post message
}
