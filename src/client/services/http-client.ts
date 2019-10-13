import axios from 'axios'

const client = axios.create({
  baseURL: process.env.API_URI,
  validateStatus: () => true,
})

export default {
  listUsers: async () => {
    const { data } = await client.get('/user')

    return data
  },
}
