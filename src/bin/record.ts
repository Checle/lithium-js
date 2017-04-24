#!/usr/bin/node

import record from 'record'
import * as program from 'commander'

async function main (command: string, ...args: string[]) {
  program
    .usage('[options] [command] [arg ...]]')
    .parse([].concat(arguments))

  if (!command) {
    command = await record()
    args = []

    let arg: string

    while ((arg = await record())) args.push(arg)
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
