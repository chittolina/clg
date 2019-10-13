import * as React from 'react'
import { Item } from 'semantic-ui-react'
import { User } from '../types'
import UserEntry from './UserEntry'
import client from '../services/http-client'

interface UserListState {
  users: User[]
}

class UserList extends React.Component {
  state: UserListState = {
    users: [],
  }

  async componentDidMount() {
    const users = await client.listUsers()

    this.setState({ users })
  }

  render() {
    const { users } = this.state

    return (
      <Item.Group>
        {users.map(user => (
          <UserEntry user={user} />
        ))}
      </Item.Group>
    )
  }
}

export default UserList
