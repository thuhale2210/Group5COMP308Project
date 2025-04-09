import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Business {
    id: ID!
    name: String!
    description: String
    images: [String]
    owner: ID!
    deals: [String]
    createdAt: String
  }

  type BusinessResponse {
    text: String
    respondedAt: String
  }

  type Review {
    id: ID!
    business: ID!
    author: ID!
    rating: Int!
    comment: String
    sentiment: String
    businessResponse: BusinessResponse
    createdAt: String
  }

  type Event {
    id: ID!
    title: String!
    description: String
    organizer: ID!
    date: String
    location: String
    volunteers: [ID]
    createdAt: String
  }

  type Query {
    getBusinesses: [Business]
    getBusinessesByOwner(ownerId: ID!): [Business]
    getBusiness(id: ID!): Business
    getReviews(businessId: ID!): [Review]
    getEvents: [Event]
  }

  type Mutation {
    createBusiness(name: String!, description: String, images: [String], owner: ID!): Business
    updateBusiness(id: ID!, name: String, description: String, images: [String]): Business
    deleteBusiness(id: ID!): String
    addDealToBusiness(businessId: ID!, deal: String!): Business
    removeDealFromBusiness(businessId: ID!, deal: String!): Business

    createReview(business: ID!, rating: Int!, comment: String): Review
    updateReview(id: ID!, rating: Int, comment: String): Review
    respondToReview(reviewId: ID!, responseText: String!): Review
    deleteReview(id: ID!): String

    createEvent(title: String!, description: String, organizer: ID!, date: String, location: String): Event
    updateEvent(id: ID!, title: String, description: String, date: String, location: String): Event
    deleteEvent(id: ID!): String
    joinEvent(eventId: ID!, userId: ID!): Event
  }
`;

export default typeDefs;