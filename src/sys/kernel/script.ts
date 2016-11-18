import Code from 'jsvm/code'
import {Sandbox} from 'jsvm'

export default class Script extends Code implements PromiseLike<void> {
  dependencies: string[] = []
  loading: Promise<void>

  constructor (code: string) {
    super(code)

    this.addImport()

    this.loading = this.load()
  }

  then (resolve, reject) {
    return this.loading.then(resolve, reject)
  }

  eval (context: Function, global?: any): Promise<any> {
    return super.eval(context, global)
  }

  private addImport () {
    this.replace(/\bimport(\s+)([\w\\]+)/g, 'const$1{default}')
    this.replace(/\bimport\b(?!\\)/g, 'const')
    this.replace(/\bfrom(\s*)((["'])(?:\\[\s\S]|(?!\3)[^\\])*\3)/g, '=$1require($2)')
    this.replace(/\bimport(\s*)((["'])(?:\\[\s\S]|(?!\3)[^\\])*\3)/g, '$1require($2)')
  }

  private getDependencies () {
    const pathnames = []
    let pattern = /\brequire\s*\(\s*((["'])(?:\\[\s\S]|(?!\2)[^\\])*\2)/g
    let match
    while ((match = pattern.exec(this.toString()))) pathnames.push(match[1])
    return pathnames
  }

  private async load () {
  }
}
