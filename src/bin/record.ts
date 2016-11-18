#!/usr/bin/node

import 'boot'
import * as program from 'commander'
import {Zone} from 'operate'
import {execl, fork, setuid} from 'unistd'
import {waitpid} from 'sys/wait'

import Reader from '../sys/util/reader'

program
  .usage('[options] [command] [arg ...]]')
  .parse(process.argv)

async function main (command: string, ...args: string[]) {
  const reader = new Reader(0)

  if (!command) {
    command = await reader.readString()

    args = []
    let arg: string
    while ((arg = await reader.readString())) args.push(arg)
  }

  fork().then(async pid => {
    if (pid === 0) {
      await setuid(1)
      console.log("Forky")
      await execl(command, ...args)
      return
    }

    await waitpid(pid)

    console.log("Juju")
  })
}

main.apply(null, program.args)
