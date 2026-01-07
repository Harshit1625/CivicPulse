import { gql } from "@apollo/client";

export const CreateIssue = gql`
  mutation createIssue(
    $category: String!
    $description: String!
    $longitude: Float!
    $latitude: Float!
    $area: String!
    $city: String!
  ) {
    createIssue(
      category: $category
      description: $description
      latitude: $latitude
      longitude: $longitude
      area: $area
      city: $city
    ) {
      category
      description
      latitude
      longitude
      area
      city
    }
  }
`;

export const DeleteIssue = gql`
  mutation deleteIssue($id: ID!) {
    deleteIssue(id: $id)
  }
`;
