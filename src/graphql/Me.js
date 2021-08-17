import gql from "graphql-tag";
import UserFragment from "./UserFragment";

export default gql`
    ${UserFragment}
    query {
        me {
            ...UserFragment
        }
    }
`