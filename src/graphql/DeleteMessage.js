import gql from 'graphql-tag'

export default gql`
          mutation($id: ID!) {
            deleteMessage(id: $id) {
              id
              chatId
            }
          }
        `