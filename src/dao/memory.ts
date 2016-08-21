import BaseDAO from './base.ts'

export default class MemoryDAO extends BaseDAO {
  constructor () {
    super()
    this.map = {}
  }

  private map

  get (key) {
    if (!this.map.hasOwnProperty(key)) return null
    return this.map[key]
  }
  update (key, string) {
    this.map[key] = String(string)
  }
  remove (key) {
    delete this.map[key]
  }
}
