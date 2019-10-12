import * as Router from 'koa-router'
import user from '../core/user'

const router = new Router({
  prefix: '/user',
})

router.get('/', async ctx => {
  ctx.body = await user.listUsers()
})

export const userRouter = router
