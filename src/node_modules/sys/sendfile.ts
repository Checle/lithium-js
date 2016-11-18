import {BUFSIZ} from 'stdio'
import {lseek, read, write, Off, Seek, Size, Ssize} from 'unistd'

export {Off, Size, Ssize}

export async function sendfile (outFd: number, inFd: number, offset?: Off, count: Size = Infinity): Promise<Ssize> {
  let buffer = new Buffer(BUFSIZ)
  let total = 0, size: Ssize
  if (offset != null) lseek(inFd, offset, Seek.SET)
  do {
    size = await read(inFd, buffer, Math.min(BUFSIZ, count - total))
    await write(outFd, buffer, size)
    total += size
  } while (size === BUFSIZ && total < count)
  return total
}
