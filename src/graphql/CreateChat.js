import gql from 'graphql-tag'

export const createChat = gql`
    mutation($title: String!, $members: [ID!]!) {
        createChat(title: $title, members: $members) {
            id
            title
        }
    }
`