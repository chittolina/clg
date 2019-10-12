import stackoverflow from '../src/api/services/stackoverflow'
import { expect } from 'chai'
import 'mocha'
import server from '../src/api'
import * as users from './__mocks__/users.json'
import User from '../src/api/models/user'

describe('Test stackoverflow module', async function() {
  before(async function() {
    await User.insertMany(users)
  })

  it('Should list users', async () => {
    const users = await stackoverflow.listUsers()
    expect(users).to.have.lengthOf(users.length)
  })

  after(async function() {
    await User.deleteMany({})
    server.stop()
  })
})
