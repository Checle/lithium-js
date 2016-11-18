import 'boot'
import * as program from 'commander'
import {creat, open} from 'fcntl'
import {sendfile} from 'sys/sendfile'
import {execv} from 'unistd'

program
  .usage('[options] [file] [args...]')
  .option('-m, --minimize', 'minimize output code')
  .option('-n, --no-exec', 'do not make the output file executable or validate syntax if no output file is specified')
  .option('-o, --output outfile', 'write code to file rather than executing')
  .option('-s, --strict', 'run in strict mode')
  .option('-v, --version', 'get version')
  .option('--std [language]', 'set language dialect or get supported')
  .parse([''].concat(arguments))

export default async function main (file: string, ...args: string[]) {

  if (this.hasOwnProperty('output')) {
    let input = file == null ? 0 : await open(file)

    // Create an executable file
    let output = await creat(this.output, 0o775)
    await sendfile(output, input)
  } else {
    // Execute
    await execv(file, args)
  }
}
