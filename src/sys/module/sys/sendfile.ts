import {BUFSIZ} from 'stdio'
import {lseek, read, write, Off, Seek, Size, Ssize} from 'unistd'

export {Off, Size, Ssize}

export async function sendfile (outFD: number, inFD: number, offset?: Off, count: Size = Infinity): Promise<Ssize> {
  let buffer = new Buffer(BUFSIZ)
  let total = 0, size: Ssize
  if (offset != null) lseek(inFD, offset, Seek.SET)
  do {
    size = await read(inFD, Math.min(BUFSIZ, count - total), buffer)
    await write(outFD, buffer, size)
    total += size
  } while (size === BUFSIZ && total < count)
  return total
}
