import BaseDAO from './base.js'

export class LocalStorageDAO extends BaseDAO {
  get (key) {
    return String(localStorage.getItem(key))
  }
  update (key, string) {
    localStorage.setItem(key, String(string))
  }
  remove (key) {
    localStorage.removeItem(key)
  }
}
