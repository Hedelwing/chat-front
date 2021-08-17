import gql from "graphql-tag";

export default gql`
    fragment MessageFragment on Message {
        id
        chatId 
        body
        createdAt
        isViewed
        sender {
          id
          nickname
          avatar
        }
    }
`
