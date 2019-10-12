import * as Koa from 'koa'
import loader from './loaders'

const app = new Koa()

loader(app)

const PORT = process.env.PORT || 3000

app.listen(PORT)

console.log(`Server running on port ${PORT}`)
