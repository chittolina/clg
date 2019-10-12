import music from '../src/api/core/music'
import event from '../src/api/core/event'
import { expect } from 'chai'
import 'mocha'

describe('First test suite', () => {
  it('Should list all available musics', () => {
    const musics = music.listMusics()
    expect(musics).to.have.lengthOf(2)
  })

  it('Should list all available events', () => {
    const events = event.listEvents()
    expect(events).to.have.lengthOf(2)
  })
})
