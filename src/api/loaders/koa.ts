import * as bodyParser from 'koa-bodyparser'
import * as koaStatic from 'koa-static'
import * as Koa from 'koa'
import * as path from 'path'

export default function(app: Koa): void {
  app.use(bodyParser())
  app.use(koaStatic(path.join(__dirname, '../../client')))
}
