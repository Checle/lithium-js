#!/usr/bin/node

import 'boot'
import fetch from 'fetch'
import * as path from 'path'
import * as program from 'commander'
import * as url from 'url'
import {creat} from 'fcntl'
import {chmod, close, write} from 'unistd'

const RemoteURL = process.env.LOAD_REMOTE_URL || 'http://127.0.0.1:8000'

program
  .usage('hash')
  .parse(process.argv)

async function load (hash: string) {
  const uri = url.resolve('/sys/hash', hash)
  const filename = path.resolve(__dirname, '../sys/hash', hash)

  const res: Response = await fetch(url.resolve(RemoteURL, uri))
  if (res.status !== 200) throw new Error(`${res.statusText} (${res.status})`)

  const data: string = await res.text()
  const fd = await creat(filename, 0o200) // Create a writable file
  await write(fd, data)
  await close(fd)
  await chmod(filename, 0o500)
}

load.apply(null, program.args)
