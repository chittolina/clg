import stackoverflow from '../src/api/core/stackoverflow'
import { expect } from 'chai'

import 'mocha'

describe('Test stackoverflow module', () => {
  it('Should list users', async () => {
    const page = 1
    const pageSize = 10
    const users = await stackoverflow.listUsers({ page, pageSize })

    expect(users).to.have.lengthOf(pageSize)
  })
})
