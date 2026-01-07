import { gql } from "@apollo/client";

export const fetchMyIssues = gql`
  query myIssues {
    myIssues {
      id
      category
      description
      status
      latitude
      longitude
      area
      city
      user {
        id
        name
        role
      }
      created_at
    }
  }
`;

export const fetchAllIssues = gql`
  query allIssues {
    allIssues {
      id
      category
      description
      status
      latitude
      longitude
      area
      city
      user {
        id
        name
        role
      }
      created_at
    }
  }
`;
