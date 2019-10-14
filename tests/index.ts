import user from '../src/api/core/user'
import { expect } from 'chai'
import 'mocha'
import server from '../src/api'
import stackoverflow, { client } from '../src/api/services/stackoverflow'
import * as stackoverflowUsers from './__mocks__/stackoverflow-users.json'
import MockAdapter from 'axios-mock-adapter'
import * as users from './__mocks__/users.json'
import User from '../src/api/models/user'

describe('Test user module', async function() {
  const mock = new MockAdapter(client)

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

  it('Should filter brazilian users only', async () => {
    const searchLocation = 'Brazil'

    mock
      .onGet('/users?page=1&pagesize=100&site=stackoverflow')
      .reply(200, { items: stackoverflowUsers })

    const brazilianUsers = stackoverflowUsers
      .filter(user => user.location.match(searchLocation))
      .map(user => ({
        userId: user.user_id,
        displayName: user.display_name,
        location: user.location,
        lastAccessDate: user.last_access_date,
        profileImage: user.profile_image,
      }))

    const foundUsers = await stackoverflow.listUsers({
      page: 1,
      pageSize: 100,
      location: searchLocation,
    })

    expect(foundUsers).to.deep.equal(brazilianUsers)
  })
  after(async function() {
    await User.deleteMany({})
    server.stop()
  })
})
