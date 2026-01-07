import gql from "graphql-tag";

const schema = gql`
  type User {
    id: ID
    name: String
    role: String
  }

  type Issue {
    id: ID!
    userId: ID!
    category: String!
    description: String!
    status: String!
    latitude: Float!
    longitude: Float!
    area: String!
    city: String!
    created_at: String!
    user: User
  }

  type Query {
    myIssues: [Issue]!
    allIssues: [Issue]!
  }

  type Mutation {
    createIssue(
      category: String!
      description: String!
      latitude: Float!
      longitude: Float!
      area: String!
      city: String!
    ): Issue

    deleteIssue(
      id: ID!
    ) : String!
  }
`;

export default schema;
