import * as Koa from 'koa'
import { userRouter } from '../routes'

export default function(app: Koa): void {
  app.use(userRouter.routes())
}
