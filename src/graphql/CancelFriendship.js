import gql from "graphql-tag";

export default gql`
    mutation($ids: [ID]) {
        cancelFriendship(friends: $ids) 
    }
`