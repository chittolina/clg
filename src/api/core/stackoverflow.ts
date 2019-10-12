import axios from 'axios'
import * as nodeSchedule from 'node-schedule'
import User, { IUser } from '../models/user'
import * as R from 'ramda'

type User = IUser

const client = axios.create({
  baseURL: 'https://api.stackexchange.com/2.2',
  validateStatus: () => true, // Do not throw on 4xx/5xx
})

const SEARCH_LOCATION = 'Brazil'
const MAX_REQS_PS = 10
let currentPage = 1

nodeSchedule.scheduleJob('*/1 * * * * *', async () => {
  const users = R.flatten(
    await Promise.all(
      [...Array(MAX_REQS_PS)].map(() =>
        listUsersByPage({ page: currentPage, location: SEARCH_LOCATION }),
      ),
    ),
  )

  if (users.length > 0) {
    await User.insertMany(users)
  }

  currentPage += 1
})

async function listUsersByPage({
  page = 1,
  pageSize = 100,
  location = '',
} = {}): Promise<User[]> {
  let { data, status } = await client.get(
    `/users?page=${page}&pagesize=${pageSize}&site=stackoverflow`,
  )

  if (!data || status !== 200) {
    return []
  }

  const users = data.items
    .filter(
      (user: any) =>
        user.location &&
        user.location.match(location) &&
        user.displayName &&
        user.lastAccessDate,
    )
    .map((user: any) => ({
      displayName: user.display_name,
      lastAccessDate: user.last_access_date,
      location: user.location,
    }))

  return users
}

export default {
  listUsers: async (): Promise<User[]> => {
    let users = await User.find({})

    return users
  },
}
