import gql from 'graphql-tag'

export const signUpQuery = gql`
  mutation($nickname: String!, $email: String!, $password: String!) {
    signUp(nickname: $nickname, email: $email, password: $password) 
  }
`

export const signInQuery = gql`
  mutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`