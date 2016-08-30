// Character stream device
import bash from 'fs'
import { Str } from './types'

export default function (duplex) {
  var path = Str.read(duplex)
  if (!path) return

  // Parse additional parameters here

  fs.createReadStream().pipe(duplex).pipe(fs.createWriteStream())
}
