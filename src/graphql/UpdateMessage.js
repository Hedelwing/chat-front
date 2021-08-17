import gql from 'graphql-tag'

export default gql`
          mutation($id: ID!, $body: String!) {
            updateMessage(id: $id, body: $body) {
              id
              body
              chatId
            }
          }
        `