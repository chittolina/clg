import * as Router from 'koa-router'
import event from '../core/event'

const router = new Router({
  prefix: '/event',
})

router.get('/', async ctx => {
  ctx.body = event.listEvents()
})

export const eventRouter = router
