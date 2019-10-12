import axios from 'axios'

type User = {
  displayName: string
  location: string
}

const client = axios.create({ baseURL: 'https://api.stackexchange.com/2.2' })

export default {
  listUsers: async ({ page = 1, pageSize = 50 } = {}): Promise<User[]> => {
    const response = await client.get(
      `/users?page=${page}&pagesize=${pageSize}&site=stackoverflow`,
    )

    return response.data.items
  },
}
