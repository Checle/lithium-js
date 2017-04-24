import {open, O_RDONLY} from '../fcntl'
import {close, read} from '../unistd'
import {BUFSIZ} from '../stdio'

let baseFetch = global['fetch']

export async function fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  if (typeof input === 'string') {
    input = new Request(input)
  }

  let url = new URL(input.url, location.href)

  if (url.protocol !== 'file:') return baseFetch(input, init)

  let pathname = decodeURIComponent(url.pathname)
  let fd = await open(pathname, O_RDONLY)
  let buffers = []
  let buffer

  while (await read(fd, (buffer = new ArrayBuffer(BUFSIZ))) > 0) {
    buffers.push(buffer)
  }

  await close(fd)

  return new Response(new Blob(buffers))
}
