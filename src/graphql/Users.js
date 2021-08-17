import gql from "graphql-tag";
import UserFragment from "./UserFragment";

export default gql`
    ${UserFragment}
    query($searched: String) {
        users(searched: $searched) {
            ...UserFragment
            areFriends
            areRequesterFriendship
            areRequestedFriendship
        }
    }
`