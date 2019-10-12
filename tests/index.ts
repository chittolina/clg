import user from '../src/api/core/user'
import { expect } from 'chai'
import 'mocha'
import server from '../src/api'
import * as users from './__mocks__/users.json'
import User from '../src/api/models/user'

describe('Test user module', async function() {
  before(async function() {
    await User.insertMany(users)
  })

  it('Should list users', async () => {
    const users = await user.listUsers()
    expect(users).to.have.lengthOf(users.length)
  })

  after(async function() {
    await User.deleteMany({})
    server.stop()
  })
})
