import { ApolloClient, InMemoryCache } from '@apollo/client';

export const loginClient = new ApolloClient({
    uri: 'http://localhost:4001/graphql',
    credentials: 'include',
    cache: new InMemoryCache(),
});

export const gatewayClient = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    cache: new InMemoryCache(),
});
