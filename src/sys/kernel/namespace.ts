export default class Namespace {
  constructor (public context: any = Object.prototype) { }

  async install (library: string) {
    let exports = System.import(library)
    let context = Object.create(this.context)

    Object.assign(context, exports)

    this.context = context
  }
}
