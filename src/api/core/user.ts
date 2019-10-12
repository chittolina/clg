import User, { IUser } from '../models/user'

export type User = IUser

const FILTERS = {
  desc: -1,
  asc: 1,
}

export default {
  listUsers: async (): Promise<User[]> => {
    // Note that there's no need to filter by location here as
    // we check it before inserting on the database
    const users = await User.find({}, null, {
      sort: { lastAccessDate: FILTERS.desc },
    })

    return users
  },
}
