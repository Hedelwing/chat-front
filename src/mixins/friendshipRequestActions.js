import receivedRequests from "../graphql/ReceivedRequests";
import acceptFriendship from "../graphql/AcceptFriendship";
import users from "../graphql/Users";
import friends from "../graphql/Friends";
import denyFriendship from "../graphql/DenyFriendship";
import { updateStore, updateById, removeById, unshift, setIn } from "../utils";

const acceptFriendshipMix = {
    methods: {
        acceptFriendship(id) {
            this.$apollo.mutate({
                mutation: acceptFriendship,
                variables: { id },
                update: (store, { data }) => {
                    const addInFriends = (data, { acceptFriendship: { requester } }) =>
                        setIn(data, 'friends', unshift(data.friends, requester))

                    updateStore(store, { query: friends }, data, addInFriends)

                    const removeFromRequests = (data, { acceptFriendship: { id } }) =>
                        setIn(data, 'receivedRequests', removeById(data.receivedRequests, id))

                    updateStore(store, { query: receivedRequests }, data, removeFromRequests)

                    const updateUsers = (data, { acceptFriendship: { requester } }) =>
                        setIn(data, 'users', updateById(data.users, requester.id, requester))

                    updateStore(store, { query: users }, data, updateUsers)
                },
            });
        },
        denyFriendship(id) {
            this.$apollo.mutate({
                mutation: denyFriendship,
                variables: { id },
                update: (store, { data }) => {
                    const removeFromRequests = (data, { denyFriendship: { id } }) =>
                        setIn(data, 'receivedRequests', removeById(data.receivedRequests, id))

                    updateStore(store, { query: receivedRequests }, data, removeFromRequests)

                    const updateUsers = (data, { acceptFriendship: { requester } }) =>
                        setIn(data, 'users', updateById(data.users, requester.id, requester))

                    updateStore(store, '{ query: users }', data, updateUsers)
                },
            });
        }
    },
}

export default acceptFriendshipMix