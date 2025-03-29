import './App.css';
import CommunityComponent from './CommunityComponent';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

// Attach authentication token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach token
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div className='App'>
      <ApolloProvider client={client}>
        <CommunityComponent />
      </ApolloProvider>
    </div>
  );
}

export default App;
