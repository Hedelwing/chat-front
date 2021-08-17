import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { from, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { createUploadLink } from 'apollo-upload-client'
import { logout, isLoggedIn } from './utils'
import { cache } from './cache'

const httpLink = new createUploadLink({
  uri: process.env.NODE_ENV === "production" ? 'https://hedelwing-chat-server.herokuapp.com/graphql' : 'http://localhost:3003/graphql'
})

const getTokenScheme = () => {
  const token = localStorage.getItem('token')

  return token ? `Bearer ${token}` : ""
}

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getTokenScheme()
  }
}))


const wsLink = new WebSocketLink({
  uri: process.env.NODE_ENV === "production" ? 'wss://hedelwing-chat-server.herokuapp.com/graphql' : `ws://localhost:3003/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('token')
    }
  }
})

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED')
    logout()
})

export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query)

        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      authLink.concat(httpLink)
    )
  ]),
  cache,
  connectToDevTools: true,
  resolvers: {
    Query: {
      isLoggedIn
    }
  }
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueApollo)

export default apolloProvider