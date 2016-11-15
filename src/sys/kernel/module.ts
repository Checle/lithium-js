export default class Module {
  exports: any = {}

  constructor (public readonly id: string, public filename: string = id) { }
}
