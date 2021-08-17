import gql from "graphql-tag";
import UserFragment from "./UserFragment";

export default gql`
    ${UserFragment}
    mutation($id: ID!) {
        denyFriendship(requester: $id) {
            id
            requester {
                ...UserFragment
                areFriends
                areRequesterFriendship
                areRequestedFriendship
            }
        }
    }
`