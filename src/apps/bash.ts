import * as fs from 'fs'
import Bash from 'bashful'

export default function bash () {
  var env = Object.create(process.env)
  env.PS1 = ''

  var sh = Bash({
      env: process.env,
      spawn: require('child_process').spawn,
      write: fs.createWriteStream,
      read: fs.createReadStream,
      exists: fs.exists
  });

  var stream = sh.createStream()
  process.stdin.pipe(stream).pipe(process.stdout)
}
