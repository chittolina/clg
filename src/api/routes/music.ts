import * as Router from 'koa-router'
import music from '../core/music'

const router = new Router({
  prefix: '/music',
})

router.get('/', async ctx => {
  ctx.body = music.listMusics()
})

export const musicRouter = router
