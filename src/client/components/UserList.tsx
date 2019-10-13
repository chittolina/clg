import * as React from 'react'
import { Item } from 'semantic-ui-react'
import { User } from '../types'
import UserEntry from './UserEntry'

interface UserListState {
  users: User[]
}

const users = [
  {
    displayName: 'Barmar',
    location: 'Arlington, MA',
    lastAccessDate: 1570952228865,
    profileImage:
      'https://www.gravatar.com/avatar/82f9e178a16364bf561d0ed4da09a35d?s=96&d=identicon&r=PG',
  },
  {
    displayName: 'VonC',
    location: 'France',
    lastAccessDate: 1570952228865,
    profileImage:
      'https://www.gravatar.com/avatar/7aa22372b695ed2b26052c340f9097eb?s=96&d=identicon&r=PG',
  },
  {
    displayName: 'T.J Crowder',
    location: 'United Kingdom',
    lastAccessDate: 1570952228865,
    profileImage:
      'https://www.gravatar.com/avatar/ca3e484c121268e4c8302616b2395eb9?s=96&d=identicon&r=PG',
  },
]

class UserList extends React.Component {
  state: UserListState = {
    users,
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
