import * as Koa from 'koa'
import koaLoader from './koa'
import routesLoader from './routes'

export default function(app: Koa): void {
  koaLoader(app)
  routesLoader(app)
}
