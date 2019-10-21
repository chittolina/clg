import * as Koa from 'koa'
import loader from './loaders'
import database from './config/database'
import stackoverflowService from './services/stackoverflow'

const app = new Koa()

loader(app)

const PORT = process.env.PORT || 3000

const server = {
  start: async () => {
    await database.start(() => console.log('Database connection has crashed!'))

    if (process.env.NODE_ENV !== 'test') {
      stackoverflowService.start()
    }

    app.listen(PORT)
  },

  stop: () => {
    database.stop()
    process.exit(0)
  },
}

async function start() {
  await server.start()
  console.log(`Server running on port ${PORT}`)
}

if (process.env.NODE_ENV !== 'test') {
  start()
}

export default server
