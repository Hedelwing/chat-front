import gql from 'graphql-tag'
import MessageFragment from './MessageFragment'

export const messageObserverQuery = gql`
  ${MessageFragment}
  subscription {
    messageObserver {
      type
      message {
        ...MessageFragment
      }
    }
  }
`

export const sendMessageQuery = gql`
  ${MessageFragment}
  mutation($id: ID!, $body: String!) {
    sendMessage(chatId: $id, body: $body) {
      ...MessageFragment
    }
  }
`