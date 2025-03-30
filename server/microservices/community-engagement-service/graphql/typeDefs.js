// community-engagement-service/graphql/typeDefs.js
import gql from "graphql-tag";

const typeDefs = gql`
  scalar DateTime

  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key"])

  extend type Query {
    getAllPosts: [CommunityPost]
    getAllHelpRequests: [HelpRequest]
  }

  type CommunityPost @key(fields: "id") {
    id: ID!
    author: User!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type HelpRequest @key(fields: "id") {
    id: ID!
    author: User!
    description: String!
    location: String
    isResolved: Boolean!
    volunteers: [User!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  extend type User @key(fields: "id") {
    id: ID!
  }

  extend type Mutation {
    createPost(title: String!, content: String!, category: String!): CommunityPost
    updatePost(id: ID!, title: String, content: String, category: String): CommunityPost
    deletePost(id: ID!): Boolean

    createHelpRequest(description: String!, location: String): HelpRequest
    updateHelpRequest(id: ID!, description: String, location: String): HelpRequest
    deleteHelpRequest(id: ID!): Boolean
    resolveHelpRequest(id: ID!): HelpRequest
    volunteerForHelp(id: ID!): HelpRequest
  }
`;

export default typeDefs;
