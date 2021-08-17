import gql from "graphql-tag"

export const getChatQuery = gql`
    query($chatId: ID!, $fromMessage: ID) {
        chat(chatId: $chatId) {
          id
          title
          messages(fromMessage: $fromMessage) {
            id
            body
            createdAt
            chatId
            isViewed
            sender {
                id
                nickname
                avatar
            }
          }
          newMessages
        }
    }
`

export default gql`
    query {
        chats {
          id
          title
          messages {
            id
            body
            createdAt
            chatId
            isViewed
            sender {
                id
                nickname
                avatar
            }
        }
        newMessages
    }
}
`