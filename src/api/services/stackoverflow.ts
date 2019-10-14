import axios, { AxiosResponse } from 'axios'
import * as nodeSchedule from 'node-schedule'
import { Job } from 'node-schedule'
import User, { IUser } from '../models/user'
import * as R from 'ramda'

const SEARCH_LOCATION = 'Brazil'
const MAX_REQS_PS = process.env.MAX_REQS_PS
  ? parseInt(process.env.MAX_REQS_PS)
  : 25
let syncJob: Job | null
let hasPendingRequests = false
let allowedToRequest = true
let remainingQuota = Number.MAX_SAFE_INTEGER
let currentPage = 0

export const client = axios.create({
  baseURL: 'https://api.stackexchange.com/2.2',
  validateStatus: () => true, // Do not throw on 4xx/5xx
})

client.interceptors.response.use(checkFinishedSearch)
client.interceptors.response.use(checkBackoffTime)

async function checkFinishedSearch(
  response: AxiosResponse,
): Promise<AxiosResponse> {
  const { data } = response

  // If we finished the users pagination, go back to first page to sync the users data
  if (data && !data.has_more) {
    currentPage = 0
  }

  return response
}

async function checkBackoffTime(
  response: AxiosResponse,
): Promise<AxiosResponse> {
  const { data, status } = response

  if ((data && data.error_id == 502) || status == 503) {
    allowedToRequest = false
    // Try again in 30 seconds
    setTimeout(() => (allowedToRequest = true), 30 * 1000)
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

async function syncUsers() {
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
    const knownUsers = await User.find({
      userId: { $in: users.map(user => user.userId) },
    })
    const unknownUsers = users.filter(
      user => !knownUsers.find(knownUser => knownUser.userId == user.userId),
    )

    // Update the data for the users we already have stored
    await Promise.all(
      knownUsers.map(knownUser => {
        const newUserData = users.find(user => user.userId == knownUser.userId)

        User.update({ userId: knownUser.userId }, newUserData)
      }),
    )

    // Insert the users we don't have yet
    try {
      await User.insertMany(unknownUsers, {
        ordered: false,
      })
    } catch (err) {
      console.error('Could not insert some users')
    }
  }

  hasPendingRequests = false
}

async function listUsers({
  page = 1,
  pageSize = 100,
  location = '',
} = {}): Promise<IUser[]> {
  let response

  try {
    response = await client.get(
      `/users?page=${page}&pagesize=${pageSize}&site=stackoverflow`,
    )
  } catch (err) {
    console.error('An error occurred while listing users on StackOverflow API')
  }

  if (!response || !response.data || response.status !== 200) {
    return []
  }

  const users = response.data.items
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
    syncJob = nodeSchedule.scheduleJob('*/1 * * * * *', syncUsers)
  },

  stop: () => {
    if (syncJob) {
      syncJob.cancel()
    }
  },
}
