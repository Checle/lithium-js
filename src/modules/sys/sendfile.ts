import {BUFSIZ} from '../stdio'
import {lseek, read, write, Off, SEEK_SET, Size, Ssize} from '../unistd'

export {Off, Size, Ssize} from '../unistd'

export async function sendfile (outFd: number, inFd: number, offset?: Off, count: Size = Infinity): Promise<Ssize> {
  let buffer = new ArrayBuffer(BUFSIZ)
  let total = 0, size: Ssize
  if (offset != null) lseek(inFd, offset, SEEK_SET)
  do {
    size = await read(inFd, buffer, Math.min(BUFSIZ, count - total))
    await write(outFd, buffer, size)
    total += size
  } while (size === BUFSIZ && total < count)
  return total
}
