/** The queue item interface */
interface QueueItem {
  callback: Function
  data?: any
}
/** The execution rate type */
type Rate = {
  max: number
  period: number
}

/** The default execution rate */
const DEFAULT_RATE: Rate = {
  max: 3,
  period: 1000,
}

/**
 * This class is used to rate limit function executions. It was first created
 * to be used in HTTP calls. However, it can be extended to any type of function call.
 */
class RateLimitedQueue {
  rate: Rate
  remainingSlots: number
  items: QueueItem[]
  timer: any
  freezed: boolean

  constructor(rate?: Rate) {
    this.items = []
    this.timer = null
    this.freezed = false
    this.rate = rate || DEFAULT_RATE
    this.remainingSlots = this.rate.max
  }

  /**
   * Runs the queue. This will execute every pending callbacks, respecting the max rate
   */
  run() {
    if (this.freezed) {
      return
    }

    if (this.remainingSlots == this.rate.max) {
      this.timer = setTimeout(() => this.run(), this.rate.period)
    }

    if (this.remainingSlots < 1) {
      return
    }

    const itemsToExecute = this.items.splice(0, this.remainingSlots)

    itemsToExecute.forEach(({ callback, data }) => callback(data))

    this.remainingSlots -= itemsToExecute.length
  }

  /**
   * Adds an item to the queue and run it
   * @param item
   */
  add(item: QueueItem) {
    this.items.push(item)
    this.run()
  }

  /**
   * Releases a slot on the queue
   */
  releaseSlot() {
    if (this.remainingSlots + 1 > this.rate.max) {
      return
    }

    this.remainingSlots += 1
  }

  /**
   * Sets a specific amount of remaining slots to the queue
   * @param amount
   */
  setRemainingSlots(amount: number) {
    const amountToSet = amount > this.rate.max ? this.rate.max : amount

    this.remainingSlots = amountToSet
  }

  /**
   * Freezes the queue
   */
  freeze() {
    if (this.freezed) {
      return
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.freezed = true
  }

  /**
   * Unfreezes the queue
   */
  unfreeze() {
    if (!this.freezed) {
      return
    }

    this.timer = setTimeout(() => this.run(), this.rate.period)
    this.freezed = false
  }
}

export default RateLimitedQueue
