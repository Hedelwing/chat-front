import gql from "graphql-tag";

export default gql`
    fragment UserFragment on User {
        id
        nickname
        email
        avatar
        isOnline
    }
`
