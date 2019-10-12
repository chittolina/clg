import * as sqlite3 from 'sqlite3'

const db = new sqlite3.Database(':memory:')

const obj = {
  client: db,
  start: (done: Function) => {
    db.serialize(() => {
      db.run('create table users (name text)')
      done()
    })
  },
}

export default obj
