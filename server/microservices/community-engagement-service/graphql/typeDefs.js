import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    getAllPosts: [CommunityPost]
    getAllHelpRequests: [HelpRequest]
  }

  type CommunityPost @key(fields: "id") {
    id: ID!
    author: ID!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String!
    updatedAt: String
  }

  type HelpRequest @key(fields: "id") {
    id: ID!
    author: ID!
    description: String!
    location: String
    isResolved: Boolean!
    volunteers: [ID!]
    createdAt: String!
    updatedAt: String
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
