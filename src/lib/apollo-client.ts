import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://arweave.net/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});