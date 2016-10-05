import base from './base'
import Readable from './state/context/readable'

let record = base.accessor

record(() => console.log(23))
record("abc")

let read = new Readable(base)
console.log(1, read.read(2))
read.on('data', data => console.log('data', data))
