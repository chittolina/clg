import User, { IUser } from '../models/user'

export type User = IUser

export default {
  listUsers: async (): Promise<User[]> => {
    const users = await User.find({})

    return users
  },
}
