import { Readable } from 'stream'

export default class BaseDAO {
  get (id) {
    return null
  }
  update (id, string) { }
  remove (id) { }
  open (id) {
    var string = this.get(id)
    var stream = new Readable()

    if (string == null) return null
    stream.push(string)
    stream.push(null)
    return stream
  }
}
