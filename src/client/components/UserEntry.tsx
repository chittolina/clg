import * as React from 'react'
import { Item } from 'semantic-ui-react'
import { User } from '../types'

interface UserEntryProps {
  user: User
}

const UserEntry: React.FunctionComponent<UserEntryProps> = props => (
  <Item>
    <Item.Image size='tiny' src={props.user.profileImage} />
    <Item.Content>
      <Item.Header>{props.user.displayName}</Item.Header>
      <Item.Meta>{props.user.location}</Item.Meta>
      <Item.Extra>{new Date(props.user.lastAccessDate).toString()}</Item.Extra>
    </Item.Content>
  </Item>
)

export default UserEntry
