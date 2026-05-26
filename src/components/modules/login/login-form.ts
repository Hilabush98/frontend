import { gql } from "@apollo/client"

const LOGIN_FETCH = gql`
  query login() {
    locations {
      id
      name
      description
      photo
    }z
  }
`
export { LOGIN_FETCH }
