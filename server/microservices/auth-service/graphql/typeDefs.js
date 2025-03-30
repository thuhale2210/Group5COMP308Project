// ✅ auth-service/typeDefs.js
import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key"])

  extend type Query {
    getUser(id: ID!): User
    currentUser: User
  }

  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  extend type Mutation {
    signup(username: String!, email: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

export default typeDefs;