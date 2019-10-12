import * as Router from 'koa-router'
import stackoverflow from '../core/stackoverflow'

const router = new Router({
  prefix: '/stackoverflow',
})

router.get('/', async ctx => {
  ctx.body = await stackoverflow.listUsers()
})

export const stackoverflowRouter = router
