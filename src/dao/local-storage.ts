import BaseDAO from './base.ts'

export default class LocalStorageDAO extends BaseDAO {
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
