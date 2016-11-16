#!/usr/bin/node

import 'boot'
import * as program from 'commander'
import * as fs from 'fs'
import * as vm from 'vm'
import {creat, open} from 'fcntl'
import {sendfile} from 'sys/sendfile'
import {chmod, close, execv, write} from 'unistd'

program
  .usage('[options] [file]')
  .option('-m, --minimize', 'minimize output code')
  .option('-n, --no-exec', 'do not make the output file executable or validate syntax if no output file is specified')
  .option('-o, --output outfile', 'write code to file rather than executing')
  .option('-s, --strict', 'run in strict mode')
  .option('-v, --version', 'get version')
  .option('--std [language]', 'set language dialect or get supported')
  .parse(process.argv)

async function js (this: any, filename: string, ...args: string[]) {
  if (this.hasOwnProperty('output')) {
    let input = filename == null ? 0 : await open(filename)

    // Create an executable file
    let output = await creat(this.output, 0o775)
    await sendfile(output, input)
  } else {
    // Execute
    await execv(filename, args)
  }
}

js.apply(program, program.args)
