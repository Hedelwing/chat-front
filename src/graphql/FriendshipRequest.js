import gql from "graphql-tag"
import UserFragment from "./UserFragment";

export default gql`
    ${UserFragment}
    mutation($user: ID!) {
        sendFriendshipRequest(requested: $user) {
            requested {
                ...UserFragment
                areFriends
                areRequesterFriendship
                areRequestedFriendship
            }
        }
    }
`