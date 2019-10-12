import axios from 'axios'
import * as nodeSchedule from 'node-schedule'
import User, { IUser } from '../models/user'
import * as R from 'ramda'

const client = axios.create({
  baseURL: 'https://api.stackexchange.com/2.2',
  validateStatus: () => true, // Do not throw on 4xx/5xx
})

const SEARCH_LOCATION = 'Brazil'
const MAX_REQS_PS = 25
let allowedToRequest = true
let currentPage = 0

if (process.env.NODE_ENV !== 'test') {
  nodeSchedule.scheduleJob('*/1 * * * * *', userSearchJob)
}

async function userSearchJob() {
  if (!allowedToRequest) return

  // Wait until all these API calls return something before we poll it again
  allowedToRequest = false

  const users = R.flatten(
    await Promise.all(
      [...Array(MAX_REQS_PS)].map(() =>
        listUsers({ page: ++currentPage, location: SEARCH_LOCATION }),
      ),
    ),
  )

  if (users.length > 0) {
    await User.insertMany(users)
  }

  allowedToRequest = true
}

async function listUsers({
  page = 1,
  pageSize = 100,
  location = '',
} = {}): Promise<IUser[]> {
  const { data, status } = await client.get(
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
  listUsers,
}
