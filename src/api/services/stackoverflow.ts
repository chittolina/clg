import axios, { AxiosResponse } from 'axios'
import * as nodeSchedule from 'node-schedule'
import { Job } from 'node-schedule'
import User, { IUser } from '../models/user'
import * as R from 'ramda'

const SEARCH_LOCATION = 'Brazil'
const MAX_REQS_PS = 25
let searchJob: Job | null
let hasPendingRequests = false
let allowedToRequest = true
let currentPage = 0

const client = axios.create({
  baseURL: 'https://api.stackexchange.com/2.2',
  validateStatus: () => true, // Do not throw on 4xx/5xx
})

client.interceptors.response.use(checkBackoffTime)

async function checkBackoffTime(
  response: AxiosResponse,
): Promise<AxiosResponse> {
  const { data } = response

  if (data && data.backoff) {
    allowedToRequest = false

    const now = Date.now()
    const refreshDate = new Date(now + data.backoff / 1000).getTime()

    setTimeout(() => (allowedToRequest = true), refreshDate - now)

    return Promise.reject()
  }

  return response
}

async function userSearchJob() {
  if (!allowedToRequest) return
  if (hasPendingRequests || !allowedToRequest) return

  // Wait until all these API calls return something before we poll it again
  hasPendingRequests = true

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

  hasPendingRequests = false
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

  start: () => {
    if (process.env.NODE_ENV !== 'test') {
      searchJob = nodeSchedule.scheduleJob('*/10 * * * * *', searchUsers)
    }
  },

  stop: () => {
    if (searchJob) {
      searchJob.cancel()
    }
  },
}
