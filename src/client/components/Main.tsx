import * as React from 'react'
import { Container, Header } from 'semantic-ui-react'
import UserList from './UserList'

const Main = () => (
  <div>
    <Container text>
      <Header as='h1' dividing>
        Last brazilian users online at StackOverflow
      </Header>
      <UserList />
    </Container>
  </div>
)

export default Main
