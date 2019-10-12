import User, { IUser } from '../models/user'

export type User = IUser

const FILTERS = {
  desc: -1,
  asc: 1,
}

export default {
  listUsers: async (): Promise<User[]> => {
    const users = await User.find({}, null, {
      sort: { lastAccessDate: FILTERS.desc },
    })

    return users
  },
}
