#!/usr/bin/node

import 'boot'
import record from 'record'
import * as http from 'http'
import * as path from 'path'
import * as url from 'url'
import {fclose, fopen, File} from 'stdio'
import {opendir, readdir, closedir, Dir, Dirent} from 'dirent'
import {stat} from 'unistd'
import {Stat, S} from 'sys/stat'
import {IncomingMessage, ServerResponse} from 'http'

let port = Number(process.argv[2]) || 80
let root = path.resolve(__dirname, '..')

http.createServer(request).listen(port)

async function request(req: IncomingMessage, res: ServerResponse) {
  let uri = url.parse(req.url).pathname
  let filename = path.join(root, uri)

  res.setHeader('Content-Type', 'text/plain')

  const status: Stat = await stat(filename)

  if (status.mode & S.IFDIR) {
    let dir: Dir = await opendir(filename)
    for (let dirent of dir) {
      res.write(dirent.name + '\0')
    }
    closedir(dir)
  } else {
    const file: File = await fopen(filename)
    file.pipe(res)
    fclose(file)
  }

  switch (req.method) {
    case 'GET':
  }
}
