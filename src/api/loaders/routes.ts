import * as Koa from 'koa'
import { musicRouter, eventRouter } from '../routes'

export default function(app: Koa): void {
  app.use(musicRouter.routes())
  app.use(eventRouter.routes())
}
