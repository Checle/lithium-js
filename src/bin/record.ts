#!/usr/bin/node

import 'boot'
import * as program from 'commander'
import Reader from '../sys/utils/reader'

async function main (command: string, ...args: string[]) {
  program
    .usage('[options] [command] [arg ...]]')
    .parse([].concat(arguments))

  const reader = new Reader(0)

  if (!command) {
    command = await reader.readString()

    args = []
    let arg: string
    while ((arg = await reader.readString())) args.push(arg)
  }

  let pid = await fork()

  if (pid === 0) {
    await setuid(1)

    console.log("Forky")

    await execl(command, ...args)

    return
  } else {
    await waitpid(pid)
  }

  console.log("Juju")
}

main.apply(null, program.args)
