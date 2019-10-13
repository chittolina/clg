import * as Koa from 'koa'
import loader from './loaders'
import database from './config/database'
import stackoverflow from './services/stackoverflow'

database.start(() => console.log('Database connection has crashed!'))

const app = new Koa()

loader(app)

const PORT = process.env.PORT || 3000

const server = {
  start: () => {
    stackoverflow.start()
    app.listen(PORT)
    console.log(`Server running on port ${PORT}`)
  },
  stop: () => {
    process.exit(0)
  },
}

server.start()

export default server
