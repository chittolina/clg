import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import RateLimitedQueue from '../src/api/utils/rate-limiter'

const clock = sinon.useFakeTimers()

describe('Test rate limiter', () => {
  it('Should execute callbacks', async () => {
    const queue = new RateLimitedQueue({ max: 3, period: 100 })
    const fn = sinon.spy()
    const callbacks = [...Array(queue.rate.max)].map(() =>
      queue.add({ callback: fn }),
    )

    await Promise.all(callbacks)

    expect(fn.callCount).to.equal(3)
  })

  it('Should rate limit callback executions', async () => {
    const queue = new RateLimitedQueue({ max: 3, period: 100 })
    const fn = sinon.spy()

    for (let i = 0; i < queue.rate.max + 1; i++) {
      queue.add({ callback: fn })
    }

    // Respect rate limit, which is in this case, 3 per 100ms
    expect(fn.callCount).to.equal(queue.rate.max)
    clock.tick(90)
    expect(fn.callCount).to.equal(queue.rate.max)
  })

  it('Should execute delayed callback executions upon released slots', () => {
    const queue = new RateLimitedQueue({ max: 3, period: 100 })
    const fn = sinon.spy()

    for (let i = 0; i < queue.rate.max + 2; i++) {
      queue.add({ callback: fn })
    }

    // Respect rate limit, which is in this case, 3 per 100ms
    expect(fn.callCount).to.equal(queue.rate.max)
    clock.tick(90)
    expect(fn.callCount).to.equal(queue.rate.max)

    // Expect the exceeded requests to have been called
    queue.releaseSlot()
    queue.releaseSlot()

    clock.tick(10)
    expect(fn.callCount).to.equal(queue.rate.max + 2)
  })

  after(async function() {})
})
