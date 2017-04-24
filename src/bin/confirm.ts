#!/usr/bin/node

import 'boot'
import * as crypto from 'crypto'
import * as path from 'path'
import * as child_process from 'child_process'
import * as program from 'commander'
import {PassThrough} from 'stream'

export default async function (parent: string = 'latest', target: string) {
  program.usage('[target]').parse([''].concat(arguments as any))

  const bin = __dirname
  const root = path.resolve(bin, '..')

  chdir(path.resolve(root, 'record/states'))

  try { parent = await realpath(path.basename(parent)) }
  catch (e) { parent = null }

  try {
    target = await realpath(target)
  } catch (e) {
    const pid = await fork()

    if (pid === 0) {
      return await execl(path.resolve(bin, 'load'), path.resolve('/record/hash', target))
    }

    await waitpid(pid)
  }

  const hash = crypto.createHash('sha256')

  hash.write(parent + '\0')
  stdin.pipe(hash)

  fork().then(pid => {
    if (pid === 0) execl('/bin/sh')
  })

  /*
  child.on('close', (code, status) => {
    if (code === 0) accept()

    if (code == null) process.kill(process.pid, status)
    process.exit(code)
  })

  function load (path) {

  }

  function accept () {
    let digest = hash.digest('hex')

    try { fs.mkdirSync(digest) } catch (e) { }
    try { fs.unlinkSync('latest') } catch (e) { }
    fs.symlinkSync(digest, 'latest')

    process.stdout.write(digest + '\n')
  }
  */
}
