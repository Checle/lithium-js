import * as readline from 'readline'
import {createInterface, ReadLine} from 'readline'
import {Writable} from 'stream'
import {RecordStream} from './stream'

var record = new RecordStream()
var terminal: ReadLine
var reader: ReadLine

export function start (options) {
  var prompt = options
  if (typeof prompt === 'string') options = {}
  else prompt = options.prompt

  terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  if (prompt) terminal.setPrompt(prompt)

  reader = readline.createInterface({
    input: record
  })

  terminal.on('line', (line) => {
    record.write(line)
  })
  reader.on('line', (line) => {
    terminal.write(line)
  })
}
