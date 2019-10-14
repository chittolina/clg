import axios, { AxiosResponse } from 'axios'
import * as nodeSchedule from 'node-schedule'
import { Job } from 'node-schedule'
import User, { IUser } from '../models/user'
import * as R from 'ramda'

const SEARCH_LOCATION = 'Brazil'
const MAX_REQS_PS = process.env.MAX_REQS_PS || 25
let searchJob: Job | null
let hasPendingRequests = false
let allowedToRequest = true
let remainingQuota = Number.MAX_SAFE_INTEGER
let currentPage = 0

export const client = axios.create({
  baseURL: 'https://api.stackexchange.com/2.2',
  validateStatus: () => true, // Do not throw on 4xx/5xx
})

client.interceptors.response.use(checkBackoffTime)

async function checkBackoffTime(
  response: AxiosResponse,
): Promise<AxiosResponse> {
  const { data, status } = response

  if ((data && data.error_id == 502) || status == 503) {
    allowedToRequest = false
    // TODO: Come out with a better solution here
    // Try again in 24 hours
    setTimeout(() => (allowedToRequest = true), 24 * 60 * 60 * 1000)
  }

  if (data && data.quota_remaining) {
    remainingQuota = data.quota_remaining
  }

  if (data && data.backoff) {
    allowedToRequest = false

    setTimeout(() => (allowedToRequest = true), data.backoff * 1000)

    return Promise.reject()
  }

  return response
}

async function searchUsers() {
  if (hasPendingRequests || !allowedToRequest) {
    return
  }

  if (MAX_REQS_PS > remainingQuota) {
    return
  }

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
    try {
      await User.insertMany(users, { ordered: false })
    } catch (err) {
      console.log('Could not insert some users')
    }
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
        user.user_id &&
        user.location &&
        user.location.match(location) &&
        user.display_name &&
        user.last_access_date,
    )
    .map((user: any) => ({
      userId: user.user_id,
      displayName: user.display_name,
      lastAccessDate: user.last_access_date,
      location: user.location,
      profileImage: user.profile_image,
    }))

  return users
}

export default {
  listUsers,

  start: () => {
    searchJob = nodeSchedule.scheduleJob('*/1 * * * * *', searchUsers)
  },

  stop: () => {
    if (searchJob) {
      searchJob.cancel()
    }
  },
}
