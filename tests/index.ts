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

  it('Should list users in descending order', async () => {
    const users = await user.listUsers()
    const orderedUsers = users.sort(
      (a: any, b: any) => b.lastAccessDate - a.lastAccessDate,
    )

    expect(users).to.deep.equal(orderedUsers)
  })

  after(async function() {
    await User.deleteMany({})
    server.stop()
  })
})
