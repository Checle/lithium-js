#!/usr/bin/node

import 'boot'
import * as program from 'commander'
import * as fs from 'fs'
import {spawn} from 'child_process'

const bash = require('bashful')

export default async function main (scriptFile: string) {
  program
    .usage('[options] [script-file]')
    .parse([].concat(arguments))

  const sh = bash({
    env: environ,
    spawn: spawn,
    read: fs.createReadStream,
    write: fs.createWriteStream,
    exists: fs.exists,
  })
  const stream = sh.createStream()

  stdin.pipe(stream).pipe(stdout)
}
