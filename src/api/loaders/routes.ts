import * as Koa from 'koa'
import { stackoverflowRouter } from '../routes'

export default function(app: Koa): void {
  app.use(stackoverflowRouter.routes())
}
