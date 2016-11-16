#!/usr/bin/node

import 'boot'
import * as program from 'commander'
import Reader from 'util/reader'

import {execl} from 'unistd'

program
  .usage('[options] [command] [arg ...]]')
  .parse(process.argv)

async function record (command: string, ...args: string[]) {
  const reader = new Reader(0)

  if (!command) {
    command = await reader.readString()

    args = []
    let arg: string
    while ((arg = await reader.readString())) args.push(arg)
  }

  execl(command, ...args)
}

record.apply(null, program.args)
