import { gql } from '@apollo/client';

export const GET_HACKERNOON_ARTICLES = gql`
  query GetHackernoonArticles($owner: String!, $cursor: String, $limit: Int!) {
    transactions(
      owners: [$owner]
      first: $limit
      after: $cursor
      sort: HEIGHT_DESC
    ) {
      edges {
        node {
          id
          owner {
            address
          }
          data {
            size
            type
          }
          tags {
            name
            value
          }
          block {
            timestamp
            height
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const HACKERNOON_WALLET = 'X8se6ANj4C-gpP_JH0ZbtJJEpyHBr0XQA-crCpbZGak';